# Change Log

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

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
