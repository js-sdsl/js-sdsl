import { NullValueError, RunTimeError } from './error';

export function checkUndefinedParams(...args: unknown[]) {
  if (args.includes(undefined) || args.includes(null)) {
    throw new NullValueError();
  }
}

export function checkWithinAccessParams(pos: number, lower: number, upper: number) {
  if (pos < lower || pos > upper) {
    throw new RunTimeError();
  }
}
