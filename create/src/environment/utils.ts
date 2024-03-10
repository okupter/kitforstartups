import {PrimaryDatabase} from "../database.js";
import * as p from "@clack/prompts";
import {PromptGroup} from "@clack/prompts";

export type DynamicConfigBuilder = {
    name: string,
    depth: number
    configure: () => Promise<string[]>,
    default_env: string[],
    default_enabled: boolean,
    required_for_database?: PrimaryDatabase,
    hint?: string,
    autoconfigure?: () => Promise<string[]>
}

export type EnvironmentElement = {
    key: string,
    name: string,
    hint: string,
    default?: string,
}

export async function askEnvironmentConfig(config: EnvironmentElement[]): Promise<string[]> {
    let grp: PromptGroup<{[key: string]: string | symbol }> = {}

    for (let element of config) {
        grp[element.key] = () => p.text({
            message: element.name,
            defaultValue: element.default,
            placeholder: element.hint
        })
    }

    let result = await p.group(grp, {
        onCancel: () => {
            p.cancel("Environment configuration cancelled.")
            process.exit(1)
        }
    })

    for (let key in result) {
        if (result[key] === undefined) {
            delete result[key]
        }
    }

    return Object.entries(result).map(([key, value]) => `${key}=${value}`)
}