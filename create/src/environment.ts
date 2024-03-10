import * as p from '@clack/prompts';
import {PrimaryDatabase} from "./database.js";
import {unwrap_cancellation} from "./utils.js";
import fs from "fs/promises";
import {DynamicConfigBuilder} from "./environment/utils.js";
import mysql_builder from "./environment/mysql_builder.js";
import postgres_builder from "./environment/postgres_builder.js";
import turso_builder from "./environment/turso_builder.js";
import github_oauth_builder from "./environment/github_oauth_builder.js";
import google_oauth_builder from "./environment/google_oauth_builder.js";
import resend_builder from "./environment/resend_builder.js";
import email_builder from "./environment/email_builder.js";

type ConfigBuilder = DynamicConfigBuilder | string[]

const environmentConfigBuilder: ConfigBuilder[] = [
    [
        "# DATABASE",
        "ENABLE_DRIZZLE_LOGGER=true",
    ],
    mysql_builder,
    postgres_builder,
    turso_builder,
    [
        "# OAUTH",
    ],
    github_oauth_builder,
    google_oauth_builder,
    resend_builder,
    email_builder
]

export async function configureEnvironment(docker_supported: boolean, primary_db: PrimaryDatabase) {
    // Let the user select which environment variables to configure
    let sections: {
        label: string,
        hint: string
    }[] = environmentConfigBuilder
        .filter((builder: ConfigBuilder) => !Array.isArray(builder)) // Only dynamic builders
        .map((builder: ConfigBuilder) => builder as DynamicConfigBuilder)
        .filter((builder: DynamicConfigBuilder) => {
            if (docker_supported && builder.required_for_database) {
                // Hide the database that is already configured
                if (builder.required_for_database === primary_db) {
                    p.log.message(`Skipping ${builder.name} because it'll be configured automatically.`)
                    return false
                }
            }

            return true
        })
        .map((builder: DynamicConfigBuilder) => ({
            label: builder.name,
            hint: builder.hint || ""
        }))

    let result: string[] = unwrap_cancellation(await p.multiselect({
        message: "What parts of the environment would you like to configure? You'll have to configure the rest later in your .env file.",
        required: false,
        options: sections.map((section) => ({label: section.label, value: section.label, hint: section.hint})),
    }));

    let environment_sections: ConfigBuilder[] = environmentConfigBuilder
        .map((builder: ConfigBuilder) => {
            if (Array.isArray(builder)) return builder
            let dynamic_builder = builder as DynamicConfigBuilder

            // If the selection is the primary database
            if (dynamic_builder.required_for_database === primary_db) {
                if (dynamic_builder.autoconfigure) return {
                        ...dynamic_builder,
                        configure: dynamic_builder.autoconfigure,
                    }

                return dynamic_builder
            }

            // If the section is not selected, return the default environment variables
            if (!result.includes(dynamic_builder.name)) {
                let header = "#".repeat(dynamic_builder.depth) + " " + dynamic_builder.name
                return [header, ...dynamic_builder.default_env]
            }
            return dynamic_builder
        })

    let env: string[] = []
    for (let section of environment_sections) {
        if (Array.isArray(section)) {
            env.push(...section)
            env.push("")
        } else {
            let dynamic_builder = section as DynamicConfigBuilder

            let header = "#".repeat(dynamic_builder.depth) + " " + dynamic_builder.name
            env.push(header)

            let configured_env = await dynamic_builder.configure()
            env.push(...configured_env)
            env.push("")
        }
    }

    let file_contents = env.join("\n")

    // Write the environment variables to the .env file
    await fs.writeFile(".env", file_contents, { encoding: "utf-8" })
}