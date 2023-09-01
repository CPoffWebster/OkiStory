const defaultConfig = {
    API_URL: "http://localhost:3000"
}

export type Config = typeof defaultConfig;

type Key = keyof Config;
const keys: Key[] = Object.keys(defaultConfig) as Key[];
// const { env } = process;

function getConfig() {
    const config = {} as Config;
    for (const key of keys) {
        // const value = config[key] = env[key] || defaultConfig[key];
        const value = config[key] = defaultConfig[key];
        config[key] = value;
    }
    return config;
}

export const environ = getConfig();