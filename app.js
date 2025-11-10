import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import retailerRoutes from "./routes/retailerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // create this file if not exists
import { scheduleTallySync } from "./services/tallyService.js";
import { SKU } from "./models/index.js"; // assuming your SKU model is exported here

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", retailerRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  res.send("✅ FMCG Backend is running fine!");
});

// Sync SKU data every 5 minutes
setInterval(() => scheduleTallySync(SKU), 5 * 60 * 1000);

export default app;
