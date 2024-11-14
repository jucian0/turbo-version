// pub fn get_git_commits() -> Vec<String> {
//     let mut commits = Vec::new();
//     let current_dir = std::env::current_dir().unwrap();
//     let git_dir = current_dir.join(".git");
//     if git_dir.exists() {
//         let output = std::process::Command::new("git")
//             .args(&["log", "--pretty=format:%H"])
//             .output()
//             .unwrap();
//         commits = String::from_utf8_lossy(&output.stdout)
//             .split('\n')
//             .map(|s| s.to_string())
//             .collect();
//     }
//     commits
// }

// pub fn get_git_commit_messages() -> Vec<String> {
//     let mut commit_messages = Vec::new();
//     let current_dir = std::env::current_dir().unwrap();
//     let git_dir = current_dir.join(".git");
//     if git_dir.exists() {
//         let output = std::process::Command::new("git")
//             .args(&["log", "--pretty=format:%B"])
//             .output()
//             .unwrap();
//         commit_messages = String::from_utf8_lossy(&output.stdout)
//             .split('\n')
//             .map(|s| s.to_string())
//             .collect();
//     }
//     commit_messages
// }

pub fn get_last_tag() -> String {
    let current_dir = std::env::current_dir().unwrap();
    let git_dir = current_dir.join(".git");
    if git_dir.exists() {
        let output = std::process::Command::new("git")
            .args(&["describe", "--abbrev=0", "--tags"])
            .output()
            .unwrap();
        return String::from_utf8_lossy(&output.stdout).to_string();
    }
    "".to_string()
}

// pub fn get_git_commits_length_since_last_tag() -> usize {
//     let last_tag = get_last_tag();
//     let commits = get_git_commits();
//     commits.len()
// }
