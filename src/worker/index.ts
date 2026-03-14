import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "LeafLab asd" }));

app.get("test/", (c) => {
    return c.json({"test":"test"});
});

export default app;
