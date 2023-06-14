import { Hono } from "hono";
import { cors } from 'hono/cors'
import JSZip = require("jszip")

const app = new Hono();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

async function handleOptions(request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS preflight requests.
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Headers": request.headers.get(
          "Access-Control-Request-Headers"
        ),
      },
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response("{}", {
      headers: {
        Allow: "GET, PUT, HEAD, POST, OPTIONS",
      },
    });
  }
}

app.options('*', async (c, next) => {
  if (c.req.method === "OPTIONS") {
    // Handle CORS preflight requests
    return handleOptions(c.req);
  }
  await next()
})

// serve all assets at root
app.get("/*", async (c) => {
  return await c.env.ASSETS.fetch(c.req);
});

app.onError((err, c) => {
  console.error(err.message)
  return c.text(err.message, 500)
});

export default app;