import type { NextApiRequest, NextApiResponse } from 'next';

// Optional: Safaricom IPs (for production)
const safaricomIPs = [
  '196.201.214.200',
  '196.201.214.206',
  '196.201.213.114',
  '196.201.214.207',
  '196.201.214.208',
  '196.201.213.44',
  '196.201.212.127',
  '196.201.212.138',
  '196.201.212.129',
  '196.201.212.136',
  '196.201.212.74',
  '196.201.212.69'
];

const getClientIP = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '';
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 🛜 IP address logging
  const clientIp = getClientIP(req);
  console.log('🔐 Client IP:', clientIp);

  // 🧪 For sandbox testing, skip this. Enable in production only.
  const isSandbox = process.env.MPESA_ENVIRONMENT === 'sandbox';
  if (!isSandbox && !safaricomIPs.includes(clientIp)) {
    console.warn('⛔ Unauthorized IP:', clientIp);
    return res.status(403).json({ error: 'IP not allowed' });
  }

  // 🔑 Validate security key (optional, if you set one)
  const { securityKey } = req.query;
  if (
    process.env.MPESA_CALLBACK_SECRET_KEY &&
    securityKey !== process.env.MPESA_CALLBACK_SECRET_KEY
  ) {
    console.warn('🔒 Invalid security key:', securityKey);
    return res.status(401).json({ error: 'Invalid security key' });
  }

  // 🔍 Parse Safaricom STK callback
  const data = req.body;
  console.log('📨 Raw callback body:', JSON.stringify(data, null, 2));

  const callback = data?.Body?.stkCallback;

  if (!callback) {
    console.warn('❌ Missing stkCallback');
    return res.status(400).json({ error: 'Invalid callback format' });
  }

  // ❌ Handle failed STK pushes
  if (!callback.CallbackMetadata) {
    console.log('❌ STK Push failed:', callback?.ResultDesc);
    return res.status(200).json({ message: 'STK push failed', details: callback.ResultDesc });
  }

  // ✅ Extract metadata from successful transaction
  const metadata = callback.CallbackMetadata.Item;

  const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
  const mpesaCode = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
  const phone = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value?.toString();

  try {
    // 🔄 Store in database or trigger post-payment logic here
    console.log('✅ Payment received:', {
      amount,
      mpesaCode,
      phone,
      raw: metadata
    });

    return res.status(200).json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('❌ Error handling callback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}