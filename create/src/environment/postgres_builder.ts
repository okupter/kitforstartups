import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "Postgres Database",
    depth: 2,
    configure: () => {
        return askEnvironmentConfig([
            {
                key: "POSTGRES_DB_HOST",
                name: "Postgres Database Host",
                hint: "This is the host for the Postgres database"
            },
            {
                key: "POSTGRES_DB_PORT",
                name: "Postgres Database Port",
                hint: "This is the port for the Postgres database"
            },
            {
                key: "POSTGRES_DB_USER",
                name: "Postgres Database User",
                hint: "This is the user for the Postgres database"
            },
            {
                key: "POSTGRES_DB_PASSWORD",
                name: "Postgres Database Password",
                hint: "This is the password for the Postgres database"
            },
            {
                key: "POSTGRES_DB_NAME",
                name: "Postgres Database Name",
                hint: "This is the name of the Postgres database"
            },
            {
                key: "POSTGRES_MAX_CONNECTIONS",
                name: "Postgres Max Connections",
                hint: "This is the maximum number of connections for the Postgres database",
                default: "20"
            }
        ])
    },
    default_env: [
        "POSTGRES_DB_HOST=",
        "POSTGRES_DB_PORT=",
        "POSTGRES_DB_USER=",
        "POSTGRES_DB_PASSWORD=",
        "POSTGRES_DB_NAME=",
        "POSTGRES_MAX_CONNECTIONS=",
    ],
    default_enabled: false,
    required_for_database: "Postgres",
    hint: "Configure Postgres as a secondary database",
    autoconfigure: async () => {
        return [
            "POSTGRES_DB_HOST=localhost",
            "POSTGRES_DB_PORT=5432",
            "POSTGRES_DB_USER=postgres",
            "POSTGRES_DB_PASSWORD=password",
            "POSTGRES_DB_NAME=kitforstartups-postgres",
            "POSTGRES_MAX_CONNECTIONS=20"
        ]
    }
};

export default builder;