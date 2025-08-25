import { NextResponse } from "next/server";

export async function GET(req) {
  const result = await database.query("SELECT 1 + 1 as sum");
  console.log(result.rows);
  return NextResponse.json({ chave: "são acima da média" });
}
