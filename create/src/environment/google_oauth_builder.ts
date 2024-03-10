import {askEnvironmentConfig, DynamicConfigBuilder} from "./utils.js";

const builder: DynamicConfigBuilder = {
    name: "Google OAuth",
    depth: 1,
    configure: () => {
        return askEnvironmentConfig([
            {
                key: "GOOGLE_OAUTH_CLIENT_ID",
                name: "Google OAuth Client ID",
                hint: "This is the client ID for Google OAuth"
            },
            {
                key: "GOOGLE_OAUTH_CLIENT_SECRET",
                name: "Google OAuth Client Secret",
                hint: "This is the client secret for Google OAuth"
            },
            {
                key: "GOOGLE_OAUTH_REDIRECT_URI",
                name: "Google OAuth Redirect URI",
                hint: "This is the redirect URI for Google OAuth"
            }
        ])
    },
    default_env: [
        "GOOGLE_OAUTH_CLIENT_ID=",
        "GOOGLE_OAUTH_CLIENT_SECRET=",
        "GOOGLE_OAUTH_REDIRECT_URI=",
    ],
    default_enabled: false,
    hint: "This is used to authenticate users with Google"
};

export default builder;