import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "MySQL Database",
    depth: 2,
    configure: () => {
        return askEnvironmentConfig([
            {
                key: "MYSQL_DB_HOST",
                name: "MySQL Database Host",
                hint: "This is the host for the MySQL database"
            },
            {
                key: "MYSQL_DB_PORT",
                name: "MySQL Database Port",
                hint: "This is the port for the MySQL database"
            },
            {
                key: "MYSQL_DB_USER",
                name: "MySQL Database User",
                hint: "This is the user for the MySQL database"
            },
            {
                key: "MYSQL_DB_PASSWORD",
                name: "MySQL Database Password",
                hint: "This is the password for the MySQL database"
            },
            {
                key: "MYSQL_DB_NAME",
                name: "MySQL Database Name",
                hint: "This is the name of the MySQL database"
            }
        ])
    },
    default_env: [
        "MYSQL_DB_HOST=",
        "MYSQL_DB_PORT=",
        "MYSQL_DB_USER=",
        "MYSQL_DB_PASSWORD=",
        "MYSQL_DB_NAME=",
    ],
    default_enabled: false,
    required_for_database: "MySQL",
    hint: "Configure MySQL as a secondary database.",
    autoconfigure: async () => {
        return [
            "MYSQL_DB_HOST=localhost",
            "MYSQL_DB_PORT=3306",
            "MYSQL_DB_USER=root",
            "MYSQL_DB_PASSWORD=password",
            "MYSQL_DB_NAME=kitforstartups-mysql"
        ]
    }
};

export default builder;