import {PrimaryDatabase} from "./database.js";

type DynamicConfigBuilder = {
    name: string,
    depth: number
    configure: (has_docker: boolean) => Promise<string[]>,
    default_env: string[],
    default_enabled: boolean
}

type ConfigBuilder = DynamicConfigBuilder | string[]

const environmentConfigBuilder: ConfigBuilder[] = [
    [
        "# DATABASE",
        "ENABLE_DRIZZLE_LOGGER=true",
    ],
    {
        name: "MySQL Database",
        depth: 2,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "MYSQL_DB_HOST=",
            "MYSQL_DB_PORT=",
            "MYSQL_DB_USER=",
            "MYSQL_DB_PASSWORD=",
            "MYSQL_DB_NAME=",
        ],
        default_enabled: false
    },
    {
        name: "Postgres Database",
        depth: 2,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "POSTGRES_DB_HOST=",
            "POSTGRES_DB_PORT=",
            "POSTGRES_DB_USER=",
            "POSTGRES_DB_PASSWORD=",
            "POSTGRES_DB_NAME=",
            "POSTGRES_MAX_CONNECTIONS=",
        ],
        default_enabled: false
    },
    {
        name: "Turso Database",
        depth: 2,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "TURSO_DB_URL=",
            "TURSO_AUTH_TOKEN=",
        ],
        default_enabled: false
    },
    [
        "# OAUTH",
    ],
    {
        name: "GitHub OAuth",
        depth: 1,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "GITHUB_CLIENT_ID=",
            "GITHUB_CLIENT_SECRET=",
        ],
        default_enabled: false
    },
    {
        name: "Google OAuth",
        depth: 1,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "GOOGLE_OAUTH_CLIENT_ID=",
            "GOOGLE_OAUTH_CLIENT_SECRET=",
            "GOOGLE_OAUTH_REDIRECT_URI=",
        ],
        default_enabled: false
    },
    {
        name: "Resend Email API",
        depth: 1,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "RESEND_API_KEY="
        ],
        default_enabled: false
    },
    {
        name: "Emails",
        depth: 1,
        configure: async (has_docker: boolean) => { return [] },
        default_env: [
            "TRANSACTIONAL_EMAILS_SENDER=",
            "TRANSACTIONAL_EMAILS_ADDRESS=",
        ],
        default_enabled: true
    }
]

export async function configureEnvironment(docker_supported: boolean, primary_db: PrimaryDatabase) {

}