use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
struct PackageJson {
    version: String,
}
pub fn get_internal_version() -> Result<String> {
    let current_dir = std::env::current_dir()?;
    let config_path = current_dir.join("./../package.json");

    if !config_path.exists() {
        return Err(anyhow::anyhow!("package.json not found in the current directory. Please ensure you're running this command from the root of your monorepo."));
    }

    let file = std::fs::File::open(&config_path)?;
    let reader = std::io::BufReader::new(file);
    let package_json: PackageJson = serde_json::from_reader(reader)?;
    Ok(package_json.version)
}
