# Turboversion

This is a command-line tool that allows you to bump the versions of your packages in a monorepo project according to Semantic Versioning.By automating the versioning process, **Turboversion** can save developers time and reduce the risk of errors that can occur when version numbers are assigned manually. Additionally, using semantic commit messages can help improve communication and collaboration among team members by providing clear and consistent information about the changes being made to the codebase.

## Usage

You can use **Turboversion** in two ways: **synced**, **async** mode, and **manually** or **affected** packages by commits since the last release.

```bash

yarn add -D turboversion

```

### Synced

In `synced` mode, all packages in the monorepo will be updated with the same version and tag. This means that when a new version is released, all packages will have the same version number and git tag. This is useful when you want to maintain consistency across all packages in the monorepo.

For example, if you have a monorepo with three packages (package A, package B, and package C), and you release version 1.0.0 in synced mode, all three packages will have the same version number (1.0.0) and git tag (v1.0.0). If you make changes to package A and release a new version (e.g., 1.1.0), all three packages will be updated to version 1.1.0 with the git tag v1.1.0.

Synced mode is typically used when all packages in the monorepo are closely related and should be updated together. However, if you only want to update the packages that have been affected by changes since the last release, you can run the command with `synced=false` or leave it undefined. In this mode, only the packages that have been affected by changes will be updated to the new version.

### Async

In async mode, the **Turboversion** command updates only the packages that have been affected by commits since the last release. This means that it analyzes the commit history and determines which packages have had changes made to them. It then applies the appropriate version bump to each affected package, according to the specifications in the turbov.config.json file.

In async mode, if the user does not specify the bump kind, the tool will automatically determine the next version based on the commit messages since the last release. The tool will parse the commit messages and look for specific keywords to determine the appropriate semantic version bump. For example, if the commit messages contain the keyword "fix", the tool will automatically bump the patch version. If the messages contain the keyword "feat", the tool will bump the minor version.

If there are no commit messages to determine the bump kind, the tool will default to the "patch" version bump. Once the bump kind is determined, the tool will update the version for all affected packages and generate the appropriate version tags. If the user specifies the target package, only that specific package will be updated; otherwise, all affected packages will be updated.

## Arguments

### Async

- `-t, --target <project>`: Specifies the name of a specific package to bump the version for. If this argument is not provided, all packages affected by commits since the last release will be bumped.
- `-b, --bump <version>`: Specifies the type of version bump to perform. Available options are: `patch`, `minor`, `major`, `premajor`, `preminor`, `prepatch`, and `prerelease`. If this argument is not provided, the version bump will be determined based on the commit messages since the last release.

### Sync

- `-b, --bump <version>`: Specifies the type of update. The available options are `patch`, `minor`, `major`, `premajor`, `preminor`, `prepatch`, `prerelease`. If not specified, all packages will be updated based on the commit messages since the last release.

## Semantic Commit Messages

**Turboversion** analyzes these semantic commit messages and automatically determines the appropriate version number to assign to the next release of the package. For example, if a commit message indicates that a bug was fixed, **Turboversion** might increment the patch version number (e.g. from 1.2.3 to 1.2.4). If a commit message indicates that a new feature was added, **Turboversion** might increment the minor version number (e.g. from 1.2.3 to 1.3.0).

Format: `<type>(<scope>): <subject>`

`<scope>` is optional, but in a monorepo context, it's really helpful to determine the package that you worked.

### Example

```
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
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- https://www.conventionalcommits.org/
- https://seesparkbox.com/foundry/semantic_commit_messages
- http://karma-runner.github.io/1.0/dev/git-commit-msg.html

## JSON Schema Description

This JSON schema describes a configuration file for a software development project. The configuration file is represented as a JSON object with several properties that are used to configure various aspects of the project.

The schema follows the Draft 7 of the JSON Schema specification.

### Properties

The following properties are defined in the schema:

- `tagPrefix`: A string property that represents the prefix used for Git tags in the project. This property is usually set to the name of the project.
- `preset`: A property that specifies the commit message convention preset used by the commitizen tool in the project. The property is a string with a default value of "angular" and can only take one of the two possible string values - "angular" or "conventional".
- `baseBranch`: A string property that represents the Git branch that should be used as the base for versioning in the project.
- `synced`: A boolean property that indicates whether or not the local Git repository is synced with the remote repository.
- `packages`: An array property that lists the directories in the repository that contain packages.
- `updateInternalDependencies`: A property that specifies how to update internal dependencies between packages. The property is a string with a default value of "patch" and can only take one of the three possible string values - "major", "minor", or "patch". Alternatively, the property can be set to the boolean value `false` to disable automatic updates.
- `publishConfig`: An object property that contains settings for publishing the package to a registry. The property has a required sub-property `packageManager` that specifies the package manager to use when publishing the package. The `packageManager` sub-property is a string with one of the three possible string values - "npm", "yarn", or "pnpm".

### Required Properties

The following properties are required in the schema:

- `tagPrefix`: The `tagPrefix` property is required and must be a non-empty string.
- `preset`: The `preset` property is required and must be set to one of the two possible string values - "angular" or "conventional".
- `baseBranch`: The `baseBranch` property is required and must be a non-empty string.
- `updateInternalDependencies`: The `updateInternalDependencies` property is required and must be set to one of the three possible string values - "major", "minor", or "patch", or the boolean value `false`.
- `packages`: The `packages` property is not required but recommended to be defined with a non-empty array of strings that represent the directories in the repository that contain packages.
