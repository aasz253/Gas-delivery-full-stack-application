const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

const stkPush = async (amount, phoneNumber, orderId) => {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query' || 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const data = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: `${process.env.MPESA_CALLBACK_URL}/api/payments/callback`,
    AccountReference: orderId,
    TransactionDesc: 'GasLink Delivery Payment',
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('M-Pesa STK Push error:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
};

module.exports = { stkPush };
