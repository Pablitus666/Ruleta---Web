// netlify/functions/emoji-search.js
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const API_KEY = process.env.EMOJI_API_KEY;
  const query = event.queryStringParameters.q;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query" }),
    };
  }

  try {
    const res = await fetch(`https://emoji-api.com/emojis?search=${encodeURIComponent(query)}&access_key=${API_KEY}`);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API request failed" }),
    };
  }
};
