export default {
  Query: {
    customerSubscriptions: async (_, { filters = {} }, context) => {
      const isAdmin = !!context.user;
      if (!isAdmin) {
        return [];
      }

      const values = [];
      let whereClause = "";

      if (filters.status) {
        values.push(filters.status);
        whereClause = `WHERE cs.status = $${values.length}`;
      }

      const { rows } = await context.pool.query(
        `
          SELECT
            cs.customer_subscription_id,
            cs.subscription_id,
            cs.stripe_subscription_id,
            cs.status,
            cs.current_period_start,
            cs.current_period_end,
            cs.created_at,
            cs.updated_at,

            c.uuid,
            c.email,
            c.full_name,

            s.name                AS subscription_name,
            s.price_cents,
            s.currency,
            s.interval,
            s.interval_count
          FROM customer_subscriptions cs
                 INNER JOIN customer c
                            ON c.uuid = cs.customer_id
                 INNER JOIN subscriptions s
                            ON s.subscription_id = cs.subscription_id
                              ${whereClause}
          ORDER BY cs.created_at DESC
        `,
        values,
      );
      return rows;
    },
  },
};
