import { format } from "date-fns";
import { id } from "date-fns/locale";

export const roleNameFormat = (role: string) => {
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const timeFormat = (time: string) => {
  const date = new Date(time);
  return format(date, "d MMMM yyyy HH:mm", { locale: id });
};
