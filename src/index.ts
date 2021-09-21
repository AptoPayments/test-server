import jestMock from "jest-mock";
import {
  DefaultRequestBody,
  MockedResponse,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from "msw";
import { setupServer } from "msw/node";

const DEFAULT_OPTIONS: stubJsonResponseOptions = { path: "*", method: "get" };

export type stubbedMethodOptions = "get" | "post" | "put" | "delete";

export interface stubJsonResponseOptions {
  path?: string;
  method?: stubbedMethodOptions;
}

/**
 * Since we can only have a variable it's created here
 */
const server = setupServer();

/**
 * Helper function to stub a server json response using https://mswjs.io/.
 *
 * @param response - The object you want the server to reply
 * @param status? - Http status of the response
 * @param options? - An object with extra options, currently only a path is supported.
 */
export function stubJSONResponse<TBodyResponse>(
  response: TBodyResponse,
  status = 200,
  options: stubJsonResponseOptions = DEFAULT_OPTIONS
) {
  const path = options.path || "*";
  const method = options.method || "get";

  const handler = jestMock
    .fn<MockedResponse | Promise<MockedResponse>, any>()
    .mockImplementation(
      (
        req: RestRequest<DefaultRequestBody, RequestParams>,
        res: ResponseComposition<TBodyResponse>,
        ctx: RestContext
      ) => {
        return res(ctx.json(response), ctx.status(status));
      }
    );

  server.use(rest[method](path, handler));

  return handler;
}

/**
 * We need to annotate the type of the default export [TS2742]
 */
type ITestServer = typeof server & {
  rest: typeof rest;
  stubJSONResponse: typeof stubJSONResponse;
};

/**
 *
 */
export default { ...server, rest, stubJSONResponse } as ITestServer;
