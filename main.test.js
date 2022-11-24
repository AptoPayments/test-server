const testServer = require("./lib/index.js").default;


require("whatwg-fetch");

describe("testServer", () => {
  it("should have defined a toHaveBeenCalledWithBody matcher", () => {
    expect(expect.toHaveBeenCalledWithBody).toBeDefined();
  });

  it("should have defined a toHaveBeenCalledWithBody matcher", () => {
    expect(expect.toHaveBeenCalledWithUrl).toBeDefined();
  });

  it("should stub simple get requests when no parameters are given", async () => {
    const spy = testServer.stubJSONResponse();

    const res = await fetch("/foo/bar").then((res) => res.json());

    expect(res).toEqual({});
    expect(spy).toHaveBeenCalledWithUrl("/foo/bar", { exact: false });
  });

  it("should stub the body parameter", async () => {
    const spy = testServer.stubJSONResponse({
      response: { data: "hello world" },
    });

    const res = await fetch("/foo/bar").then((res) => res.json());

    expect(res.data).toEqual("hello world");

    expect(spy).toHaveBeenCalledWithUrl("/foo/bar", { exact: false });
  });

  it("should use the path parameter", async () => {
    testServer.stubJSONResponse({
      response: { data: "response to path1" },
      path: "/path1",
    });

    testServer.stubJSONResponse({
      response: { data: "response to path2" },
      path: "/path2",
    });

    const res1 = await fetch("/path1").then((res) => res.json());
    const res2 = await fetch("/path2").then((res) => res.json());

    expect(res1.data).toEqual("response to path1");
    expect(res2.data).toEqual("response to path2");
  });

  it("should reply with the given HTTP method ", async () => {
    testServer.stubJSONResponse({
      status: 500,
    });

    const res = await fetch("/path1");

    expect(res.status).toEqual(500);
  });

  it("should reply with the given HTTP method ", async () => {
    testServer.stubJSONResponse({
      status: 500,
    });

    const res = await fetch("/path1");

    expect(res.status).toEqual(500);
  });

  it("should return an spy called with the request", async () => {
    const spy = testServer.stubJSONResponse({ method: "post" });

    const res = await fetch("/foo/baz", {
      method: "POST",
      body: JSON.stringify({ foo: "bar" }),
    }).then((res) => res.json());

    // Spy on the HTTP body received by the server
    expect(spy).toHaveBeenCalledWithBody({ foo: "bar" });

    // Spy on the called URL
    expect(spy).toHaveBeenCalledWithUrl("/foo/baz", { exact: false });
  });

  it("should cleanup the spies after every test", () => {
    const spy1 = testServer.stubJSONResponse();
    expect(spy1).not.toHaveBeenCalled();
  });
});
