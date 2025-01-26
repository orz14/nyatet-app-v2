export function sanitizeInput(input: string | any) {
  if (typeof input !== "string") return input;
  const allowedCharacters = /[^a-zA-Z0-9.,?!@#\-_\s]/g;
  return input.replace(allowedCharacters, "").trim();
}
