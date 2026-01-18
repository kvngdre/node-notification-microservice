import { defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const connectionURI = process.env.DB_URI;
if (!connectionURI) {
  throw new Error("No database connection URI provided");
}

export default defineConfig({
  dbName: "notifications_db",
  clientUrl: connectionURI,
  user: "postgres",
  password: "postgres",
  host: "127.0.0.1",
  port: 5432,
  entities: ["./dist/entities"], // Where your compiled JS lives
  entitiesTs: ["./src/entities"], // Where your source TS lives
  metadataProvider: TsMorphMetadataProvider,
  // This helps MikroORM find the right loader in ESM
  dynamicImportProvider: (id) => import(id)
});
