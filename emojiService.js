export async function fetchEmojis(query) {
  try {
    const response = await fetch(`/.netlify/functions/emoji-search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching emojis:", error);
    return [];
  }
}
