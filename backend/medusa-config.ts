import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV!, process.cwd());

module.exports = defineConfig({
  admin: {
    disable: true, // Force disable admin on Railway
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: {
    [COMPANY_MODULE]: {
      resolve: "./modules/company",
    },
    [QUOTE_MODULE]: {
      resolve: "./modules/quote",
    },
    [APPROVAL_MODULE]: {
      resolve: "./modules/approval",
    },
    [Modules.CACHE]: process.env.REDIS_URL || process.env.CACHE_REDIS_URL
      ? {
          resolve: "@medusajs/medusa/cache-redis",
          options: {
            redisUrl: process.env.REDIS_URL || process.env.CACHE_REDIS_URL,
          },
        }
      : {
          resolve: "@medusajs/medusa/cache-inmemory",
        },
    [Modules.EVENT_BUS]: process.env.REDIS_URL || process.env.EVENT_BUS_REDIS_URL
      ? {
          resolve: "@medusajs/medusa/event-bus-redis",
          options: {
            redisUrl: process.env.REDIS_URL || process.env.EVENT_BUS_REDIS_URL,
          },
        }
      : {
          resolve: "@medusajs/medusa/event-bus-local",
        },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/medusa/workflow-engine-inmemory",
    },
  },
});
