// https://api.telegram.org/bot<token>/METHOD_NAME
const token = Deno.env.get("TELEGRAM_TOKEN");
const BASE_TELEGRAM_URL = `https://api.telegram.org/bot${token}`

// Register webhook
export const registerInspireWebhook = () => {
  return fetch(`${BASE_TELEGRAM_URL}/setWebhook`, {
    method: "POST",
    body: JSON.stringify({
      url: `${Deno.env.get("SERVER_BASE_URL")}/${token}`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const sendPhoto = async (chatId: number, photo: string) => {
  return fetch(`${BASE_TELEGRAM_URL}/sendPhoto`, {
    method: "POST",
    body: JSON.stringify({
      chat_id: chatId,
      photo
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const answerInlineQuery = async (inlineQueryId: string, photo: string) => {
  return fetch(`${BASE_TELEGRAM_URL}/answerInlineQuery`, {
    method: "POST",
    body: JSON.stringify({
      inline_query_id: inlineQueryId,
      results: [{
        type: "photo",
        id: photo,
        photo_url: photo,
        thumb_url: photo
      }]
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}