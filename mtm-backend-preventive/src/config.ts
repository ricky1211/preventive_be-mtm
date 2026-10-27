import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || "4002", 10),
  },
  database: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mtm_preventive_db?schema=public",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "mtm_super_secret_jwt_key_2026",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};
