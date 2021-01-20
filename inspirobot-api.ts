const API_URL = "https://inspirobot.me/api?generate=true";

// Get beautiful inspirational quote
export const getQuote = async () => {
  const res = await fetch(API_URL);
  console.log(await res.text())
};