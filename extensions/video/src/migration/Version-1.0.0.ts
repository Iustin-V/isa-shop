import type { PoolClient } from "pg";
import { execute } from "@evershop/postgres-query-builder";

export default async function (client: PoolClient) {
  await execute(
    client,
    `
      CREATE TABLE IF NOT EXISTS video (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        filename TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `,
  );

  await execute(
    client,
    `
      ALTER TABLE customer
      ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP NULL;
    `,
  );
}
