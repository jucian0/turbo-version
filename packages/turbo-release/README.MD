# Turbo Version Release

Turbo Version Release is a command-line interface tool for publishing packages inside turbo repos to the npm registry with version validation. This tool validates whether a package version has already been published on the registry before attempting to publish it. If the version has not been published, it will be published to the registry, otherwise, a message will be displayed indicating that the package version has already been published.

## Installation

You can install Turbo Version Release using npm:

```bash
npm install -g @turbo-version/release
```

## Usage

@turbo-version/release provides a simple interface for publishing packages inside turbo repos to the npm registry:

```bash
turbo-release
```

This command will publish all packages inside the turbo repo to the npm registry with version validation. The tool will validate if the package version has already been published on the registry before attempting to publish it. If the version has not been published, it will be published to the registry, otherwise, a message will be displayed indicating that the package version has already been published.

## Advanced

- `--skip` or `-s`: Use this argument to skip publishing certain packages. You can provide a comma-separated list of package names to skip. For example, `-s ui,docs` will skip publishing the ui and docs packages.

- `--target` or `-t`: Use this argument to specify the packages you want to publish. You can provide a comma-separated list of package names to publish. For example, `-t ui,docs` will only publish the ui and docs packages.

- `--client`, `-c` Specify the package manager you want to use. Valid options are 'npm', 'pnpm', or 'yarn'. For example, to use yarn as your package manager, use the flag `-c yarn`. The default package manager is 'npm'.

## Integration with turbo-version

@turbo-version/release can be used in conjunction with @turbo-version/turbo to manage monorepo versions. @turbo-version/turbo provides tools for managing monorepo versions, including bumping and releasing packages. You can use @turbo-version/release to publish the packages released by @turbo-version/turbo.

## Configuration

@turbo-version/release can be configured via environment variables or via a configuration file.

### Environment Variables

The following environment variables can be used to configure @turbo-version/release:

`NPM_TOKEN` - The npm authentication token for publishing packages.
`NPM_URL` - The URL of the npm registry to publish to (default: https://registry.npmjs.org/).

### Configuration File (.npmrc)

In order to publish a version on NPM, or a private registry, you need to configure a `.npmrc` file, providing all necessary information, like `token`, and `repository_url`.

We do that for you by using the env vars explained in the previous step.

Here is an example configuration file:

```raw
//.npmrc

registry: https://registry.npmjs.org/
```

## License

@turbo-version/release is released under the MIT License.
