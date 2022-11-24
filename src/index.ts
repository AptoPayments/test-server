import { DefaultBodyType, PathParams, rest, RestRequest } from "msw";
import { setupServer } from "msw/node";

/**
 * Utility types to make the spy code more readable
 */
export type ISpyReturnValue = undefined;
export type ISpyParams = [RestRequest<never,  PathParams<string>> | RestRequest<DefaultBodyType, PathParams<string>>];
export type ISpy = jest.Mock<ISpyReturnValue, ISpyParams>;

/**
 * Since we can only have a variable it's created and exported here
 */
export const server = setupServer();

interface IStubJSONResponseArgs<TBodyResponse> {
  /**
   * The object you want the server to reply
   */
  response?: TBodyResponse;
  /**
   * HTTP status of the server response
   */
  status?: number;
  /**
   * Path passed to msw to intercept (https://mswjs.io/docs/api/rest) defaults to "*"
   */
  path?: string;
  /**
   * HTTP method passed to msw to intercept (https://mswjs.io/docs/api/rest) defaults to "get"
   */
  method?: "get" | "post" | "put" | "delete" | "options";
}

/**
 * Helper function to stub a server json response using https://mswjs.io/.
 */
export function stubJSONResponse<TBodyResponse>(
  args?: IStubJSONResponseArgs<TBodyResponse>
) {
  /**
   * Setup default options
   */
  const path = args?.path || "*";
  const method = args?.method || "get";
  const status = args?.status || 200;
  const response = args?.response || {};

  /**
   * This spy is used to ensure the server was called with the right request.
   */
  const serverSpy: ISpy = jest.fn();

  /**
   * Use msw.io to handle requests
   */
  server.use(
    rest[method](path, (req, res, ctx) => {
      serverSpy(req);
      return res(ctx.json(response), ctx.status(status));
    })
  );

  /**
   * Return the spy so we can use it in our tests
   */
  return serverSpy;
}

/**
 * All the exports go at the end of the file
 */
export { rest } from "msw";
export default {
  ...server,
  rest,
  stubJSONResponse,
};
