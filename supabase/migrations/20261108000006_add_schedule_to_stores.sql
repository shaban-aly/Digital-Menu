-- Migration: 20261108000006_add_schedule_to_stores.sql
-- Description: Add schedule JSONB column to stores table

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT NULL;
