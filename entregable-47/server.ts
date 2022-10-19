import { getColors } from "./db/colors.ts";
import { Application } from "./deps.ts";
import colorRouter from "./routes/colorRouter.ts";
const app = new Application();

app.use(colorRouter.routes());

const PORT: number = Number(Deno.env.get("PORT")) || 8080;
console.log(`server listening on port ${PORT}`);

await app.listen({ port: PORT });
