import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize(
//   process.env.DB_NAME || "postgres",
//   process.env.DB_USER || "postgres",
//   process.env.DB_PASSWORD || "ariba",
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "postgres",
//     logging: false,
//   }
// );

export const sequelize = new Sequelize(
  "postgresql://dev_qe_db_user:t2Vrzoua5Gmjc2FHBMypKAR2yDYfnQcA@dpg-cuqv99rv2p9s73fk9ltg-a.oregon-postgres.render.com/dev_qe_db",
  {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Only for development
      },
      keepAlive: true, // Prevents idle disconnections
    },
    pool: {
      max: 10, // Max connections
      min: 0,
      acquire: 30000, // Wait 30s before throwing an error
      idle: 10000, // Close idle connections after 10s
    },
  }
);
