import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "Resend Email API",
    depth: 1,
    configure: () => {
        return askEnvironmentConfig([
            {
                key: "RESEND_API_KEY",
                name: "Resend Email API Key",
                hint: "This is the API key for the Resend Email API"
            }
        ])
    },
    default_env: [
        "RESEND_API_KEY="
    ],
    default_enabled: false,
    hint: "This is used to send emails to users in production"
};

export default builder;