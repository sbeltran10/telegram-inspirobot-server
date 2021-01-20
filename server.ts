import "https://deno.land/x/dotenv/load.ts";
import { opine, opineCors, json } from "./deps.ts";
import { getQuote } from "./inspirobot-api.ts";
import { registerInspireWebhook, sendPhoto } from "./telegram-api.ts";

try {
  const registerResponse = await registerInspireWebhook();
  console.log(registerResponse)
} catch (err) {
  console.log(err)
}


const app = opine();
app.use((req, res, next) => {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
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

interface Update {
  update_id: number,
  message: Message
};

const token = Deno.env.get('TELEGRAM_TOKEN');

app.get(`/`, (req, res) => {
  res.send('Health check');
});

app.post(`/${token}/inspireme`, async (req, res) => {
  const update: Update = req.body;
  console.log(update.message.text);
  const quoteUrl = await getQuote();
  await sendPhoto(update.message.chat.id, "https://generated.inspirobot.me/a/YKemzxqRJr.jpg");
  res.send();
});

console.info(`Web server listening on port 8080`);
app.listen(8080);