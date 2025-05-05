import { Bot, InlineKeyboard } from 'grammy'
import { autoQuote } from '@roziscoding/grammy-autoquote'
import { StatelessQuestion } from '@grammyjs/stateless-question'

export const {
    TELEGRAM_CHAT_ID: chat,
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(':').pop(),
} = process.env

export const bot = new Bot(token)

const safe = bot.errorBoundary(console.error)

const answerQuestion = new StatelessQuestion('answer', (ctx, id) =>
    ctx.copyMessage(id).then(() => ctx.react('👌'))
)

safe.use(autoQuote())

safe.use(answerQuestion.middleware())

safe.command('start', ctx =>
    ctx.reply(`
Вы можете отправить произвольное количество сообщений с любым содержанием
`)
)

safe.on('msg', ctx =>
    ctx
        .copyMessage(chat, {
            reply_markup: new InlineKeyboard().text(
                'Ответить',
                String(ctx.chatId)
            ),
        })
        .then(() => ctx.react('👌'))
)

safe.on('callback_query:data', ctx =>
    answerQuestion
        .replyWithMarkdown(ctx, 'Напишите ваш ответ', ctx.callbackQuery.data)
        .finally(() => ctx.answerCallbackQuery())
)
