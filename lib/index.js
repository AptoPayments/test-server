var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "jest-mock", "msw", "msw/node"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stubJSONResponse = void 0;
    var jest_mock_1 = __importDefault(require("jest-mock"));
    var msw_1 = require("msw");
    var node_1 = require("msw/node");
    var DEFAULT_OPTIONS = { path: "*", method: "get" };
    /**
     * Since we can only have a variable it's created here
     */
    var server = (0, node_1.setupServer)();
    /**
     * Helper function to stub a server json response using https://mswjs.io/.
     *
     * @param response - The object you want the server to reply
     * @param status? - Http status of the response
     * @param options? - An object with extra options, currently only a path is supported.
     */
    function stubJSONResponse(response, status, options) {
        if (status === void 0) { status = 200; }
        if (options === void 0) { options = DEFAULT_OPTIONS; }
        var path = options.path || "*";
        var method = options.method || "get";
        var handler = jest_mock_1.default
            .fn()
            .mockImplementation(function (req, res, ctx) {
            return res(ctx.json(response), ctx.status(status));
        });
        server.use(msw_1.rest[method](path, handler));
        return handler;
    }
    exports.stubJSONResponse = stubJSONResponse;
    /**
     *
     */
    exports.default = __assign(__assign({}, server), { rest: msw_1.rest, stubJSONResponse: stubJSONResponse });
});
//# sourceMappingURL=index.js.map