import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as relations from './relations';

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL as string;
const connectionTimeout = process.env.NEXT_PUBLIC_CONNECT_TIMEOUT as string;
const idleTimeout = process.env.NEXT_PUBLIC_IDLE_TIMEOUT as string;

const client = postgres(connectionString, {
	prepare: false,
	idle_timeout: parseInt(idleTimeout),
	connect_timeout: parseInt(connectionTimeout),
});

export const db = drizzle(client, { schema: { ...schema, ...relations } });
