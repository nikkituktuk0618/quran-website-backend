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
  "postgresql://dev_qe_db_guxv_user:V1PEJzEbPTPsWmsEHO7dxXH4CfDwXsVX@dpg-d076s93uibrs73f7cl00-a.oregon-postgres.render.com/dev_qe_db_guxv",
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
