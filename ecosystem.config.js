module.exports = {
  apps: [{
    name: 'nextjs',
    script: './server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    watch: [
      '.dist'
    ],
    ignore_watch: [
      // 从监控目录中排除
      'node_modules',
      'logs',
      'static'
    ],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3002
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    out_file: './logs/out.log', // 普通日志路径
    error_file: './logs/err.log', // 错误日志路径
    log_date_format: 'YYYY-MM-DD HH:mm Z' // 设置日志的日期格式
  }],

  deploy: {
    production: {
      // user: 'node',
      // host: '212.83.163.1',
      // user: 'administrator',
      user: 'root',
      host: ['49.235.218.231', '212.83.163.1'],
      ref: 'origin/master',
      // repo: 'git@github.com:repo.git',
      repo: 'git@github.com:HEYlime/github-easy-copy.git',
      path: '/www/wwwroot',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'env': {
        'NODE_ENV': 'production'
      }
    }
  }
};
