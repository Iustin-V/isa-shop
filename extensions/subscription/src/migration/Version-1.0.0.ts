import type { PoolClient } from "pg";
import { execute } from "@evershop/postgres-query-builder";

export default async function (client: PoolClient) {
  await execute(
    client,
    `
      CREATE TABLE IF NOT EXISTS subscriptions (
      subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR NOT NULL,
      description TEXT,
      interval VARCHAR NOT NULL,
      interval_count INT NOT NULL DEFAULT 1,
      price_cents INT NOT NULL,
      currency VARCHAR NOT NULL DEFAULT 'usd',
    
      stripe_product_id VARCHAR NOT NULL,
      stripe_price_id VARCHAR NOT NULL,
    
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_active
        ON subscriptions(is_active);

      CREATE TABLE IF NOT EXISTS customer_subscriptions (
      customer_subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID NOT NULL,

      subscription_id UUID NOT NULL,
      stripe_subscription_id VARCHAR,

      status VARCHAR NOT NULL,
      current_period_start TIMESTAMP,
      current_period_end TIMESTAMP,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_customer
        ON customer_subscriptions(customer_id);

      CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_status
        ON customer_subscriptions(status);
      ALTER TABLE customer
        ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_stripe_customer_id
        ON customer (stripe_customer_id)
        WHERE stripe_customer_id IS NOT NULL;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_subscriptions_stripe_subscription_id
        ON customer_subscriptions (stripe_subscription_id)
        WHERE stripe_subscription_id IS NOT NULL;
    `,
  );
}
