import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";

import { errorHandle } from "./errors/errHandle.js";
import { logger } from "./utils/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./config/swagger.config.js";

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(`mongodb+srv://santiago:37x3byifjUG2dFeF@backend.f6prvy6.mongodb.net/proyectofinal`);

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use("/api", router);

app.use(errorHandle);

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));