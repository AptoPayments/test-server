import testServer from "./lib";

test("should have stubJSONResponse defined", () => {
  expect(testServer.stubJSONResponse).toBeDefined();
});
