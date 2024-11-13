use crate::setup::Config;
use crate::utils::get_packages;

pub fn affected_packages_strategy(config: Config) {
    println!("Affected packages strategy");
    let mut packages = get_packages::get_packages();
    // let type = config.bump;

    // let tag_prefix = format!("{}-{}", config.tag_prefix, type);

    // let latest_tag = get_latest_tag(tag_prefix);

    // let mut versions = Vec::new();

    // for package in packages {
    //     let version = generate_version(package, latest_tag, config);
    //     versions.push(version);
    // }
}
