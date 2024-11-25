![turbo-version-logo](./logo.jpeg)
# Turbo Version

> Automatically versioning for monorepos or common repos.

Turbo Version is a universal solution for managing package versions (MONOREPO or NOT) and releasing packages. It provides a set of tools and utilities that simplify versioning and releasing packages for monorepo projects.

## Packages

Turbo Version includes the following packages:

- `@turbo-version/version`: A package version management tool for repositories. It allows you to manage versions of packages across multiple projects and release new versions of packages.[Docs](packages/turbo-version/README.md)

- `@turbo-version/release`: A command-line interface-tool for publishing packages inside Turbo repos to the npm registry with version validation. This tool validates whether a package version has already been published on the registry before attempting to publish it.[Docs](packages/turbo-release/README.MD)

## Installation

You can install each package individually by running the following command:

```bash
npm install @turbo-version/version && npm install @turbo-version/release

```

## Usage

### `@turbo-version/version`

`@turbo-version/version` provides a set of CLI commands to manage package versions.

Here's an example of how to use the `turbo-version -bump` command:

```bash
turbo-version -bump major
```

This command will bump the major version of all packages in the monorepo or a common repo.

For more information on how to use `@turbo-version/release`, please refer to the [documentation](https://github.com/jucian0/turbo-version/tree/main/packages/turbo-version).

### `@turbo-version/release`

`@turbo-version/release` is a command-line interface tool for publishing packages inside Turbo repos to the npm registry with version validation.

Here's an example of how to use the `turbo-release` command:

```bash
turbo-release
```

This command will attempt to publish all packages inside, but before publish, it's validate if the package version is already published.

For more information on how to use `@turbo-version/release`, please refer to the [documentation](https://github.com/jucian0/turbo-version/tree/main/packages/turbo-release).

## Contributing

We welcome contributions to Turbo Version! To contribute, please read our [contribution guidelines](./CONTRIBUTING.md) and [code of conduct](./CODE_OF_CONDUCT.md).

## Support Us

Thank you for your interest in supporting our project! We are a community-driven open-source project, and we welcome contributions from everyone.

### Ways to Contribute

- **Code Contributions:** If you are a developer, you can help us improve the project by contributing code. You can find our project on GitHub [here](https://github.com/jucian0/turbo-version), where you can create issues, fork the project, make changes, and submit pull requests.

- **Documentation:** We are always looking for help with documentation. If you have expertise in the project or have experience writing technical documentation, we would appreciate your contributions.

- **Bug Reports:** If you find a bug, please report it! You can create a new issue on GitHub and provide as much information as possible. This will help us reproduce the issue and fix it quickly.

- **Feature Requests:** If you have a feature request, please let us know by creating a new issue on GitHub. We welcome feedback and ideas for how to improve the project.

- **Spread the Word:** If you like our project, you can help us by sharing it with others. Tell your friends, colleagues, or anyone who might be interested. You can also follow us on social media and share our posts.

## License

Turbo Version is released under the [MIT License](LICENCE.MD).
