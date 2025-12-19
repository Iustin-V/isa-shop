export default {
  Query: {
    subscriptions: async (_, __, context) => {
      const isAdmin = !!context.user;
      if (!isAdmin) {
        return [];
      }

      const { rows } = await context.pool.query(`
        SELECT
          subscription_id,
          name,
          description,
          price_cents,
          interval,
          interval_count,
          is_active
        FROM subscriptions
        ORDER BY created_at DESC
      `);

      return rows;
    },

    subscription: async (_, { id }, context) => {
      const isAdmin = !!context.user;
      if (!isAdmin) {
        return null;
      }

      const { rows } = await context.pool.query(
        `
        SELECT
          subscription_id,
          name,
          description,
          price_cents,
          interval,
          interval_count,
          is_active,
          stripe_product_id,
          stripe_price_id
        FROM subscriptions
        WHERE subscription_id = $1
        `,
        [id],
      );

      return rows[0] || null;
    },
  },
};
