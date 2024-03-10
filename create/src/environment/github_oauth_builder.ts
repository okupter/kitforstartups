import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "GitHub OAuth",
    depth: 1,
    configure: () => {
        return askEnvironmentConfig([
            {
                name: "GitHub Client ID",
                hint: "The client ID of the GitHub OAuth application",
                key: "GITHUB_CLIENT_ID",
            },
            {
                name: "GitHub Client Secret",
                hint: "The client secret of the GitHub OAuth application",
                key: "GITHUB_CLIENT_SECRET",
            },
        ])
    },
    default_env: [
        "GITHUB_CLIENT_ID=",
        "GITHUB_CLIENT_SECRET=",
    ],
    default_enabled: false,
    hint: "This is used to authenticate users with GitHub"
};

export default builder;