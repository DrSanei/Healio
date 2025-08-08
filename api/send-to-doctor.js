// /api/send-to-doctor.js
import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

const TELEGRAM_BOT_TOKEN = "8212298590:AAGrGnhis3LPuZtxKZDDscBSAFf7_OB4a9E";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { doctorNumber, patient, files, uniqueCode } = req.body;

    // 1. Look up doctor Telegram user ID in doctors table by wa_number (doctorNumber)
    const { data: doctor, error: docError } = await supabase
      .from('doctors')
      .select('telegram_user_id')
      .eq('wa_number', doctorNumber)
      .single();

    if (docError || !doctor || !doctor.telegram_user_id) {
      return res.status(400).json({
        error: "Doctor has not started the bot yet. Please ask them to click the onboarding link."
      });
    }

    const doctorTelegramId = doctor.telegram_user_id;

    // 2. Compose the consultation message
    let msg = `👤 *مشاوره جدید*\n`;
    msg += `*نام:* ${patient.firstName} ${patient.lastName}\n`;
    msg += `*شماره همراه:* ${patient.mobile}\n`;
    msg += `*شرح بیماری:*\n${patient.description}\n`;
    msg += `*کد مشاوره:* ${uniqueCode || ""}\n`;
    if (files && files.length) {
      msg += `\n*ضمائم:*\n`;
      files.forEach(url => {
        msg += url + '\n';
      });
    }

    // 3. Send the message to doctor
    const sentMsg = await bot.sendMessage(doctorTelegramId, msg, { parse_mode: 'Markdown' });
    const telegramMessageId = sentMsg.message_id;

    // 4. Send documents if any
    if (files && files.length) {
      for (const url of files) {
        await bot.sendDocument(doctorTelegramId, url);
      }
    }

    // 5. Optionally: update consultations table with telegram_message_id and doctor_telegram
    if (uniqueCode) {
      await supabase
        .from('consultations')
        .update({
          doctor_telegram: doctorTelegramId,
          telegram_message_id: telegramMessageId
        })
        .eq('unique_code', uniqueCode);
    }

    res.json({ success: true, telegramMessageId });
  } catch (err) {
    console.error('API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
