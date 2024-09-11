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
