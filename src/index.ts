import { Bot, Context, InlineKeyboard, session } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { env } from "process";
import * as db from "./db";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(
  `${env.BOT_TOKEN || "7052291391:AAEr6BeSC9YFt4bSnXij36kG9T4jiI3ujRU"}`
);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

async function manageEventInvite(conversation: MyConversation, ctx: MyContext) {
  const { from } = ctx;
  if (!from) return;

  const { id: userId } = from;
  const isUserRegistered = await db.getUser(userId);

  if (isUserRegistered) {
    await ctx.reply("Вы уже зарегистрированы на бал Золушки!");
    return;
  }

  await ctx.reply(
    "Вы еще не зарегистрированы на бал Золушки. Для регистрации, пожалуйста, пришлите ваше имя."
  );

  const firstName = await requestTextInput(
    conversation,
    "Пожалуйста, пришлите имя."
  );
  await ctx.reply(`${firstName}, теперь пришлите вашу фамилию.`);

  const lastName = await requestTextInput(
    conversation,
    "Пожалуйста, пришлите фамилию."
  );
  await ctx.reply(
    `${firstName} ${lastName}, теперь нужно селфи-фото для завершения регистрации.`
  );

  const selfie = await conversation.waitFor([":photo", ":document"], {
    otherwise: () => ctx.reply("Пожалуйста, пришлите селфи-фото."),
  });

  if (selfie) {
    const selfieSize = calculateSelfieSize(selfie);
    await db.addUser(userId, firstName, lastName, selfieSize);

    const inviteButton = new InlineKeyboard().text(
      "Выслать адрес",
      "get-invite"
    );
    await ctx.reply(
      `Спасибо за регистрацию, ${firstName} ${lastName}! Ждем вас на вечеринку Белоснежки.`,
      {
        reply_markup: inviteButton,
      }
    );
  }
}

async function requestTextInput(conversation, prompt) {
  return (await conversation.waitFor(":text", {
    otherwise: () => conversation.ctx.reply(prompt),
  }))!.msg.text;
}

function calculateSelfieSize(selfie) {
  return (
    (selfie.msg.photo
      ? selfie.msg.photo[0].file_size
      : selfie.msg.document?.file_size) / 1000
  );
}

bot.use(createConversation(manageEventInvite));

bot.command("get_invite", (ctx) => ctx.conversation.enter("manageEventInvite"));
bot.command("start", (ctx) =>
  ctx.reply(
    "Здравствуйте, вас приветствует бот для регистрации на бал Золушки! Чтобы получить приглашение на бал введите команду /get_invite"
  )
);

bot.callbackQuery("get-invite", async (ctx) => {
  await ctx.replyWithLocation(22.312771, 114.041931);
  await ctx.answerCallbackQuery();
});

bot.start();
