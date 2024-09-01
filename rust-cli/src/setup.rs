use std::fs::File;
use std::io::BufReader;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use std::path::Path;
use std::env;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub tag_prefix: String,
    pub preset: String,
    pub base_branch: String,
    pub synced: bool,
    pub packages: Vec<String>,
    pub update_internal_dependencies: UpdateInternalDependencies,
    pub strategy: Strategy,
    pub version_strategy: Option<VersionStrategy>,
    pub branch_pattern: Vec<String>,
}

pub enum UpdateInternalDependencies {
    Major,
    Minor,
    Patch,
    NoInternalUpdate,
}

pub enum Strategy {
    FirstRelease,
    NextRelease,
    LastRelease,
}

pub enum VersionStrategy {
    BranchPattern,
    CommitMessage,
}

pub async fn setup() -> Result<Config> {
    // Get the current working directory (should be the monorepo root)
    let current_dir = env::current_dir()?;

    // Construct the path to the config file
    let config_path = current_dir.join("version.config.json");

    if !config_path.exists() {
        return Err(anyhow::anyhow!("version.config.json not found in the current directory. Please ensure you're running this command from the root of your monorepo."));
    }

    let file = File::open(&config_path)?;
    let reader = BufReader::new(file);
    let mut config: Config = serde_json::from_reader(reader)?;

    // Use `if let` instead of `if()` for enum comparison
    if let None = config.version_strategy {
        config.version_strategy = Some(VersionStrategy::CommitMessage);
    }

    // Validate required fields
    if config.tag_prefix.is_empty() {
        return Err(anyhow::anyhow!("tag_prefix is required in config.json"));
    }
    if config.packages.is_empty() {
        return Err(anyhow::anyhow!("At least one package must be specified in config.json"));
    }

    Ok(config)
}