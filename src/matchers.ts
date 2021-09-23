import { ISpy } from ".";

declare namespace jest {
  interface Matchers {
    toHaveBeenCalledWithBody(): any; // TODO: This should be of type "CustomMatcherResult"
    toHaveBeenCalledWithUrl(): any; // TODO: This should be of type "CustomMatcherResult"
  }
}

export function extendMatchers() {
  expect.extend({
    toHaveBeenCalledWithBody(actual: ISpy, expectedBody: any) {
      expect(actual).toHaveBeenCalledWith(
        expect.objectContaining({ body: JSON.stringify(expectedBody) })
      );
      return { pass: true, message: () => "" };
    },
  });

  expect.extend({
    toHaveBeenCalledWithUrl(
      actual: ISpy,
      expectedUrl: string,
      { exact = true } = { exact: true }
    ) {
      const actualURLs: string[] = [];
      const pass = actual.mock.calls.some((call) => {
        const actualUrl = call[0].url.toString();
        actualURLs.push(actualUrl);
        return exact
          ? actualUrl === expectedUrl
          : actualUrl.includes(expectedUrl);
      });

      return {
        pass,
        message: () =>
          pass
            ? ""
            : `Expecting: \n\n${this.utils.printExpected(
                expectedUrl
              )}\n\nReceived: \n\n${this.utils.printReceived(actualURLs)}`,
      };
    },
  });
}

export default extendMatchers;
