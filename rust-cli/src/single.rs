use anyhow::{Context, Result};
use git2::Repository;
use semver::Version;
use std::path::Path;

use crate::config::Config;
use crate::git::git_process;
use crate::log::log;
use crate::utils::{
    format_commit_message, format_tag, format_tag_prefix, generate_and_apply_version,
    update_packages,
};

pub async fn synced_flux(config: &Config, bump_type: Option<&str>) -> Result<()> {
    let repo = Repository::open(".")?;
    let packages = get_packages(Path::new("."))?;
    let tag_prefix = format_tag_prefix(true);

    let version = generate_and_apply_version(config, &tag_prefix, bump_type)
        .await
        .context("Failed to generate and apply version")?;

    if let Some(version) = version {
        update_packages(&packages, config, &version, &tag_prefix)
            .await
            .context("Failed to update packages")?;
        commit_and_tag(config, &version, &repo)
            .await
            .context("Failed to commit and tag")?;
    } else {
        log(
            "no_changes",
            "There are no changes since the last release.",
            "All",
        );
    }

    Ok(())
}

async fn commit_and_tag(config: &Config, version: &Version, repo: &Repository) -> Result<()> {
    let tag_prefix = format_tag_prefix(true);
    let next_tag = format_tag(&tag_prefix, version);
    let commit_message = format_commit_message(&config.commit_message, version);

    git_process(repo, &["."], &next_tag, &commit_message)
        .await
        .context("Git process failed")?;

    log(
        "tag",
        &format!("Git Tag generated for {}.", next_tag),
        "All",
    );

    Ok(())
}

fn get_packages(path: &Path) -> Result<Vec<Package>> {
    //implement a function that returns a list of packages
    //the packages are the directories that contain a package.json file
    //the name of the package is the name of the directory
    //the relative_dir is the relative path from the root of the repo to the package
    //the name of the package is the name of the directory
    //the relative_dir is the relative path from the root of the repo to the package
    //the name of the package is the name of the directory
    //the relative_dir is the relative path from the root of the repo to the package
    //the name of the package is the name of the directory
    //the relative_dir is the relative path from the root of the repo to the package

    
}

// You'll need to define these structs:
struct Package {
    name: String,
    relative_dir: String,
    // Add other fields as needed
}
