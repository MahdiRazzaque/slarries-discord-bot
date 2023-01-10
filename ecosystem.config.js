module.exports = {
  apps : [
  {
    name: "Slarries discord bot",
    script: './structures/bot.js',
    watch: '.'
  },
  {
	  name: "Lavalink",
	  script: "java -jar ../lavalink/Lavalink.jar",
	  watch: "."
  }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
