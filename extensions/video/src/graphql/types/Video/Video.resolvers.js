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

      const expires = new Date(customer.subscription_expires_at);
      const now = new Date();
      const isValid = expires > now;

      const row = result.rows[0];
      return row
        ? {
            ...row,
            url: isValid ? `/api/stream/video/${row.filename}` : null,
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
      console.log("row", row);
      return row || null;
    },
  },
};
