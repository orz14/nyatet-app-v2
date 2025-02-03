import { format } from "date-fns";
import { id } from "date-fns/locale";

export function roleNameFormat(role: string) {
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function timeFormat(time: string, pattern?: string) {
  const date = new Date(time);
  return format(date, pattern ?? "d MMMM yyyy HH:mm", { locale: id });
}

export function capitalize(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
