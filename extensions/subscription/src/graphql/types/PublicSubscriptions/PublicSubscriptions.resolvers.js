export default {
  Query: {
    publicSubscriptions: async (_, __, context) => {
      const { rows } = await context.pool.query(`
        SELECT
          subscription_id,
          name,
          description,
          price_cents,
          currency,
          interval,
          interval_count
        FROM subscriptions
        WHERE is_active = true
        ORDER BY price_cents ASC
      `);
      return rows;
    },

    publicSubscription: async (_, { id }, context) => {
      const { rows } = await context.pool.query(
        `
        SELECT
          subscription_id,
          name,
          description,
          price_cents,
          currency,
          interval,
          interval_count
        FROM subscriptions
        WHERE subscription_id = $1
          AND is_active = true
        `,
        [id],
      );

      return rows[0] || null;
    },

    mySubscription: async (_, __, context) => {
      const customer = context.customer;
      if (!customer) {
        return null;
      }

      const { rows } = await context.pool.query(
        `
        SELECT
          subscription_id,
          status,
          current_period_end
        FROM customer_subscriptions
        WHERE customer_id = $1
          AND status IN ('active','trialing','past_due')
        ORDER BY current_period_end DESC
        LIMIT 1
        `,
        [customer.uuid],
      );

      const row = rows[0];
      if (!row) {
        return null;
      }

      return {
        subscription_id: row.subscription_id,
        status: row.status,
        current_period_end: row.current_period_end
          ? new Date(row.current_period_end).toISOString()
          : null,
      };
    },
  },
};
