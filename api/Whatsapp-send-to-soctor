// /api/send-to-doctor.js

import twilio from 'twilio';

const accountSid = 'ACfe48996c2a9d2de5469abbf4f7bfb0b2';
const authToken = '2fe04ed68d005cf37ca82dd993b30ae0';
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { doctorNumber, patient, files } = req.body;

    let body = `👤 مشاوره جدید:\n`;
    body += `نام: ${patient.firstName} ${patient.lastName}\n`;
    body += `شماره: ${patient.mobile}\n`;
    body += `شرح بیماری:\n${patient.description}\n`;
    if (files && files.length) {
      body += '\nضمائم:\n';
      files.forEach(url => {
        body += url + '\n';
      });
    }

    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${doctorNumber}`,
      body,
    });

    for (const url of files) {
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${doctorNumber}`,
        mediaUrl: [url],
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
