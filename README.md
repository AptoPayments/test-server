# @apto-payments/test-server

Testing utility to be used together with [jest](https://jestjs.io/) and [msw](https://mswjs.io/).

## Getting started

### Installation

Install @apto-payments/test-server as a dev dependency.

```
npm i -D @apto-payments/test-server @apto-payments/test-server-matchers
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
// (Recommended but optional) include the extended matchers
import '@apto-payments/test-server-matchers';

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
  const spy1 = mockServer.stubJSONResponse(
    method: "get",
    path: "*/foo/bar",
    response: { data: "hello" },
    status: 200,
  });
  const spy2 = mockServer.stubJSONResponse(
    method: "get",
    path: "*/foo/baz",
    response: { data: "world" },
    status: 200,
  });

  const res1 = await fetch("/foo/bar").then((res) => res.json());
  const res2 = await fetch("/foo/baz").then((res) => res.json());

  // We can assert on the returned spies
  expect(spy1).toHaveBeenCalledWith(
    expect.objectContaining({ method: "GET" }),
  );
  expect(spy2).toHaveBeenCalledWith(
    expect.objectContaining({ method: "GET" }),
  );

  // Optionally we can use the custom matchers 
  expect(spy1).toHaveBeenCalledWithUrl("/foo/bar", { exact: false });

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

  mockServer.stubJSONResponse({
    method: "get",
    path: "*/some/url",
    response: "This is the response from the server",
    status: 200,
  });

  render(<DummyComponent />);

  return waitFor(() => {
    expect(
      screen.getByText("This is the response from the server")
    ).toBeVisible();
  });
});
```