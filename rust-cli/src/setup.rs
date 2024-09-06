use anyhow::{anyhow, Result};
use std::env;
use std::fs::File;
use std::io::BufReader;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Config {
    pub tag_prefix: String,
    pub preset: String,
    pub base_branch: Option<String>,
    pub update_internal_dependencies: UpdateInternalDependencies,
    pub skip: Option<Vec<String>>,
    pub commit_message: Option<String>,
    pub version_strategy: Option<VersionStrategy>,
    pub branch_pattern: Option<Vec<String>>,
    pub strategy: Option<Strategy>,
    pub target: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum UpdateInternalDependencies {
    major,
    minor,
    patch,
    no_internal_update,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum Strategy {
    all_packages,
    affected_packages,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum VersionStrategy {
    branch_pattern,
    commit_message,
}

pub fn setup() -> Result<Config, anyhow::Error> {
    let current_dir = std::env::current_dir()?;
    let config_path = current_dir.join("version.config.json");

    if !config_path.exists() {
        return Err(anyhow::anyhow!("version.config.json not found in the current directory. Please ensure you're running this command from the root of your monorepo."));
    }

    let file = std::fs::File::open(&config_path)?;
    let reader = std::io::BufReader::new(file);
    let mut config: Config = serde_json::from_reader(reader)?;

    if let None = config.version_strategy {
        config.version_strategy = Some(VersionStrategy::commit_message);
    }

    if config.tag_prefix.is_empty() {
        return Err(anyhow::anyhow!("tag_prefix is required in config.json"));
    }

    if let Some(branch_pattern) = &config.branch_pattern {
        if branch_pattern.is_empty() {
            return Err(anyhow::anyhow!("branch_pattern is required in config.json"));
        }
    }

    if let Some(strategy) = &config.strategy {
        if let Some(target) = &config.target {
            eprintln!("Warning: 'target' and 'strategy' are both set. 'target' will be ignored.");
        }
    }

    Ok(config)
}
