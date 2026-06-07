import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

let prisma;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prismaClientGlobal) {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    global.prismaClientGlobal = new PrismaClient({ adapter });
  }
  prisma = global.prismaClientGlobal;
}

export default prisma;
