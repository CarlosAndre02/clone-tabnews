import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import { NextResponse } from "next/server";

const defaultMigrationOptions = {
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function GET(request, response) {
  const dbClient = await database.getNewClient();
  const pendingMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient: dbClient,
  });
  await dbClient.end();
  return NextResponse.json(pendingMigrations, { status: 200 });
}

export async function POST(request, response) {
  const dbClient = await database.getNewClient();
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient: dbClient,
    dryRun: false,
  });

  await dbClient.end();

  if (migratedMigrations.length > 0) {
    return NextResponse.json(migratedMigrations, { status: 201 });
  }

  return NextResponse.json(migratedMigrations, { status: 200 });
}
