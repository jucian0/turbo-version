use clap::{builder::PossibleValuesParser, Arg, Command, Parser};

mod internals;
mod setup;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Cli {
    /// project you want to bump version
    #[arg(short, long)]
    target: Option<String>,

    /// next kind of version [major,minor,patch,premajor,preminor,prepatch,prerelease]
    #[arg(short, long)]
    bump: Option<String>,
}

fn main() {
    let args = Cli::parse();
    let config = setup::setup().unwrap();
    let strategy = config.strategy.unwrap_or(setup::Strategy::AllPackages);

    let version_strategy = config
        .version_strategy
        .unwrap_or(setup::VersionStrategy::CommitMessage);

    let command = Command::new("Turbot Version")
        .version("0.0.1")
        .about(
            "Version the application by default, following the version.config.json specifications",
        )
        .arg(
            Arg::new("target")
                .short('t')
                .long("target")
                .value_name("project")
                .help("project you want to bump version"),
        )
        .arg(
            Arg::new("bump")
                .short('b')
                .long("bump")
                .value_name("bump")
                .help("next kind of version")
                .value_parser(PossibleValuesParser::new([
                    "major",
                    "minor",
                    "patch",
                    "premajor",
                    "preminor",
                    "prepatch",
                    "prerelease",
                ])),
        );

    if args.target.is_some() {
        println!(">>>>>>>>>>>>,{:?}", args.target.unwrap());
    }

    println!(">>>>>>>>>>>>,{:?}", strategy);
}
