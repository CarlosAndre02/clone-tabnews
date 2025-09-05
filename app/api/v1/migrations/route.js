import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { NextResponse } from "next/server";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve(process.cwd(), "infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function GET() {
  const dbClient = await database.getNewClient();

  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });
    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await dbClient.end();
  }
}

export async function POST() {
  const dbClient = await database.getNewClient();

  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return NextResponse.json(migratedMigrations, { status: 201 });
    }

    return NextResponse.json(migratedMigrations, { status: 200 });
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await dbClient.end();
  }
}
