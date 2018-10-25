// Container for the env vars
const environments = {};

environments.staging = {
    port: 3000,
    server: 'staging'
};

environments.production = {
    port: 5000,
    server: 'production'
};

const env = typeof(process.env.NODE_ENV) == 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// is current env defined
const targetEnv = typeof(environments[env]) == 'object'
    ? environments[env]
    : environments.staging;

module.exports = targetEnv;