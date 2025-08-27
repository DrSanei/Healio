// api/whatsapp-inbound.js (Express example)
import twilio from 'twilio';
 const accountSid = 'ACfe48996c2a9d2de5469abbf4f7bfb0b2';
const authToken = '2fe04ed68d005cf37ca82dd993b30ae0';
const client = twilio(accountSid, authToken);

import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: false })); // Twilio sends form-encoded

// Your mapping: from doctor’s WhatsApp to patient’s WhatsApp (store in DB)
const conversationMap = {
  // doctorWhatsAppNumber: patientWhatsAppNumber,
  '+98xxxxxxxxxx': '+98yyyyyyyyyy'
};

app.post('/api/whatsapp-inbound', (req, res) => {
  const from = req.body.From; // WhatsApp number of the sender
  const body = req.body.Body; // Message text

  // Lookup which patient to forward to
  const patientNumber = conversationMap[from.replace('whatsapp:', '')];
  if (!patientNumber) {
    return res.send('<Response></Response>');
  }

  // Forward message to patient
  client.messages
    .create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${patientNumber}`,
      body: `پاسخ پزشک: ${body}`
    })
    .then(() => res.send('<Response></Response>'))
    .catch(err => {
      console.error(err);
      res.status(500).send('<Response></Response>');
    });
});
