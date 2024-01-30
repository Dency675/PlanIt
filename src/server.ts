import express from "express";
import { sequelizeSync } from "./services/sequelize";
import sequelize from "./config/sequelize";
import router from "./router";
import chooseRoutes from "./router";

const app = express();
const port = 3000 || process.env.port;

sequelizeSync();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

chooseRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
