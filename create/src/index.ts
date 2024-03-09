#!/usr/bin/env node
import chalk from 'chalk';
import * as p from '@clack/prompts';
import {get_options} from "./installation_options.js";
import {createGitRepo, setupProject} from "./setup_project.js";

const version = "1.0.0";

console.log();
console.log(chalk.gray('@kfs/create version ' + version));
console.log();

p.intro('Welcome to KitForStartups!');

let {
    working_directory,
    create_git_repo,
    docker_supported,
    setup_env,
} = await get_options()

await setupProject(working_directory)

if (create_git_repo) await createGitRepo(working_directory)

if (working_directory === '.') {
    p.outro(`Your project is ready! To get started:
    - pnpm install
    
Happy coding!`
    );
} else {
    p.outro(`Your project is ready! To get started:
    - cd ${working_directory}
    - pnpm install
    
Happy coding!`
    );
}
