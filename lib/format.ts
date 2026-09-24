import { Internship } from "./types";

type LocationFields = Pick<Internship, "city" | "work_mode">;

export function formatLocation({ city, work_mode }: LocationFields): string {
  return city === work_mode ? city : `${city} · ${work_mode}`;
}

type StipendFields = Pick<Internship, "stipend_min" | "stipend_max" | "stipend_note">;

export function formatStipend({ stipend_min, stipend_max, stipend_note }: StipendFields): string {
  if (stipend_min === null || stipend_max === null) {
    return "Stipend not disclosed";
  }

  if (stipend_min === 0 && stipend_max === 0) {
    return stipend_note ? `Unpaid (${stipend_note})` : "Unpaid";
  }

  const amount =
    stipend_min === stipend_max
      ? `₹${stipend_min.toLocaleString("en-IN")}/month`
      : `₹${stipend_min.toLocaleString("en-IN")} – ₹${stipend_max.toLocaleString("en-IN")}/month`;

  return stipend_note ? `${amount} (${stipend_note})` : amount;
}

export function formatPostedAt(postedAt: string, now: Date = new Date()): string {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysAgo = Math.floor((now.getTime() - new Date(postedAt).getTime()) / msPerDay);

  if (daysAgo <= 0) return "Posted today";
  if (daysAgo === 1) return "Posted 1 day ago";
  return `Posted ${daysAgo} days ago`;
}
