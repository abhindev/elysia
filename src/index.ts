import { Elysia } from "elysia";

import * as mongoose from "mongoose";

await mongoose.connect(
  "mongodb+srv://vihara:adam@cluster0.hwtgiry.mongodb.net/kalayaniammas_v2_2?retryWrites=true&w=majority"
);
import groupRouter from "elysia-group-router";
import cors from "@elysiajs/cors";

const app = new Elysia();
app.use(
  cors() //{ origin: 'heee.com'}
);
app.get("",()=>"Elysia")
app.use((app) => groupRouter(app, "groups"));
app.listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
