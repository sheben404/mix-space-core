const { cpus } = require('node:os')

const cpuLen = cpus().length
module.exports = {
  apps: [
    {
      name: 'mx-server',
      script: './out/index.js',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: cpuLen,
      max_memory_restart: '520M',
      args: '',
      env: {
        PORT: '2333',
        ALLOWED_ORIGINS:
          'sheben404.com,www.sheben404.com,localhost:*,127.0.0.1',
      },
    },
  ],
}
