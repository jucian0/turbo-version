# Turbo Version

This is a command-line tool that allows you to bump the versions of your packages in project according to Semantic Versioning. By automating the versioning process, **Turbo Version** can save developers time and reduce the risk of errors that can occur when version numbers are assigned manually. Additionally, using semantic commit messages can help improve communication and collaboration among team members by providing clear and consistent information about the changes being made to the codebase.

## Usage

You can use **Turbo Version** in two ways: **synced**, **async** mode, and **manually** or **affected** packages by commits since the last release.

```bash

yarn add -D turbo-version

```

### Synced

In `synced` mode, all packages in the monorepo or common repo will be updated with the same version and tag. This means that when a new version is released, all packages will have the same version number and git tag. This is useful when you want to maintain consistency across all packages.

- Monorepo example - If you have a monorepo with three packages (package A, package B, and package C), and you release version 1.0.0 in synced mode, all three packages will have the same version number (1.0.0) and git tag (v1.0.0). If you make changes to package A and release a new version (e.g., 1.1.0), all three packages will be updated to version 1.1.0 with the git tag v1.1.0.
- Common repo - If you have a common repo, it will update the package version.

For monorepos `synced` mode is typically used when all packages in the are closely related and should be updated together. However, if you only want to update the packages that have been affected by changes since the last release, you can run the command with `synced=false` or leave it undefined. In this mode, only the packages that have been affected by changes will be updated to the new version.

### Async (just for monorepos)

In async mode, the **Turbo Version** command updates only the packages that have been affected by commits since the last release. This means that it analyzes the commit history and determines which packages have had changes made to them. It then applies the appropriate version bump to each affected package, according to the specifications in the version.config.json file.

In async mode, if the user does not specify the bump kind, the tool will automatically determine the next version based on the commit messages since the last release. The tool will parse the commit messages and look for specific keywords to determine the appropriate semantic version bump. For example, if the commit messages contain the keyword "fix", the tool will automatically bump the patch version. If the messages contain the keyword "feat", the tool will bump the minor version.

If there are no commit messages to determine the bump kind, the tool will default to the "patch" version bump. Once the bump kind is determined, the tool will update the version for all affected packages and generate the appropriate version tags. If the user specifies the target package, only that specific package will be updated; otherwise, all affected packages will be updated.

## Arguments

### Async

- `-t, --target <project>`: Specifies the name of a specific package to bump the version for. If this argument is not provided, all packages affected by commits since the last release will be bumped.
- `-b, --bump <version>`: Specifies the type of version bump to perform. Available options are: `patch`, `minor`, `major`, `premajor`, `preminor`, `prepatch`, and `prerelease`. If this argument is not provided, the version bump will be determined based on the commit messages since the last release.

### Sync

- `-b, --bump <version>`: Specifies the type of update. The available options are `patch`, `minor`, `major`, `premajor`, `preminor`, `prepatch`, `prerelease`. If not specified, all packages will be updated based on the commit messages since the last release.

## Two approaches to versioning

Semantic Commit Messages-based versioning

**Turbo Version** analyzes these semantic commit messages and automatically determines the appropriate version number to assign to the next release of the package. For example, if a commit message indicates that a bug was fixed, **Turbo Version** might increment the patch version number (e.g. from 1.2.3 to 1.2.4). If a commit message indicates that a new feature was added, **Turbo Version** might increment the minor version number (e.g. from 1.2.3 to 1.3.0).

Format: `<type>(<scope>): <subject>`

`<scope>` is optional, but in a monorepo context, it's really helpful to determine the package that you worked.

#### Example

```md
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi-colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- https://www.conventionalcommits.org/
- https://seesparkbox.com/foundry/semantic_commit_messages
- http://karma-runner.github.io/1.0/dev/git-commit-msg.html

### Branch name based versioning

**TurboVersion** uses the Git branch name to determine the next version, by default TurboVersion will use [`major`, `minor`, `patch`] as the branch name pattern, for example, if your current version is 1.2.3, and you have a branch named `patch`, the next version will be 1.2.4 when the `patch` branch is merged into the `main` branch.

#### Configuration

To use branch name-based versioning, you need to configure the `version.config.json` file with the following properties:

- `baseBranch` - the main branch name, it's used to calculate the next version.
- `versionStrategy` - the versioning strategy should be `branchPattern`.
- `branchPattern` - the branch name pattern used to calculate the next version (optional, by default, it's [`major`, `minor`, `patch`]).

## `version.config.json`

This is a JSON schema used to configure the versioning process for a project. The schema provides several properties that can be customized to control how versions are created and managed.

### Properties

The following properties are defined in the schema:

- `tagPrefix`: A string property that represents the prefix used for Git tags in the project. This property is usually set to the name of the project. `${projectName}@` or just `v` for synced workspaces.
- `preset`: A property that specifies the commit message convention preset used by the commitizen tool in the project. The property is a string with a default value of "angular" and can only take one of the two possible string values - "angular" or "conventional".(Only used if `versionStrategy` is set to "commitMessage").
- `baseBranch`: A string property that represents the Git branch that should be used as the base for versioning in the project.
- `synced`: A boolean property that indicates whether or not the local Git repository is synced with the remote repository.
- `updateInternalDependencies`: A property that specifies how to update internal dependencies between packages. The property is a string with a default value of "patch" and can only take one of the three possible string values - "major", "minor", or "patch". Alternatively, the property can be set to the boolean value `false` to disable automatic updates.
- `skip`: A list of package names that should be excluded from the versioning process. When you specify one or more package names in this list, those packages will be skipped in the versioning process. This is useful when you have packages that don't need to be versioned, or that require additional steps before they can be published.
- `commitMessage`: A string property that represents the commit message pattern used by the commitizen tool in the project. This property is a regular expression. Example: `chore(new version): release version ${version} [skip-ci]` or `chore(${packageName}): release version ${version} [skip-ci]`.
- `versionStrategy`: A string property that specifies the versioning strategy. The property can be set to either "branchPattern" or "commitMessage". By default, it's set to "commitMessage".
- `branchPattern`: An array property that represents the branch name pattern used to calculate the next version. By default, it's set to [`major`, `minor`, `patch`(Applied just when `versionStrategy` is set to "branchPattern").
- `prereleaseIdentifier`: String argument that will append the value of the string as a prerelease identifier `next | beta | alpha ...`
- `skipHooks`: A boolean property that indicates whether the Git commit hooks are run or not.  Defaults to `false`.

### Required Properties

The following properties are required in the schema:

- `tagPrefix`: The `tagPrefix` property is required and must be a non-empty string.
- `preset`: The `preset` property is required and must be set to one of the two possible string values - "angular" or "conventional".
- `baseBranch`: The `baseBranch` property is required and must be a non-empty string.
- `updateInternalDependencies`: The `updateInternalDependencies` property is required and must be set to one of the three possible string values - "major", "minor", or "patch", or the boolean value `false`.

## Turbo Version + PNPM

We believe that PNPM is the perfect match for Turbo Version. With Turbo Version, you can easily manage your monorepo version packages, and deliver them with PNPM using just two commands:

```bash
pnpm turbo-version

pnpm publish -r
```

- `pnpm turbo-version` - generates new changelogs, tags, and updates package versions.
- `pnpm publish -r` - recursively publishes all packages in your monorepo that have not yet been published.
