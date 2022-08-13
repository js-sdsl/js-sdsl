import { NullValueError, RunTimeError } from './error';

export function checkUndefinedParams(value: unknown) {
  if (value === undefined || value === null) {
    throw new NullValueError();
  }
}

export function checkWithinAccessParams(pos: number, lower: number, upper: number) {
  if (pos < lower || pos > upper) {
    throw new RunTimeError();
  }
}
