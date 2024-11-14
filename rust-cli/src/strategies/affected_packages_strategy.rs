use crate::setup::Config;
use crate::utils::get_packages;
use crate::utils::git::get_latest_tag;

pub fn affected_packages_strategy(config: Config) {
    println!("Affected packages strategy");
    let packages = get_packages::get_packages();

    let tag_prefix = &config.tag_prefix;

    let latest_tag = get_latest_tag(tag_prefix);

    let mut versions = Vec::new();

    // for package in packages {
    //     let version = generate_version(package, latest_tag, config);
    //     versions.push(version);
    // }
}
