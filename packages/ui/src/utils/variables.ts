/** 提示类型 */
export const HINT_TYPES = [
    "primary",
    "success",
    "warning",
    "error",
    "info",
] as const;
/** 大小 */
export const SIZES = ["small", "medium", "large"] as const;
export type TsHintType = (typeof HINT_TYPES)[number] | "default";
export type Size = (typeof SIZES)[number];
