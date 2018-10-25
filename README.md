# NodeJS Master First Practice

Server configurations are set to **localhost:3000** for staging and **localhost:5000** for production

## Staging

Explicit server staging environment

```bash
NODE_ENV=staging node index.js
```

or Implicit

```bash
node index.js
```

## Production

```bash
NODE_ENV=production node index.js
```