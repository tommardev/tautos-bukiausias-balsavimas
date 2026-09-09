# Conventions

How new code should look and where it goes. Load this before adding a module, route, error path, or public API.

## Precedence

`repo:` paths below are this project's standard. `golden:` items apply only where the project is silent and do not fight the formatter, compiler, or existing files.

## Naming and layout

- `repo:` <!-- pattern + proving path -->

## Imports

- `repo:` <!-- order, aliases, barrel files or not -->
- `golden:` Imports at module top; no inline imports unless a documented circular-dependency exception.

## Errors and logging

- `repo:` <!-- the one error shape; logger -->
- `golden:` Do not swallow errors. Do not log secrets or raw PII.

## Where new code goes

- Features →
- Routes / handlers →
- UI kit →
- Tests →

## Public surfaces

- `repo:` <!-- API / package exports -->
- `golden:` Keep the public surface small; do not leak internals for convenience (Hyrum's Law).
