import {PrimaryDatabase} from "./database.js";
import * as p from '@clack/prompts';
import shelljs from "shelljs";
import {done} from "./utils.js";

async function runCommand(command: string) {
    return new Promise((resolve, reject) => {
        shelljs.exec(command, { silent: true }, (code, stdout, stderr) => {
            if (code === 0) {
                resolve(stdout)
            } else {
                reject(stderr)
            }
        })
    })
}

export async function startup(database: PrimaryDatabase) {
    // PWD is project directory
    let spinner = p.spinner()
    spinner.start("Installing dependencies")
    await runCommand("pnpm install")
    await runCommand("pnpm svelte-kit sync")
    spinner.stop("Dependencies installed")
    spinner.start("Starting MailHog")
    await runCommand("docker-compose -f docker/mailhog.yml up -d")
    spinner.stop("Mailhog started using the command `docker-compose -f docker/mailhog.yml up -d`. Access it at http://localhost:8025")

    if (database === null) {
        spinner.stop("No database selected")
        done("Your project is ready!", [
            "Setup a database according to the instructions in the README.md file.",
            "pnpm generate-migrations:[mysql|postgres|turso]",
            "pnpm migrate:[mysql|postgres|turso]",
            "pnpm push:[mysql|postgres|turso]",
            "pnpm dev",
        ])
        return
    }

    let dbname = "mysql"
    if (database === "Postgres") {
        dbname = "postgres"
    } else if (database === "Turso") {
        dbname = "turso"
    }

    if (database !== "Turso") {
        spinner.start("Starting database")

        await runCommand(`docker-compose -f docker/${dbname}.yml up -d`)
        spinner.stop("Database started using the command `docker-compose -f docker/" + dbname + ".yml up -d`")

        // wait for database to start
        spinner.start("Waiting for database to start")
        await new Promise(resolve => setTimeout(resolve, 10000))
        spinner.stop("Database started")
    }

    spinner.start("Generating migrations")
    await runCommand("pnpm generate-migrations:" + dbname)
    spinner.stop("Migrations generated")
    spinner.start("Migrating database")
    await runCommand("pnpm migrate:" + dbname)
    spinner.stop("Database migrated")
    spinner.start("Pushing database")
    await runCommand("pnpm push:" + dbname)
    spinner.stop("Your project is ready!")
    done("Your project is ready!", [
        "pnpm dev",
    ])
}