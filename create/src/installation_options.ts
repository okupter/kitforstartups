import * as p from "@clack/prompts";
import fs from "fs";
import {unwrap_cancellation} from "./utils.js";
import {check_dependencies} from "./dependencies.js";

function expect_empty_directory(working_directory: string) {
    if (fs.existsSync(working_directory) && fs.readdirSync(working_directory).length > 0) {
        p.log.error("Directory " + working_directory + " is not empty. Can't continue");
        process.exit(1);
    }
}


export type InstallOptions = {
    working_directory: string;
    create_git_repo: boolean;
    docker_supported: boolean;
    setup_env: boolean;
}

export async function get_options(): Promise<InstallOptions> {
    let working_directory = process.argv[2] || '.';

    if (working_directory === '.') {
        const dir = unwrap_cancellation(await p.text({
            message: 'Where should your project be created?',
            placeholder: '  (hit Enter to use current directory)'
        }));

        working_directory = dir || '.';
    }

    expect_empty_directory(working_directory);

    let create_git_repo = unwrap_cancellation(await p.confirm({
        message: 'Do you want to create a Git repository?',
        initialValue: true
    }));

    let setup_env = unwrap_cancellation(await p.confirm({
        message: 'Do you want to initialize a development environment?',
        initialValue: true
    }));

    let docker_supported = await check_dependencies(create_git_repo ? ["core", "create_git_repo"]: ["core"])

    return {
        working_directory,
        create_git_repo,
        docker_supported,
        setup_env
    }
}