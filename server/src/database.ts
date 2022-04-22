import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug } from "umzug";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  database: "drift",
  storage: __dirname + "/drift.sqlite",
  models: [__dirname + "/lib/models"],
  logging: console.log,
});

export const umzug = new Umzug({
  migrations: {
    glob: __dirname + "/migrations/*.ts",
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof umzug._types.migration;
