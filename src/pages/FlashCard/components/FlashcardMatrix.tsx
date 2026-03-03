import React, { useEffect, useMemo, useState } from 'react'

/* ================= TYPES ================= */

export interface Flashcard {
  _id?: string
  word: string
  meaning: string
}

type CardType = 'word' | 'meaning'
type CardStatus = 'idle' | 'correct' | 'wrong'

interface GameCard {
  id: string
  type: CardType
  content: string
  isMatched: boolean
  status: CardStatus
}

/* ================= CONSTANTS ================= */

const CHUNK_SIZE = 8

/* ================= UTILS ================= */

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/** 👉 shuffle rồi xen kẽ word – meaning */
function interleaveCards(
  cards: GameCard[],
  columns: number,
): GameCard[] {
  const words = shuffle(cards.filter((c) => c.type === 'word'))
  const meanings = shuffle(cards.filter((c) => c.type === 'meaning'))

  const total = cards.length
  const rows = Math.ceil(total / columns)

  // Tạo grid rỗng
  const grid: (GameCard | null)[][] = Array.from({ length: rows }, () =>
    Array(columns).fill(null),
  )

  let w = 0
  let m = 0

  // Đi theo CỘT → đảm bảo xen kẽ dọc
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      const isWordTurn = (row + col) % 2 === 0

      if (isWordTurn && words[w]) {
        grid[row][col] = words[w++]
      } else if (!isWordTurn && meanings[m]) {
        grid[row][col] = meanings[m++]
      }
    }
  }

  // Fill các ô trống (nếu lệch số lượng)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (!grid[row][col]) {
        grid[row][col] = words[w++] ?? meanings[m++] ?? null
      }
    }
  }

  // Flatten để render
  return grid.flat().filter(Boolean) as GameCard[]
}

/* ================= COMPONENT ================= */

interface Props {
  flashcards: Flashcard[]
  columns?: number
}

const FlashcardMatchGame: React.FC<Props> = ({ flashcards, columns = 4 }) => {
  const [roundIndex, setRoundIndex] = useState(0)
  const [cards, setCards] = useState<GameCard[]>([])
  const [selected, setSelected] = useState<GameCard[]>([])
  const [isRoundDone, setIsRoundDone] = useState(false)

  /* ===== chia round ===== */
  const rounds = useMemo(
    () =>
      chunkArray(
        flashcards.filter((f) => f._id),
        CHUNK_SIZE,
      ),
    [flashcards],
  )

  const currentRound = rounds[roundIndex] ?? []

  /* ===== build cards (XEN KẼ) ===== */
  useEffect(() => {
    const base: GameCard[] = []

    currentRound.forEach((fc) => {
      base.push(
        {
          id: fc._id!,
          type: 'word',
          content: fc.word,
          isMatched: false,
          status: 'idle',
        },
        {
          id: fc._id!,
          type: 'meaning',
          content: fc.meaning,
          isMatched: false,
          status: 'idle',
        },
      )
    })

    setCards(interleaveCards(base, columns))
    setSelected([])
  }, [currentRound, columns])

  /* ===== click ===== */
  const handleClick = (card: GameCard) => {
    if (card.isMatched) return
    if (selected.length === 2) return
    if (selected.includes(card)) return

    setSelected((prev) => [...prev, card])
  }

  /* ===== check match ===== */
  useEffect(() => {
    if (selected.length !== 2) return

    const [a, b] = selected
    const isMatch = a.id === b.id && a.type !== b.type

    if (isMatch) {
      // ĐÚNG
      setCards((prev) => prev.map((c) => (c.id === a.id ? { ...c,status: 'correct' } : c)))

      setTimeout(() => {
        setCards((prev) => {
          const updated = prev.map((c) =>
            c.id === a.id ? { ...c, isMatched: true, status: 'idle' as CardStatus } : c,
          )
          const done = updated.every((c) => c.isMatched)
          if (done) {
            setIsRoundDone(true)
          }

          return updated
        })
        setSelected([])
      }, 500)
    } else {
      const selectedIds = selected.map((c) => `${c.id}-${c.type}`)

      // SAI → hiện đỏ
      setCards((prev) =>
        prev.map((c) =>
          selectedIds.includes(`${c.id}-${c.type}`)
            ? { ...c, status: 'wrong' }
            : c,
        ),
      )

      // Sau 500ms → xoá đỏ
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            selectedIds.includes(`${c.id}-${c.type}`)
              ? { ...c, status: 'idle' }
              : c,
          ),
        )
        setSelected([])
      }, 500)
    }
  }, [selected])

  /* ===== hoàn thành round ===== */
  useEffect(() => {
    if (!isRoundDone) return
    if (roundIndex >= rounds.length - 1) return

    const timer = setTimeout(() => {
      setRoundIndex((i) => i + 1)
      setIsRoundDone(false) // reset cho round sau
    }, 700)

    return () => clearTimeout(timer)
  }, [isRoundDone, roundIndex, rounds.length])

  /* ================= RENDER ================= */

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-gray-700'>
          🧩 Lượt {roundIndex + 1} / {rounds.length}
        </h3>

        <button
          onClick={() => setRoundIndex(0)}
          className='px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200'
        >
          🔄 Chơi lại
        </button>
      </div>

      <div
        className='grid gap-3'
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {cards.map((card) => {
          if (card.isMatched) {
            return (
              <div
                key={`${card.id}-${card.type}`}
                className='min-h-[110px] rounded-lg'
              />
            )
          }

          const isSelected = selected.includes(card)

          return (
            <div
              key={`${card.id}-${card.type}`}
              onClick={() => handleClick(card)}
              className={`
                min-h-[110px] p-3 rounded-lg flex items-center justify-center text-center
                border-2 cursor-pointer select-none transition-all duration-300
                ${
                  card.type === 'word'
                    ? 'text-orange-500 font-semibold'
                    : 'text-blue-600'
                }
                ${isSelected ? 'border-blue-500' : 'border-gray-200'}
                ${
                  card.status === 'correct'
                    ? 'bg-green-200 border-green-500 animate-pulse'
                    : ''
                }
                ${card.status === 'wrong' ? 'bg-red-200 border-red-500' : ''}
              `}
            >
              {card.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FlashcardMatchGame
