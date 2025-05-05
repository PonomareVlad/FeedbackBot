import { Bot } from 'grammy'

export const {
    TELEGRAM_CHAT_ID: id,
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(':').pop(),
} = process.env

export const bot = new Bot(token)

const safe = bot.errorBoundary(console.error)

safe.command('start', ctx => ctx.reply('Вы можете отправить произвольное количество сообщений с любым содержанием'))

safe.on('msg', ctx => ctx.forwardMessage(id).then(() => ctx.react('👌')))
