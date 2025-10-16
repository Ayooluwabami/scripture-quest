module.exports = {
  apps: [
    {
      name: 'scripture-quest-api',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Memory management
      max_memory_restart: '500M',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Environment-specific settings
      node_args: process.env.NODE_ENV === 'development' ? ['--inspect'] : [],
      
      // Watch files in development
      watch: process.env.NODE_ENV === 'development',
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'logs', 'tests'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Source map support
      source_map_support: true,
      
      // Merge logs
      merge_logs: true,
      
      // Time zone
      time: true
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['api.scripturequest.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-org/scripture-quest.git',
      path: '/var/www/scripture-quest',
      'post-deploy': 'cd backend && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    },
    
    staging: {
      user: 'deploy',
      host: ['staging.scripturequest.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/scripture-quest.git',
      path: '/var/www/scripture-quest-staging',
      'post-deploy': 'cd backend && npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};