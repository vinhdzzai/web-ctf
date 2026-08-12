const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

test("/image should return an image response", async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once("listening", resolve));

    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    const response = await fetch(
      `http://127.0.0.1:${port}/image?img=da-nang.jpg`,
    );
    const contentType = response.headers.get("content-type") || "";

    assert.match(contentType, /^image\//i);
  } finally {
    server.close();
  }
});
