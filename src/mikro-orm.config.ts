import { __prod__ } from "./contants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import entities from "./entities";

export default {
    migrations: {
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
  entities: entities,
  dbName: "lireddit",
  type: "postgresql",
  debug: !__prod__,
  user: "postgres",
  password: "password"

} as Parameters<typeof MikroORM.init>[0];
