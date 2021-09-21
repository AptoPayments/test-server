import jestMock from "jest-mock";
import { MockedResponse, rest } from "msw";
export declare type stubbedMethodOptions = "get" | "post" | "put" | "delete";
export interface stubJsonResponseOptions {
    path?: string;
    method?: stubbedMethodOptions;
}
/**
 * Since we can only have a variable it's created here
 */
declare const server: import("msw/node").SetupServerApi;
/**
 * Helper function to stub a server json response using https://mswjs.io/.
 *
 * @param response - The object you want the server to reply
 * @param status? - Http status of the response
 * @param options? - An object with extra options, currently only a path is supported.
 */
export declare function stubJSONResponse<TBodyResponse>(response: TBodyResponse, status?: number, options?: stubJsonResponseOptions): jestMock.Mock<MockedResponse<any> | Promise<MockedResponse<any>>, any>;
/**
 * We need to annotate the type of the default export [TS2742]
 */
declare type ITestServer = typeof server & {
    rest: typeof rest;
    stubJSONResponse: typeof stubJSONResponse;
};
declare const _default: ITestServer;
/**
 *
 */
export default _default;
//# sourceMappingURL=index.d.ts.map