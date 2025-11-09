import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

export const getDbUrl = () => {
	const projectDir = process.cwd();
	loadEnvConfig(projectDir);
	return process.env.DATABASE_URL as string;
};

export default defineConfig({
	schema: './lib/drizzle/schema.ts',
	out: './lib/drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: getDbUrl(),
	},
	verbose: true,
	strict: true,
	migrations: { table: 'migrations', schema: 'public' },
});
