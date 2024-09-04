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
    pub synced: bool,
    pub packages: Option<Vec<String>>,
    pub update_internal_dependencies: UpdateInternalDependencies,
    pub strategy: Option<Strategy>,
    pub version_strategy: Option<VersionStrategy>,
    pub branch_pattern: Option<Vec<String>>,
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
    first_release,
    next_release,
    last_release,
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

    // Handle the optional packages field
    if let Some(packages) = &config.packages {
        if packages.is_empty() {
            return Err(anyhow::anyhow!(
                "At least one package must be specified in config.json"
            ));
        }
    } else {
        return Err(anyhow::anyhow!(
            "packages field must be specified in config.json"
        ));
    }

    Ok(config)
}
