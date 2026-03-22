export type ModeKey =
  | "ALL"
  | "RANDOM"
  | "TRUE_FALSE"
  | "QUIZ"
  | "MATCH"
  | "DICTATION"
  | "LISTEN_PICK"
  | "SHADOWING";

export type UserTier = "basic" | "advanced" | "premium";

export interface ModeConfig {
  key: ModeKey;
  label: string;
  icon: string;
  requiredTier?: UserTier;
}

export const MODE_CONFIG: ModeConfig[] = [
  { key: "ALL", label: "Xem toàn bộ thẻ", icon: "📖" },
  { key: "RANDOM", label: "Ngẫu nhiên", icon: "🔀"},
  { key: "TRUE_FALSE", label: "Đúng / Sai", icon: "⚖️", requiredTier: "basic" },
  { key: "QUIZ", label: "Trắc nghiệm", icon: "🎯", requiredTier: "advanced" },
  { key: "LISTEN_PICK", label: "Nghe và chọn", icon: "🃏", requiredTier: "advanced" },
  { key: "MATCH", label: "Tìm cặp", icon: "🔗", requiredTier: "premium" },
  { key: "DICTATION", label: "Nghe chép chính tả", icon: "🎧", requiredTier: "premium" },
  { key: "SHADOWING", label: "Nói theo", icon: "🗣️", requiredTier: "premium" },
];