 const accountSid = 'ACfe48996c2a9d2de5469abbf4f7bfb0b2';
const authToken = '2fe04ed68d005cf37ca82dd993b30ae0';
import twilio from 'twilio';
const client = twilio(accountSid, authToken);


client.messages
    .create({
   
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+37455609789', // Must be in sandbox!
        body: 'سلام! پیام آزمایشی شما از طریق Twilio WhatsApp API.'
    })
  .then(message => console.log('Sent!', message.sid))
  .catch(err => console.error('Error:', err));