import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "Emails",
    depth: 1,
    configure: () => {
        return askEnvironmentConfig([
            {
                name: "Email Sender Name",
                hint: "The name that will appear as the sender of the emails",
                key: "TRANSACTIONAL_EMAILS_SENDER",
                default: "KitForStartups"
            },
            {
                name: "Email Address",
                hint: "The email address that will be used to send the emails",
                key: "TRANSACTIONAL_EMAILS_ADDRESS",
                default: "no-reply@kitforstartups.com"
            },
        ])
    },
    default_env: [
        "TRANSACTIONAL_EMAILS_SENDER=",
        "TRANSACTIONAL_EMAILS_ADDRESS=",
    ],
    default_enabled: true,
    hint: "Transactional emails are sent from this address"
};

export default builder;