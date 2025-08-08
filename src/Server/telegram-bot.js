// server/telegram-bot.js
import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

const TELEGRAM_BOT_TOKEN = "8212298590:AAGrGnhis3LPuZtxKZDDscBSAFf7_OB4a9E";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  // Here you must associate this Telegram userId to a doctor or patient.
  // For doctors: match by wa_number, or prompt user to enter their phone number
  bot.sendMessage(chatId, 'سلام! ربات مشاوره هیلیو برای شما فعال شد. پزشک شما تا حدود 24 ساعت آینده به مشاوره شما پاسخ خواهد داد. با سپاس و آرزوی سلامتی برای شما.....');
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
    // Optionally, try to parse unique_code from message text as backup
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