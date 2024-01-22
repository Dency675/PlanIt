import sequelize from "../config/sequelize";

export const sequelizeSync = async (): Promise<void> => {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("connection has been established successfully");
    })
    .catch((err: Error) => {
      console.error("unable to connect the database");
    });

  await sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Database synced");
    })
    .catch((error) => {
      console.error("Error syncing database:", error);
    });
};
