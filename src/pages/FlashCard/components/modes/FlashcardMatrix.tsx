import { RefreshCcw } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

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

const CHUNK_SIZE = 8

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

function interleaveCards(cards: GameCard[], columns: number): GameCard[] {
  const words = shuffle(cards.filter((c) => c.type === 'word'))
  const meanings = shuffle(cards.filter((c) => c.type === 'meaning'))

  const total = cards.length
  const rows = Math.ceil(total / columns)

  const grid: (GameCard | null)[][] = Array.from({ length: rows }, () =>
    Array(columns).fill(null)
  )

  let w = 0
  let m = 0

  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      const isWordTurn = (row + col) % 2 === 0
      if (isWordTurn && words[w]) grid[row][col] = words[w++]
      else if (!isWordTurn && meanings[m]) grid[row][col] = meanings[m++]
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (!grid[row][col]) {
        grid[row][col] = words[w++] ?? meanings[m++] ?? null
      }
    }
  }

  return grid.flat().filter(Boolean) as GameCard[]
}

interface Props {
  flashcards: Flashcard[]
  columns?: number
}

const FlashcardMatrix: React.FC<Props> = ({ flashcards, columns = 4 }) => {
  const [roundIndex, setRoundIndex] = useState(0)
  const [cards, setCards] = useState<GameCard[]>([])
  const [selected, setSelected] = useState<GameCard[]>([])
  const [isRoundDone, setIsRoundDone] = useState(false)
  const [gameKey, setGameKey] = useState(0)

  const isProcessingRef = useRef(false)

  const speak = (text: string) => {
    speechSynthesis.cancel()

    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.rate = 0.9
      speechSynthesis.speak(utter)
    }, 30)
  }

  const rounds = useMemo(
    () => chunkArray(flashcards.filter((f) => f._id), CHUNK_SIZE),
    [flashcards]
  )

  const currentRound = rounds[roundIndex] ?? []

  useEffect(() => {
    const base: GameCard[] = []

    currentRound.forEach((fc) => {
      base.push(
        { id: fc._id!, type: 'word', content: fc.word, isMatched: false, status: 'idle' },
        { id: fc._id!, type: 'meaning', content: fc.meaning, isMatched: false, status: 'idle' }
      )
    })

    setCards(interleaveCards(base, columns))
    setSelected([])
    setIsRoundDone(false)
    isProcessingRef.current = false
  }, [currentRound, columns, gameKey])

  const handleClick = (card: GameCard) => {
    if (isProcessingRef.current) return
    if (card.isMatched) return
    if (selected.includes(card)) return
    if (selected.length === 2) return

    setSelected((prev) => [...prev, card])
  }

  useEffect(() => {
    if (selected.length !== 2) return
    if (isProcessingRef.current) return

    isProcessingRef.current = true
    const [a, b] = selected
    const isMatch = a.id === b.id && a.type !== b.type
    const selectedIds = selected.map((c) => `${c.id}-${c.type}`)

    if (isMatch) {
      speak(a.type === 'word' ? a.content : b.content)

      setCards((prev) =>
        prev.map((c) =>
          c.id === a.id ? { ...c, status: 'correct' } : c
        )
      )

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a.id
              ? { ...c, isMatched: true, status: 'idle' }
              : c
          )
        )

        setSelected([])
        isProcessingRef.current = false

        setTimeout(() => {
          setCards((prev) => {
            const remaining = prev.filter((c) => !c.isMatched)
            if (remaining.length === 0) setIsRoundDone(true)
            return prev
          })
        }, 0)
      }, 500)
    } else {
      setCards((prev) =>
        prev.map((c) =>
          selectedIds.includes(`${c.id}-${c.type}`)
            ? { ...c, status: 'wrong' }
            : c
        )
      )

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            selectedIds.includes(`${c.id}-${c.type}`)
              ? { ...c, status: 'idle' }
              : c
          )
        )

        setSelected([])
        isProcessingRef.current = false
      }, 500)
    }
  }, [selected])

  useEffect(() => {
    if (!isRoundDone || roundIndex >= rounds.length - 1) return

    const timer = setTimeout(() => {
      setRoundIndex((i) => i + 1)
      setIsRoundDone(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [isRoundDone, roundIndex, rounds.length])

  const progress = ((roundIndex + (isRoundDone ? 1 : 0)) / rounds.length) * 100

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">Flashcard Matrix</h2>
          <p className="text-gray-500 text-sm">Ghép từ - nghĩa</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Lượt</div>
            <div className="text-sm font-semibold text-gray-700">{roundIndex + 1} / {rounds.length}</div>
          </div>

          <button
            onClick={() => {
              setRoundIndex(0)
              setSelected([])
              setIsRoundDone(false)
              setGameKey((k) => k + 1)
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all active:scale-95">
            <RefreshCcw className="h-5 w-5" />
            <span className="font-medium">Chơi lại</span>
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 to-blue-500 transition-all duration-700" style={{ width: `${progress}%` }}/>
      </div>

      {/* BOARD */}
      <div className="grid gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-100 shadow-xl shadow-gray-200/50"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {cards.map((card) => {
          if (card.isMatched) {
            return (
              <div key={`${card.id}-${card.type}`}
                className="min-h-[120px] rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-center shadow-inner"
              />
            )
          }

          const isSelected = selected.includes(card)

          return (
            <div key={`${card.id}-${card.type}`}
              onClick={() => handleClick(card)}
              className={`
                group relative min-h-[120px] p-6 rounded-2xl
                flex items-center justify-center text-center
                border-2 cursor-pointer select-none transition-all duration-300
                bg-white shadow-sm hover:shadow-xl active:scale-[0.97]

                ${card.type === 'word' ? 'border-orange-200 hover:border-orange-400' : 'border-blue-200 hover:border-blue-400'}
                ${isSelected ? 'border-blue-500 shadow-blue-200 scale-[1.03] ring-4 ring-blue-100' : ''}
                ${card.status === 'correct' ? 'bg-emerald-50 border-emerald-400 scale-105' : ''}
                ${card.status === 'wrong' ? 'bg-red-50 border-red-400' : ''}
              `}>

              <div className="absolute top-4 right-4">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm
                  ${card.type === 'word' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}
                `}>
                  {card.type === 'word' ? 'W' : 'M'}
                </div>
              </div>
              <span className="text-lg md:text-lg font-medium leading-tight text-gray-700">{card.content}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FlashcardMatrix