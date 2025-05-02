import { drizzle } from 'drizzle-orm/node-postgres';


import {
    pgTable,
    primaryKey,
    foreignKey,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
    uniqueIndex,
    index // Import index for non-unique indexes
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const db = drizzle(process.env.DATABASE_URL!, { logger: true });
