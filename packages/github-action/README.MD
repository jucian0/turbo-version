# Action Setup for Writing Authentication Tokens

This action allows users to setup their authentication tokens for both GitHub and NPM in a repository's environment variables. The action uses the `GH_TOKEN` and `NPM_TOKEN` environment variables to authenticate users. The `writeNPMRC()` and `writeNETRC()` functions write the authentication tokens to their respective configuration files. The `setupUser()` function sets up the user's Git identity.

## Usage

To use the action in your workflow, add the following step to your `jobs` section:

```yaml
- name: Set up authentication tokens
  uses: ./action
  with:
    npmRepository: <optional NPM repository URL>
```

The npmRepository input is optional and can be used to specify an NPM repository URL.

## Inputs

npmRepository
Optional The NPM repository URL to configure in the .npmrc file.

## Environment Variables

GITHUB_TOKEN
The GitHub authentication token. This is a required environment variable.

NPM_TOKEN
The NPM authentication token. This is a required environment variable.

## Github example

```yaml
name: Setup Auth Tokens

on:
  push:
    branches: [main]

jobs:
  setup-auth-tokens:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up authentication tokens
        uses: jucian0/turbo-semver/github-setup@0.1.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
