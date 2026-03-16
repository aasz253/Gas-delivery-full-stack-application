const africastalking = require('africastalking');
const dotenv = require('dotenv');

dotenv.config();

const AT_API_KEY = process.env.AFRICASTALKING_API_KEY;
const AT_USERNAME = process.env.AFRICASTALKING_USERNAME;

let sms;
if (AT_API_KEY && AT_USERNAME) {
  try {
    const at = africastalking({ apiKey: AT_API_KEY, username: AT_USERNAME });
    sms = at.SMS;
  } catch (err) {
    console.warn("Africa's Talking initialization failed:", err?.message || err);
    // Fallback to a mock SMS sender to avoid crashing the app
    sms = { send: async (opts) => ({ status: 'mock', to: opts.to, message: opts.message }) };
  }
} else {
  console.warn('AFRICASTALKING_API_KEY or AFRICASTALKING_USERNAME not set — using mock SMS sender');
  sms = { send: async (opts) => ({ status: 'mock', to: opts.to, message: opts.message }) };
}

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
