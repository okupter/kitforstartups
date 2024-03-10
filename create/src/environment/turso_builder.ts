import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "Turso Database",
    depth: 2,
    configure: () => {
        return askEnvironmentConfig([
            {
                key: "TURSO_DB_URL",
                name: "Turso Database URL",
                hint: "This is the URL for the Turso database"
            },
            {
                key: "TURSO_AUTH_TOKEN",
                name: "Turso Auth Token",
                hint: "This is the auth token for the Turso database"
            }
        ])
    },
    default_env: [
        "TURSO_DB_URL=",
        "TURSO_AUTH_TOKEN=",
    ],
    default_enabled: false,
    required_for_database: "Turso",
    hint: "Configure Turso as a secondary database"
};

export default builder;