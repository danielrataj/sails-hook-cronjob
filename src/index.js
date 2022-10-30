const { CronJob } = require('cron');

module.exports = function (sails) {
  return {
    jobs: {},

    defaults: { cron: {} },

    initialize: function (cb) {
      const config = sails.config.cronjob;
      const jobs = Object.keys(config);

      jobs.forEach(async (job) => {
        if ('guard' in config[job] && typeof config[job].guard === 'function') {
          if (await config[job].guard() === false) {
            return false;
          }
        }

        sails.on(config[job].on || 'ready', () => {
          this.jobs[job] = new CronJob(
            config[job].schedule,
            config[job].onTick,
            config[job].onComplete,
            typeof config[job].start === 'boolean' ? config[job].start : true,
            config[job].timezone,
            Object.prototype.hasOwnProperty.call(config[job], 'context') ? config[job].context : sails,
            typeof config[job].runOnInit === 'boolean' ? config[job].runOnInit : false
          );
        });
      });

      cb();
    }
  };
};
