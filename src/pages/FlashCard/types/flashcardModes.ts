export type ModeKey =
  | "ALL"
  | "RANDOM"
  | "QUIZ"
  | "MATCH"
  | "DICTATION";

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
  { key: "QUIZ", label: "Trắc nghiệm", icon: "🎯", requiredTier: "advanced" },
  { key: "MATCH", label: "Tìm cặp", icon: "🔗", requiredTier: "premium" },
  { key: "DICTATION", label: "Nghe chép chính tả", icon: "🎧", requiredTier: "premium" },
];