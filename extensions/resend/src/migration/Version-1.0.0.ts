import type { PoolClient } from "pg";
import { execute } from "@evershop/postgres-query-builder";

export default async function (client: PoolClient) {
  await execute(
    client,
    `
      CREATE TABLE IF NOT EXISTS contact_form_rate_limits (
        id SERIAL PRIMARY KEY,
        fingerprint VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_fingerprint
        ON contact_form_rate_limits (fingerprint);

      CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_created_at
        ON contact_form_rate_limits (created_at);
    `,
  );
}
