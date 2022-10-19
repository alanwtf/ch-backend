import { Router } from "../deps.ts";
import * as colorController from "../controllers/colorController.ts";

const router = new Router()
    .get("/api/colors", colorController.getColors)
    .post("/api/colors", colorController.postColor);

export default router;
