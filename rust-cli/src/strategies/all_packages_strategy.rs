use crate::utils_packages::get_packages;

pub fn all_packages_strategy() -> Vec<Package> {
    let mut packages = get_packages();
    packages.sort_by_key(|p| p.name.clone());
    packages
}
