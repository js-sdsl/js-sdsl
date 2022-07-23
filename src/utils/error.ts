function createErrorClass(errorName: string, errorMessage: string) {
  return class newError extends Error {
    constructor(message: string = errorMessage) {
      super(message);
      this.name = errorName;
    }
  };
}

export const TestError = createErrorClass('TestError', 'test error');
export const TypeError = createErrorClass('TypeError', 'type error');
export const RunTimeError = createErrorClass('RunTimeError', 'access out of bounds');
export const InternalError = createErrorClass('InternalError', 'internal error');
export const NullValueError = createErrorClass('NullValueError', 'you can not set null value here');
export const ContainerInitError = createErrorClass('ContainerInitError', 'container init failed');
