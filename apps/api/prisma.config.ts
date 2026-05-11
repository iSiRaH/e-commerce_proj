const dotenv = require('dotenv');
const path = require('path');
import { defineConfig } from 'prisma/config';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ENCODED_DATABASE_URL =
  process.env['DATABASE_URL']?.replace(
    '[YOUR-PASSWORD]',
    process.env['DATABASE_PASSWORD'] || ''
  ) || '';

if (!ENCODED_DATABASE_URL) {
  throw new Error('DATABASE_URL is required for prisma migrate dev');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: ENCODED_DATABASE_URL,
  },
});
