use clap::{Arg, Command};
use std::process::exit;

mod single;

fn main() {
    let matches = Command::new("Turbo Version")
        .version("0.1.0") // Replace with actual version
        .about(
            "Version the application by default, following the version.config.json specifications",
        )
        .arg(
            Arg::new("target")
                .short('t')
                .long("target")
                .value_name("PROJECT"),
        )
        .arg(
            Arg::new("bump")
                .short('b')
                .long("bump")
                .value_name("VERSION")
                .help("next version")
                .value_parser([
                    "patch",
                    "minor",
                    "major",
                    "premajor",
                    "preminor",
                    "prepatch",
                    "prerelease",
                ])
                .default_value("patch"),
        )
        .get_matches();

    let name = "Turbo Version";
    println!("{}", name); // Replace with actual figlet and chalk equivalent in Rust

    let config = setup();

    // match setup() {
    //     Ok(mut config) => {
    //         if config.version_strategy == "branchPattern" {
    //             if config.branch_pattern.is_none() {
    //                 config.branch_pattern = Some(vec![
    //                     "major".to_string(),
    //                     "minor".to_string(),
    //                     "patch".to_string(),
    //                 ]);
    //             }
    //         }

    //         if config.synced {
    //             if matches.args_present() {
    //                 println!("Looks like you are using `synced` mode with `-target | --t`. Since `synced` mode precedes `-target | --t`, we are going to ignore it!");
    //             }
    //             if let Some(bump) = matches.get_one::<String>("bump") {
    //                 synced_flux(&config, bump);
    //             } else {
    //                 synced_flux(&config, "");
    //             }
    //         } else {
    //             if let Some(bump) = matches.get_one::<String>("bump") {
    //                 if matches.contains_id("target") {
    //                     single::single_flux(&config, &matches);
    //                 } else {
    //                     async_flux(&config, bump);
    //                 }
    //             } else {
    //                 async_flux(&config, "");
    //             }
    //         }
    //     }
    //     Err(err) => {
    //         eprintln!("ERROR: {}", err);
    //         exit(1);
    //     }
    // }
}

fn synced_flux(config: &Config, bump: &str) {
    println!("synced_flux");
}

fn async_flux(config: &Config, bump: &str) {
    println!("async_flux");
}
