// server/telegram-bot.js
import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

const TELEGRAM_BOT_TOKEN = "8212298590:AAGrGnhis3LPuZtxKZDDscBSAFf7_OB4a9E";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Onboarding for doctors: Ask for their wa_number, then save user_id
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'سلام! لطفا شماره موبایل (واتساپ) خود را جهت ثبت وارد کنید:');
  bot.once('message', async (phoneMsg) => {
    const phone = phoneMsg.text.trim();
    await supabase
      .from('doctors')
      .update({ telegram_user_id: userId })
      .eq('wa_number', phone);
    bot.sendMessage(chatId, 'شماره شما ثبت و بات فعال شد. پزشک شما تا حدود 24 ساعت آینده به مشاوره شما پاسخ خواهد داد. با سپاس و آرزوی سلامتی برای شما.');
  });
});

// Reply forwarding: Forward doctor's reply to patient
bot.on('message', async (msg) => {
  if (!msg.reply_to_message) return;

  const doctorId = msg.from.id;
  const repliedMsgId = msg.reply_to_message.message_id;
  const replyText = msg.text || "";

  // Find the consult row by telegram_message_id
  const { data: consult, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('telegram_message_id', repliedMsgId)
    .single();

  if (error || !consult) {
    return;
  }

  const patientTelegramId = consult.patient_telegram;
  if (!patientTelegramId) {
    bot.sendMessage(doctorId, "شماره تلگرام بیمار ثبت نشده است.");
    return;
  }
  await bot.sendMessage(patientTelegramId, `پاسخ پزشک:\n${replyText}`);
  await bot.sendMessage(doctorId, "پاسخ شما به بیمار ارسال شد.");
});