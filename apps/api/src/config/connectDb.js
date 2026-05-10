const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const ENCODED_DATABASE_URL =
  process.env['DATABASE_URL']?.replace(
    '[YOUR-PASSWORD]',
    process.env['DATABASE_PASSWORD'] || ''
  ) || '';

// console.log('Encoded Database URL:', ENCODED_DATABASE_URL); //REMOVE: for debugging purposes only

const pool = new Pool({
  connectionString: ENCODED_DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
