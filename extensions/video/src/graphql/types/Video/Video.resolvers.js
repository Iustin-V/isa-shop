import { hasActiveSubscription } from "../../../services/subscriptionAccess.js";

export default {
  Query: {
    videos: async (_, { showInactive }, context) => {
      const isAdmin = !!context.user;

      if (showInactive && isAdmin) {
        const result = await context.pool.query(`
          SELECT * FROM video ORDER BY created_at DESC
        `);
        return result.rows;
      }
      const result = await context.pool.query(`
        SELECT * FROM video
        WHERE is_active = TRUE
        ORDER BY created_at DESC
      `);
      return result.rows;
    },
    video: async (_, { slug }, context) => {
      const result = await context.pool.query(
        `SELECT * FROM video WHERE slug = $1`,
        [slug],
      );
      const customer = context.customer;
      let hasAccess = false;

      if (customer) {
        hasAccess = await hasActiveSubscription(customer.uuid);
      }
      const row = result.rows[0];
      return row
        ? {
            ...row,
            url: hasAccess ? `/api/stream/video/${row.filename}` : null,
          }
        : null;
    },
    videoById: async (_, { id }, context) => {
      const isAdmin = !!context.user;
      if (!isAdmin) {
        return null;
      }

      const result = await context.pool.query(
        `SELECT * FROM video WHERE id = $1`,
        [id],
      );
      const row = result.rows[0];
      return row || null;
    },
  },
};
