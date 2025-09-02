// routes/whatsapp.js
import express from 'express';
import twilio from 'twilio';
const router = express.Router();

 const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);

router.post('/send-to-doctor', async (req, res) => {
  try {
    const { doctorNumber, patient, files } = req.body;

    // Compose the message
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

    // Send message to doctor
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${doctorNumber}`,
      body,
    });

    // Optionally send files (images, pdf, etc.) as media messages
    for (const url of files) {
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${doctorNumber}`,
        mediaUrl: [url],
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
