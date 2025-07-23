// /app/api/query-stk/route.ts
import { NextResponse } from "next/server";
import { stkPushQuery } from "../../../../actions/stkPushQuery";


export async function POST(req: Request) {
  try {
    const { CheckoutRequestID } = await req.json();

    if (!CheckoutRequestID) {
      return NextResponse.json({ error: "Missing CheckoutRequestID" }, { status: 400 });
    }

    const { data, error } = await stkPushQuery(CheckoutRequestID);

    if (error) {
      return NextResponse.json({ error: error.message || "Query failed" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
