import twilio from 'twilio';

 const accountSid = 'ACfe48996c2a9d2de5469abbf4f7bfb0b2';
const authToken = '2fe04ed68d005cf37ca82dd993b30ae0';
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
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

  // Send message to doctor
  await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${doctorNumber}`,
    body,
  });

  // Optionally send files as media messages
  for (const url of files) {
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${doctorNumber}`,
      mediaUrl: [url],
    });
  }

  res.json({ success: true });
}
