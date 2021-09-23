declare namespace jest {
  interface Matchers {
    toHaveBeenCalledWithBody(): CustomMatcherResult;
    toHaveBeenCalledWithUrl(): CustomMatcherResult;
  }
}
