use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct Package {
    name: String,
    version: String,
}

impl Package {
    fn new(path: PathBuf) -> Result<Self, String> {
        let path_str = path.display().to_string(); // Store the path in a variable
        let package_json = fs::read_to_string(path).unwrap();
        let package: serde_json::Value = serde_json::from_str(&package_json).unwrap();

        let name = package
            .get("name")
            .and_then(|n| n.as_str())
            .map(|n| n.to_string());
        let version = package
            .get("version")
            .and_then(|v| v.as_str())
            .map(|v| v.to_string());

        match (name, version) {
            (Some(name), Some(version)) => Ok(Package { name, version }),
            _ => Err(format!(
                "Invalid package.json at {}: missing name or version property",
                path_str
            )),
        }
    }
}

pub fn get_packages() -> Vec<Package> {
    let mut packages = Vec::new();
    let current_dir = std::env::current_dir().unwrap();

    fn visit_dirs(dir: &PathBuf, packages: &mut Vec<Package>) {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.filter_map(Result::ok) {
                let path = entry.path();
                if path.is_file() && path.file_name().unwrap().to_str().unwrap() == "package.json" {
                    if let Ok(package) = Package::new(path) {
                        packages.push(package);
                    }
                } else if path.is_dir() {
                    visit_dirs(&path, packages);
                }
            }
        }
    }

    visit_dirs(&current_dir, &mut packages);
    packages
}
