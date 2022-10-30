# sails-hook-cronjob

![Downloads](https://img.shields.io/npm/dm/sails-hook-cronjob.svg)
![Downloads](https://img.shields.io/npm/dt/sails-hook-cronjob.svg)
![npm version](https://img.shields.io/npm/v/sails-hook-cronjob.svg)

Sails hook for running cron tasks based on [sails-hook-cron](https://github.com/ghaiklor/sails-hook-cron) 👍

## Getting Started

Install it via npm:

```shell
npm install sails-hook-cronjob
```

Configure `config/cronjob.js` in your project:

```javascript
module.exports.cronjob = {
  myFirstJob: {
    schedule: '* * * * * *',
    onTick: function () {
      console.log('You will see this every second');
      console.log(`Also, sails object is available as this, e.g. ${this.config.environment}`);
    }
  }
};
```

## Examples

Schedule field syntax is:

```javascript

// ['seconds', 'minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek']

module.exports.cronjob = {
  firstJob: {
    schedule: '30 47 15 17 may *',
    // in May 17 15:47:30 GMT-0300 (BRT)
    onTick: function() {
      console.log('I will trigger in May 17 15:47:30');
    },
    timezone: 'America/Sao_Paulo'
    // timezone Brazil example
  }
};
```

You can define cron tasks only with required fields:

```javascript
module.exports.cronjob = {
  firstJob: {
    schedule: '* * * * * *',
    onTick: function() {
      console.log('I am triggering every second');
    }
  },

  secondJob: {
    schedule: '*/5 * * * * *',
    onTick: function() {
      console.log('I am triggering every five seconds');
    }
  }
};
```

You can define advanced fields:

```javascript
module.exports.cronjob = {
  myJob: {
    schedule: '* * * * * *',
    onTick: function() {
      console.log('I am triggering when time is come');
    },
    onComplete: function() {
      console.log('I am triggering when job is complete');
    },
    start: true, // Start task immediately
    timezone: 'Ukraine/Kiev', // Custom timezone
    context: undefined, // Custom context for onTick callback
    runOnInit: true // Will fire your onTick function as soon as the request initialization has happened.
  }
};
```

You can get created jobs and start\\stop them when you wish:

```javascript
// config/cronjob.js
module.exports.cronjob = {
  myJob: {
    schedule: '* * * * * *',
    onTick: function() {
      console.log('I am triggering when time is come');
    },
    start: false
  }
};

// api/controllers/SomeController.js
module.exports = {
  someAction: function(req, res) {
    sails.hooks.cronjob.jobs.myJob.start();
    sails.hooks.cronjob.jobs.myJob.stop();
  }
};
```

You can also run cron after specified Sails lifecycle event ("ready" by default):

```javascript
// config/cronjob.js
module.exports.cronjob = {
  myJob: {
    on: 'ready',
    schedule: '* * * * * *',
    onTick: function() {
      console.log('I am triggering when time is come');
    },
    start: false
  }
};
```

You can also use the "guard" feature to allow/deny cronjob from running. It is useful for example when you want to run a cronjob only on a specific environment (backend workers, etc.):

```javascript
// config/cronjob.js
module.exports.cronjob = {
  myJob: {
    guard: async () => {
      return true
    },
    schedule: '* * * * * *',
    onTick: function() {
      console.log('I am triggering when time is come');
    }
  }
};
```

## Context

There are three states for the context, i.e. this on `onTick` call:

-   When you don’t declare context - `this` points to the Sails object.
-   If you declare it as a null (`context: null`), `this` points to the original context from the cron library.
-   Otherwise, if you declare a context with some object (`context: {foo: 'bar'}`), `this` will point to the object instead.

## License

[MIT](./LICENSE)
