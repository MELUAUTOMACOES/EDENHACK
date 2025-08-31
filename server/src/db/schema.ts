import { pgTable, uuid, text, timestamp, date, integer, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enum for harvest status
export const harvestStatusEnum = ['seeded', 'growing', 'ready', 'harvested', 'paused'] as const;
export type HarvestStatus = typeof harvestStatusEnum[number];

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

// Scaffold for future irrigation features
export const farms = pgTable('farms', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  ownerId: uuid('owner_id').references(() => profiles.id),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const sectors = pgTable('sectors', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  farmId: uuid('farm_id').references(() => farms.id).notNull(),
  moistureLevel: text('moisture_level'),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
  // New detailed columns
  plantingDate: date('planting_date'),
  harvestEta: date('harvest_eta'),
  sensors: text('sensors').array(),
  quantityMl: integer('quantity_ml'),
  repeatEveryHours: integer('repeat_every_hours'),
  harvestStatus: text('harvest_status').$type<HarvestStatus>().default('seeded'),
  seedlingsPlanted: integer('seedlings_planted').default(0),
  seedlingsHarvested: integer('seedlings_harvested').default(0),
  lastIrrigations: jsonb('last_irrigations').default([]),
});
