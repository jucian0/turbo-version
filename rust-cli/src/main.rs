use clap::{Arg, Command};
use std::process::exit;

mod setup;

fn main() {
    let config = setup::setup();

    println!(">>>>>>>>>>>>,{:?}", config);
}
