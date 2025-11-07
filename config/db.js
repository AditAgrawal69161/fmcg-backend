// config/db.js
import { Sequelize } from "sequelize";

// Render's ephemeral FS is writable under the project path.
// Use absolute path there; use local file at dev.
const isRender = !!process.env.RENDER_SERVICE_ID;
const storage = isRender
  ? "/opt/render/project/src/database.sqlite"
  : "./database.sqlite";

const db = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false, // flip to true if you want verbose logs
});

export default db;
