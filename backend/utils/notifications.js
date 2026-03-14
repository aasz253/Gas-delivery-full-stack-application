const africastalking = require('africastalking');
const dotenv = require('dotenv');

dotenv.config();

const options = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
};

const at = africastalking(options);
const sms = at.SMS;

const sendSMS = async (to, message) => {
  try {
    const result = await sms.send({
      to,
      message,
    });
    console.log('SMS sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
};

const sendWhatsApp = async (to, message) => {
  // Africa's Talking WhatsApp is still in beta or requires specific setup.
  // For now, we'll use a placeholder or simulate it via SMS as the user mentioned AT for both.
  // In a real scenario, we'd use AT's WhatsApp API or a dedicated provider.
  console.log(`WhatsApp to ${to}: ${message}`);
  // return await sendSMS(to, `[WhatsApp Simulator]: ${message}`);
};

module.exports = { sendSMS, sendWhatsApp };
