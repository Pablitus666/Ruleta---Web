// emojiService.js
export async function searchEmojis(query) {
  const response = await fetch(`/api/emoji-search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
}
