import type { ChangeEvent } from "react";

/** FloatingLabelInput may pass a string on blur trim (email inputs always), not only a ChangeEvent. */
export function readFloatingLabelInputValue(
  value: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
): string {
  return typeof value === "string" ? value : value.target.value;
}
