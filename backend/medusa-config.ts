import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV!, process.cwd());

module.exports = defineConfig({
  admin: {
    disable: false,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "./modules/company",
      key: COMPANY_MODULE,
    },
    {
      resolve: "./modules/quote",
      key: QUOTE_MODULE,
    },
    {
      resolve: "./modules/approval",
      key: APPROVAL_MODULE,
    },
    // Meilisearch custom module pour la recherche
    ...(process.env.MEILISEARCH_HOST && process.env.MEILISEARCH_API_KEY ? [{
      resolve: "./src/modules/meilisearch",
      options: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
        productIndexName: process.env.MEILISEARCH_PRODUCT_INDEX_NAME || "products",
      },
    }] : []),
    {
      resolve: "@medusajs/medusa/file",
      key: Modules.FILE,
      options: {
        providers: [
          ...(process.env.MINIO_ENDPOINT && process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY ? [{
            resolve: './src/modules/minio-file',
            id: 'minio',
            options: {
              endPoint: process.env.MINIO_ENDPOINT,
              accessKey: process.env.MINIO_ACCESS_KEY,
              secretKey: process.env.MINIO_SECRET_KEY,
              bucket: process.env.MINIO_BUCKET // Optional, default: medusa-media
            }
          }] : [{
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/static`,
            },
          }]),
        ],
      },
    },
    ...(process.env.REDIS_URL ? [
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        key: Modules.EVENT_BUS,
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      },
      {
        resolve: "@medusajs/medusa/cache-redis",
        key: Modules.CACHE,
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        key: Modules.WORKFLOW_ENGINE,
        options: {
          redis: {
            url: process.env.REDIS_URL,
          },
        },
      },
    ] : [
      {
        resolve: "@medusajs/medusa/cache-inmemory",
        key: Modules.CACHE,
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-inmemory",
        key: Modules.WORKFLOW_ENGINE,
      },
    ]),
  ],
});
