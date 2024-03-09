import chalk from 'chalk';
import commandExists from "command-exists";
import * as p from '@clack/prompts';

async function check_command(command: string) {
    return await commandExists(command).then(() => true).catch(() => false);
}

export type FeatureConfigurationFlag = "core" | "create_git_repo";

type Dependency = {
    name: string;
    message: string;
    error: string;
    check: () => Promise<boolean>;
    required_flags: FeatureConfigurationFlag[];
    docker_feature: boolean;
}

const dependencies: Dependency[] = [
    {
        name: "git",
        message: "Git is installed",
        error: "Git is not installed",
        check: () => check_command('git'),
        required_flags: ["create_git_repo"],
        docker_feature: false,
    },
    {
        name: "pnpm",
        message: "PNPM is installed",
        error: "PNPM is not installed",
        check: () => check_command('pnpm'),
        required_flags: ["core"],
        docker_feature: false,
    },
    {
        name: "node",
        message: "Node.js version v18 or later is installed",
        error: "Node.js version v18 or later is not installed",
        check: async () => {
            let node_version = process.version.split('.')[0].replace('v', '');
            return parseInt(node_version) >= 18;
        },
        required_flags: ["core"],
        docker_feature: false,
    },
    {
        name: "docker",
        message: "Docker is installed",
        error: "Docker is not installed",
        check: () => check_command('docker'),
        required_flags: [],
        docker_feature: true,
    },
    {
        name: "docker-compose",
        message: "Docker Compose is installed",
        error: "Docker Compose is not installed",
        check: () => check_command('docker-compose'),
        required_flags: [],
        docker_feature: true,
    }
]

export type DockerSupported = boolean;

export async function check_dependencies(flags: FeatureConfigurationFlag[]): Promise<DockerSupported> {
    let had_error = false;
    let docker_supported = true;

    for (let dependency of dependencies) {
        if (await dependency.check()) {
            p.log.info(dependency.message);
        } else {
            if (dependency.required_flags.some(flag => flags.includes(flag))) {
                had_error = true;
                p.log.error(dependency.error);
            } else {
                p.log.error(dependency.error + chalk.gray(" (optional)"));
            }

            if (dependency.docker_feature) {
                docker_supported = false;
            }
        }
    }

    if (had_error) {
        p.cancel("Please install the missing dependencies and try again");
        process.exit(1);
    }

    return docker_supported;
}