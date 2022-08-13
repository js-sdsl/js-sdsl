# Change Log

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [UnReleased] - 2022-08-13

## Changed

- Change class type and optimized type design

## [4.0.0] - 2022-07-30

### Changed

- Remove InternalError error as much as possible (don't effect using).
- Change `HashSet` api `eraseElementByValue`'s name to `eraseElementByKey`.
- Change some unit tests to improve coverage (don't effect using).

## [4.0.0-beta.0] - 2022-07-24

### Added

- Complete test examples (don't effect using).
- The error thrown is standardized, you can catch it according to the error type.

### Changed

- Refactor all container from function to class (don't effect using).
- Abstracting tree containers and hash containers, change `Set`'s and `Map`'s name to `OrderedSet` and `OrderedMap` to distinguish it from the official container.
- Change `OrderedSet` api `eraseElementByValue`'s name to `eraseElementByKey`.

### Fixed

- Fixed so many bugs.

## [3.0.0-beta.0] - 2022-04-29

### Added

- Bidirectional iterator is provided for all containers except Stack, Queue, HashSet and HashMap.
- Added begin, end, rBegin and rEnd functions to some containers for using iterator.
- Added `eraseElementByIterator` function.

### Changed

- Changed Pair type `T, K` to `K, V` (don't effect using).
- Changed `find`, `lowerBound`, `upperBound`, `reverseLowerBound` and `reverseUpperBound` function's returned value to `Iterator`.

### Fixed

- Fixed an error when the insert value was 0.
- Fixed the problem that the lower version browser does not recognize symbol Compilation error caused by iterator.
