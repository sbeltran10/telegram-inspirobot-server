import "https://deno.land/x/dotenv/load.ts";
import { opine, opineCors, json } from "./deps.ts";
import { getQuote } from "./inspirobot-api.ts";
import { registerInspireWebhook, sendPhoto, answerInlineQuery } from "./telegram-api.ts";

try {
  const registerResponse = await registerInspireWebhook();
  console.log(await registerResponse.json())
} catch (err) {
  console.log(err)
}


const app = opine();
app.use(opineCors());
app.use(json());

interface Chat {
  id: number
}

interface Message {
  message_id: number,
  text: string,
  chat: Chat
};

interface InlineQuery {
  id: string
};

interface Update {
  update_id: number,
  message: Message,
  inline_query: InlineQuery
};

const token = Deno.env.get('TELEGRAM_TOKEN');

app.get(`/`, (req, res) => {
  res.send('Health check');
});

app.use((req, res, next) => {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});

app.post(`/${token}`, async (req, res) => {
  const update: Update = req.body;
  try {
    if (update.inline_query) {
      const quoteUrl = await getQuote();
      await answerInlineQuery(update.inline_query.id, quoteUrl);
    } else if (update.message.text === "/inspireme") {
      const quoteUrl = await getQuote();
      await sendPhoto(update.message.chat.id, quoteUrl);
    }
  } catch (err) {
    console.log(err)
  }
  res.send();
});

console.info(`Web server listening on port 8080`);
app.listen(8080);