import { Container } from '@/container/ContainerBase/index';

abstract class SequentialContainer<T> extends Container<T> {
  /**
   * Push the element to the back.
   */
  abstract pushBack(element: T): void;
  /**
   * Removes the last element.
   */
  abstract popBack(): void;
  /**
   * Sets element by position.
   */
  abstract setElementByPos(pos: number, element: T): void;
  /**
   * Removes the elements of the specified value.
   */
  abstract eraseElementByValue(value: T): void;
  /**
   * @param pos The position you want to insert.
   * @param element The element you want to insert.
   * @param num The number of elements you want to insert (default 1).
   * Insert several elements after the specified position.
   */
  abstract insert(pos: number, element: T, num?: number): void;
  /**
   * Reverses the container.
   */
  abstract reverse(): void;
  /**
   * Removes the duplication of elements in the container.
   */
  abstract unique(): void;
  /**
   * @param cmp Comparison function.
   * Sort the container.
   */
  abstract sort(cmp?: (x: T, y: T) => number): void;
}

export default SequentialContainer;
