/** Turn stanza-aligned chowtal translation text into prose paragraphs. */
export function chowtalMeaningParagraphs(translation: string): string[] {
  return translation
    .replace(/\r\n/g, "\n")
    .split(/\n\n+/)
    .map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.replace(/^##\s+/, "").trim())
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean);
}
