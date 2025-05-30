// emojiService.js (para frontend)
export async function getEmojiForWord(word) {
  try {
    const response = await fetch(`/api/emoji-search?q=${encodeURIComponent(word)}`);
    const results = await response.json();
    return results.length > 0 ? results[0].character : null;
  } catch (error) {
    console.error("Error fetching emoji:", error);
    return null;
  }
}
