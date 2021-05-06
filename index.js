// npm i node-telegram-bot-api nodemon
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '1871327654:AAGw0MZOzfnwzZv0G3-vBecVO2usO289QQ0';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async chatId => {
  await bot.sendMessage(
    chatId,
    'Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать! Готов?'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
};

const start = () => {
  // устанавливаем команды для пользователя:
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ]);

  bot.on('message', async msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
      // /start - при первом подключении
      await bot.sendSticker(
        chatId,
        'https://cdn.tlgrm.ru/stickers/422/93d/42293d5f-7cd5-49f6-a8fd-939f71b06a83/192/8.webp'
      );
      return bot.sendMessage(chatId, `Добро пожаловать`);
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}!`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Такой команды нету, попробуй еще раз');
  });

  // работа с кнопками:
  bot.on('callback_query', async msg => {
    const chatId = msg.message.chat.id;
    const data = msg.data;
    console.log(chats[chatId], data);

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
