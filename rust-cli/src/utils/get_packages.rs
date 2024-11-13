use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Package {
    name: String,
    version: String,
    description: String,
    main: String,
    scripts: serde_json::Value,
    dependencies: serde_json::Value,
    // Add other fields as needed
}

impl Package {
    fn new(path: std::path::PathBuf) -> Self {
        // Read the package.json file and deserialize it into a Package struct
        let package_json = std::fs::read_to_string(path.join("package.json")).unwrap();
        serde_json::from_str(&package_json).unwrap()
    }
}

pub fn get_packages() -> Vec<Package> {
    let mut packages = Vec::new();
    let current_dir = std::env::current_dir().unwrap();

    fn visit_dirs(dir: &std::path::Path, packages: &mut Vec<Package>) {
        if let Ok(entries) = std::fs::read_dir(dir) {
            for entry in entries.filter_map(Result::ok) {
                let path = entry.path();
                if path.is_dir() {
                    packages.push(Package::new(path.clone()));
                    visit_dirs(&path, packages);
                }
            }
        }
    }

    visit_dirs(&current_dir, &mut packages);
    packages
}
