import { NextRequest, NextResponse } from 'next/server';
import { sendStkPush } from '../../../../actions/stkPush';
// Adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await sendStkPush(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('STK Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate STK push' },
      { status: 500 }
    );
  }
}
