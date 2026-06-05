import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { config } from "../../../config/env.config"

interface UseBlockNavigationProps {
  shouldBlock: boolean
  onConfirmLeave?: () => Promise<void> | void
  sessionId?: string
}

export function useBlockNavigation({
  shouldBlock,
  onConfirmLeave,
  sessionId,
}: UseBlockNavigationProps) {
  const navigate = useNavigate()

  const sessionIdRef = useRef<string | undefined>(sessionId)
  const onConfirmLeaveRef = useRef(onConfirmLeave)

  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  useEffect(() => {
    onConfirmLeaveRef.current = onConfirmLeave
  }, [onConfirmLeave])

  const pauseByKeepAliveFetch = () => {
    const currentSessionId = sessionIdRef.current

    if (!currentSessionId) return

    const token = sessionStorage.getItem("accessToken")

    if (!token) return

    fetch(`${config.apiBaseUrl}/api/session/${currentSessionId}/pause`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason: "leave_page",
      }),
      keepalive: true,
    })
  }

  // Cảnh báo khi reload / đóng tab / đóng trình duyệt
  useEffect(() => {
    if (!shouldBlock) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [shouldBlock])

  // Gửi pause khi trang bị ẩn / đóng / reload
  useEffect(() => {
    if (!shouldBlock) return

    const handlePageHide = () => {
      pauseByKeepAliveFetch()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseByKeepAliveFetch()
      }
    }

    window.addEventListener("pagehide", handlePageHide)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("pagehide", handlePageHide)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [shouldBlock])

  // Chặn click link nội bộ
  useEffect(() => {
    if (!shouldBlock) return

    const handleClick = async (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a")

      if (link && link.href && link.origin === window.location.origin) {
        e.preventDefault()
        e.stopPropagation()

        const confirmLeave = window.confirm(
          "Bạn có chắc muốn rời trang này không? Bài thi sẽ được tạm dừng.",
        )

        if (confirmLeave) {
          await onConfirmLeaveRef.current?.()

          navigate(link.pathname + link.search + link.hash)
        }
      }
    }

    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("click", handleClick, true)
    }
  }, [shouldBlock, navigate])

  // Chặn nút back
  useEffect(() => {
    if (!shouldBlock) return

    window.history.pushState(null, "", window.location.href)

    const handlePopState = async () => {
      const confirmLeave = window.confirm(
        "Bạn có chắc muốn thoát không? Bài thi sẽ được tạm dừng.",
      )

      if (confirmLeave) {
        await onConfirmLeaveRef.current?.()

        window.removeEventListener("popstate", handlePopState)
        window.history.go(-2)
      } else {
        window.history.pushState(null, "", window.location.href)
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [shouldBlock])
}
