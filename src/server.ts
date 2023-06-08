import { Hono } from "hono";

const app = new Hono();

// explicitly define this endpoint to avoid looping when fetching index.html to modify & serve
app.get("/index.html", async (c) => {
  return await c.env.ASSETS.fetch(c.req);
});

// serve appclip record json
app.get("/", async (c) => {
  return c.text("Hello World!");
});

// serve all assets at root
app.get("/*", async (c) => {
  return await c.env.ASSETS.fetch(c.req);
});

export default app;