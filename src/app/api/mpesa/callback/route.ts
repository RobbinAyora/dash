import { NextRequest, NextResponse } from 'next/server';

const safaricomIPs = [
  '196.201.214.200', '196.201.214.206', '196.201.213.114',
  '196.201.214.207', '196.201.214.208', '196.201.213.44',
  '196.201.212.127', '196.201.212.138', '196.201.212.129',
  '196.201.212.136', '196.201.212.74', '196.201.212.69'
];

const getClientIP = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return ''; // ✅ fallback if header is missing
};

export async function POST(req: NextRequest) {
  const clientIp = getClientIP(req);
  console.log('🔐 Client IP:', clientIp);

  const isSandbox = process.env.MPESA_ENVIRONMENT === 'sandbox';
  if (!isSandbox && !safaricomIPs.includes(clientIp)) {
    console.warn('⛔ Unauthorized IP:', clientIp);
    return NextResponse.json({ error: 'IP not allowed' }, { status: 403 });
  }

  const url = new URL(req.url);
  const securityKey = url.searchParams.get('securityKey');
  if (
    process.env.MPESA_CALLBACK_SECRET_KEY &&
    securityKey !== process.env.MPESA_CALLBACK_SECRET_KEY
  ) {
    console.warn('🔒 Invalid security key:', securityKey);
    return NextResponse.json({ error: 'Invalid security key' }, { status: 401 });
  }

  const data = await req.json();
  console.log('📨 Raw callback body:', JSON.stringify(data, null, 2));

  const callback = data?.Body?.stkCallback;

  if (!callback) {
    console.warn('❌ Missing stkCallback');
    return NextResponse.json({ error: 'Invalid callback format' }, { status: 400 });
  }

  if (!callback.CallbackMetadata) {
    console.log('❌ STK Push failed:', callback?.ResultDesc);
    return NextResponse.json({
      message: 'STK push failed',
      details: callback.ResultDesc,
    });
  }

  const metadata = callback.CallbackMetadata.Item;

  const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
  const mpesaCode = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
  const phone = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value?.toString();

  try {
    console.log('✅ Payment received:', {
      amount,
      mpesaCode,
      phone,
      raw: metadata
    });

    // Save to DB or process payment here

    return NextResponse.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('❌ Error handling callback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
