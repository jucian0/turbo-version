use anyhow::Result;

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
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "snake_case")]
pub enum UpdateInternalDependencies {
    Major,
    Minor,
    Patch,
    NoInternalUpdate,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "snake_case")]
pub enum Strategy {
    AllPackages,
    AffectedPackages,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "snake_case")]
pub enum VersionStrategy {
    BranchPattern,
    CommitMessage,
}

pub fn setup() -> Result<Config> {
    let current_dir = std::env::current_dir()?;
    let config_path = current_dir.join("version.config.json");

    if !config_path.exists() {
        return Err(anyhow::anyhow!("version.config.json not found in the current directory. Please ensure you're running this command from the root of your monorepo."));
    }

    let file = std::fs::File::open(&config_path)?;
    let reader = std::io::BufReader::new(file);
    let mut config: Config = serde_json::from_reader(reader)?;

    if config.version_strategy.is_none() {
        config.version_strategy = Some(VersionStrategy::CommitMessage);
    }

    if config.tag_prefix.is_empty() {
        return Err(anyhow::anyhow!("tag_prefix is required in config.json"));
    }

    // Only validate branch_pattern if VersionStrategy is BranchPattern
    if let Some(VersionStrategy::BranchPattern) = config.version_strategy {
        if let Some(branch_pattern) = &config.branch_pattern {
            if branch_pattern.is_empty() {
                config.branch_pattern = Some(vec![
                    "major".to_string(),
                    "minor".to_string(),
                    "patch".to_string(),
                ]);
                println!(
                    "Using default branch pattern: {:?}, if this is not what you want, please specify a branch pattern in config.json",
                    config.branch_pattern
                );
            }
        } else {
            return Err(anyhow::anyhow!(
                "branch_pattern is required in config.json when using BranchPattern strategy"
            ));
        }
    }

    Ok(config)
}
