// actions/stkPush.ts

'use server';

import axios from 'axios';

interface Params {
  mpesa_number: string;
  name: string;
  amount: number;
}

export const sendStkPush = async (body: Params) => {
  const { mpesa_number: phoneNumber, name, amount } = body;

  if (!phoneNumber || !name || !amount) {
    console.error("Missing phoneNumber, name, or amount");
    throw new Error("Missing phone number, name, or amount.");
  }

  const mpesaEnv = process.env.MPESA_ENVIRONMENT;
  const MPESA_BASE_URL = mpesaEnv === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke';

  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const tokenResp = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const token = tokenResp.data.access_token;

    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const formattedPhone = `254${cleanedNumber.slice(-9)}`;

    const date = new Date();
    const timestamp = 
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL!,
      AccountReference: name,
      TransactionDesc: `Payment for ${name}`,
    };

    console.log('📲 Sending STK Push:', payload);

    const stkPushResp = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ STK push success:', stkPushResp.data);

    return stkPushResp.data;

  } catch (error: any) {
    console.error('❌ STK push failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errorMessage || 'STK push failed');
  }
};




