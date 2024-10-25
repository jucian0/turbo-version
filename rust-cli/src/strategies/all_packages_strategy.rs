use crate::setup::Config;
use crate::utils_packages::get_packages;
use crate::utils_git::get_latest_tag;



pub fn all_packages_strategy(config: Config) -> Vec<Package> {
    let mut packages = get_packages();
    let type = config.bump;

    let tag_prefix = format!("{}-{}", config.tag_prefix, type);

    let latest_tag = get_latest_tag(tag_prefix);

    let mut versions = Vec::new();

    for package in packages {
        let version = generate_version(package, latest_tag, config);
        versions.push(version);
    }
}
