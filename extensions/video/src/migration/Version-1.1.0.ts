import type { PoolClient } from "pg";
import { execute } from "@evershop/postgres-query-builder";

export default async function (client: PoolClient) {
  await execute(
    client,
    `
      ALTER TABLE product
        ADD COLUMN IF NOT EXISTS is_subscription BOOLEAN DEFAULT FALSE;
      ALTER TABLE product
        ADD COLUMN IF NOT EXISTS subscription_duration_days INT DEFAULT 30;
    `,
  );
}
