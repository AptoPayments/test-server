const server = require("./lib/index.js").default;

console.warn({ server: server });



require("@apto-payments/test-server-matchers");
/**
 * Start the test-server at the beginning
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

/**
 * Reset every test-server handler after each test
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Close the server once tests are finished
 */
afterAll(() => server.close());
