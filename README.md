# Turbo Version

Turbo Version is a monorepo solution for managing package versions and releasing packages. It provides a set of tools and utilities that simplify versioning and releasing packages for monorepo projects.

## Packages

Turbo Version includes the following packages:

- `@turbo-version/version`: A package version management tool for monorepos. It allows you to manage versions of packages across multiple projects and release new versions of packages.

- `@turbo-version/release`: A command-line interface tool for publishing packages inside Turbo repos to the npm registry with version validation. This tool validates whether a package version has already been published on the registry before attempting to publish it.

## Installation

You can install each package individually by running the following command:

```bash
npm install @turbo-version/version && npm install @turbo-version/release

```

## Usage

### `@turbo-version/version`

`@turbo-version/turbo` provides a set of CLI commands to manage package versions in monorepos.

Here's an example of how to use the `turbo-version -bump` command:

```bash
turbo-version -bump major
```

This command will bump the major version of all packages in the monorepo.

For more information on how to use `@turbo-version/release`, please refer to the [documentation](https://github.com/jucian0/turbo-version/tree/main/packages/turbo-version).

### `@turbo-version/release`

`@turbo-version/release` is a command-line interface tool for publishing packages inside Turbo repos to the npm registry with version validation.

Here's an example of how to use the `turbo-release` command:

```bash
turbo-release
```

This command will attempt to publish all packages inside the monorepo, but before publish, it's validate if the package version is already published.

For more information on how to use `@turbo-version/release`, please refer to the [documentation](https://github.com/jucian0/turbo-version/tree/main/packages/turbo-release).

## Contributing

We welcome contributions to Turbo Version! To contribute, please read our [contribution guidelines](./CONTRIBUTING.md) and [code of conduct](./CODE_OF_CONDUCT.md).

## License

Turbo Version is released under the [MIT License](LICENCE.MD).
