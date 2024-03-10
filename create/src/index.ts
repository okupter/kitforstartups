#!/usr/bin/env node
import chalk from 'chalk';
import * as p from '@clack/prompts';
import {get_options} from "./installation_options.js";
import {createGitRepo, setupProject} from "./setup_project.js";
import {configureEnvironment} from "./environment.js";
import {configureDatabase} from "./database.js";
import {done, unwrap_cancellation} from "./utils.js";
import {startup} from "./startup.js";

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
if (setup_env) {
    let database = await configureDatabase()
    await configureEnvironment(docker_supported, database)

    if (docker_supported && unwrap_cancellation(await p.confirm({
        message: "Setup environment now?",
    }))) {
        await startup(database)
        process.exit(0)
    }
}

if (working_directory === '.') {
    done("Your project is ready!", [
        "pnpm install",
        "pnpm dev",
    ])
} else {
    done("Your project is ready!", [
        `cd ${working_directory}`,
        "pnpm install",
        "pnpm dev",
    ])
}
