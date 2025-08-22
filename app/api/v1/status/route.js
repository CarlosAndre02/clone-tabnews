import { NextResponse } from "next/server";

export function GET(req) {
  return NextResponse.json({ chave: "são acima da média" });
}
