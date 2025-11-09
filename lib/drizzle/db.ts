import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as relations from './relations';

const connectionString = process.env.DATABASE_URL as string;
const connectionTimeout = process.env.CONNECT_TIMEOUT as string;
const idleTimeout = process.env.IDLE_TIMEOUT as string;

const client = postgres(connectionString, {
	prepare: false,
	idle_timeout: Number.parseInt(idleTimeout),
	connect_timeout: Number.parseInt(connectionTimeout),
});

export const db = drizzle(client, { schema: { ...schema, ...relations } });
