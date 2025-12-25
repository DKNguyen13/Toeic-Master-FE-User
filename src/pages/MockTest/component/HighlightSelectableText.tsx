import { Plus, Trash2 } from "lucide-react";
import FlashcardModal from "./FlashcardModal";
import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
}

const HighlightSelectableText: React.FC<Props> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRightMouse = useRef(false);

  const [selectedText, setSelectedText] = useState("");
  const [activeSpan, setActiveSpan] = useState<HTMLSpanElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");

  useEffect(() => {
    const closeMenu = () => setMenuPos(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) isRightMouse.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isRightMouse.current) return;
    isRightMouse.current = false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selected = selection.toString().trim();
    if (!selected) return;

    const range = selection.getRangeAt(0);

    if (
      !containerRef.current ||
      !containerRef.current.contains(range.commonAncestorContainer)
    )
      return;

    e.preventDefault();

    const span = document.createElement("span");
    span.style.backgroundColor = "rgb(255, 255, 123)";
    span.style.cursor = "pointer";
    span.dataset.highlight = "true";

    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    selection.removeAllRanges();

    /* Hover highlight → show menu */
    span.addEventListener("mouseenter", () => {
      if (!containerRef.current) return;

      const spanRect = span.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setActiveSpan(span);
      setSelectedText(span.innerText);
      setMenuPos({
        x: spanRect.left - containerRect.left + spanRect.width / 2,
        y: spanRect.top - containerRect.top - 8,
      });
    });
  };

  const handleRemoveHighlight = () => {
    if (!activeSpan || !activeSpan.parentNode) return;

    activeSpan.parentNode.replaceChild(
      document.createTextNode(activeSpan.innerText),
      activeSpan
    );

    setMenuPos(null);
    setActiveSpan(null);
  };

  return (
    <>
      {/* TEXT CONTAINER */}
      <div ref={containerRef}
        className="relative text-gray-800 leading-relaxed select-text"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}>
        {text}

        {/* Horizontal MENU */}
        {menuPos && (
          <div
            className="absolute z-50 flex items-center gap-1 bg-white border rounded-lg shadow-md px-1 py-1"
            style={{
              left: menuPos.x,
              top: menuPos.y,
              transform: "translate(-50%, -100%)",
            }}>
            <button className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 rounded"
              onClick={() => {
                setOpenModal(true);
                setMenuPos(null);
              }}>
              <Plus size={14} />
              Flashcard
            </button>

            <button className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
              onClick={handleRemoveHighlight}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <FlashcardModal
          defaultText={selectedText}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
          }}
          onNeedUpgrade={(msg) => {
            setOpenModal(false); 
            setUpgradeMsg(msg);
            setShowUpgrade(true);
          }}
        />
      )}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Nâng cấp tài khoản</h3>
            <p className="text-sm text-gray-600 mb-4">{upgradeMsg}</p>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => setShowUpgrade(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HighlightSelectableText;