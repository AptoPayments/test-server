# @apto-payments/test-server

Testing utility to be used together with [jest](https://jestjs.io/), [testing library](https://testing-library.com/) and [msw](https://mswjs.io/).

## Getting started

### Installation

Install @apto-payments/test-server as a dev dependency.

```
npm i -D @apto-payments/test-server
```

You might need to install the peer-dependencies yourself.

```
npm i -D jest msw
```

### Configuration

Edit your [jest setup files](https://jestjs.io/es-ES/docs/configuration#setupfiles-array) to configure the test server.

Usually this file is named `setupTests.ts`, you just need to add 3 steps:

- Start the server when testing starts.
- Close the server when testing ends.
- Reset the server after each test to ensure a clean status.

```ts
// setupTests.ts
import server from "@apto-payments/test-server";

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
```

## Usage

Use this library to stub responses from the server while keeping your tests as deep as possible

```ts
import mockServer from "@apto-payments/test-server";
import { render, screen, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";

it("should stub the given server requests", async () => {
  const spy1 = mockServer.stubJSONResponse({ data: "hello" }, 200, {
    method: "get",
    path: "*/foo/bar",
  });
  const spy2 = mockServer.stubJSONResponse({ data: "world" }, 200, {
    method: "get",
    path: "*/foo/baz",
  });

  const res1 = await fetch("/foo/bar").then((res) => res.json());
  const res2 = await fetch("/foo/baz").then((res) => res.json());

  // We can assert on the returned spies
  expect(spy1).toHaveBeenCalledWith(
    expect.objectContaining({ method: "GET" }),
    expect.anything(),
    expect.anything()
  );
  expect(spy2).toHaveBeenCalledWith(
    expect.objectContaining({ method: "GET" }),
    expect.anything(),
    expect.anything()
  );

  // The responses are the ones given by the test server
  expect(res1.data).toBe("hello");
  expect(res2.data).toBe("world");
});
```

```ts
it("should work fine with a react Element", () => {
  function DummyComponent() {
    const [serverResponse, setServerResponse] = useState();

    useEffect(() => {
      fetch("/some/url")
        .then((res) => res.json())
        .then(setServerResponse);
    }, []);

    if (!setServerResponse) {
      return <div>Loading</div>;
    }

    return <div>{serverResponse}</div>;
  }

  mockServer.stubJSONResponse("This is the response from the server", 200, {
    method: "get",
    path: "*/some/url",
  });

  render(<DummyComponent />);

  return waitFor(() => {
    expect(
      screen.getByText("This is the response from the server")
    ).toBeVisible();
  });
});
```
