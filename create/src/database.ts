import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import {unwrap_cancellation} from "./utils.js";

export type PrimaryDatabase = "MySQL" | "Postgres" | "Turso" | null;

async function replace_recursively(pwd: string, old_name: string, new_name: string) {
    let files = await fs.readdir(pwd, {withFileTypes: true});
    for (let file of files) {
        if (file.isDirectory()) {
            await replace_recursively(pwd + "/" + file.name, old_name, new_name);
        } else {
            let content = await fs.readFile(pwd + "/" + file.name, "utf-8");
            content = content.replace(old_name, new_name);
            await fs.writeFile(pwd + "/" + file.name, content);
        }
    }
}

async function select_lucia_module(new_name: string) {
    // print current cwd (not argument)
    await replace_recursively( "src", "$lib/lucia/mysql", "$lib/lucia/" + new_name);
}

async function select_database_driver(new_name: string) {
    await replace_recursively("src", "$lib/drizzle/mysql/models", "$lib/drizzle/" + new_name + "/models");
}

export async function configureDatabase(): Promise<PrimaryDatabase> {
    let db = unwrap_cancellation(await p.select({
        message: "Primary Database",
        options: [
            {
                value: "MySQL",
                label: "MySQL",
                hint: "Simpler, faster for read-heavy workloads"
            },
            {
                value: "Postgres",
                label: "Postgres",
                hint: "Feature-rich, better for complex queries, supports advanced data types"
            },
            {
                value: "Turso",
                label: "Turso",
                hint: "Online database platform"
            },
            {
                value: "None",
                label: "None",
                hint: "I'll configure the database later."
            }
        ],
        initialValue: "MySQL"
    }));
    if (db === "None") return null;

    if (db === "Postgres") {
        await select_database_driver("postgres")
        await select_lucia_module("postgres")
    }
    if (db === "Turso") {
        await select_database_driver("turso")
        await select_lucia_module("turso")
    }

    return db as PrimaryDatabase;
}