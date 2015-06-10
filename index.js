var logentries = require('winston-logentries').Logentries;
var slack = require('winston-bishop-slack').Slack;
var slackFormatter = require('./slack.js')
var loggly = require('winston-loggly').Loggly;
var Logger = require('winston-chains');
var Console = require('./console.js').Console;
var fmt = require('util').format;
var production = ('production' == process.env.NODE_ENV)

var SLACK_LOG_WEBHOOK = process.env.SLACK_LOG_HOOK
var SLACK_LOG_CHANNEL = process.env.SLACK_LOG_CHANNEL

var LOGGLY_TOKEN = process.env.LOGGLY_TOKEN
var LOGGLY_SUBDOMAIN = process.env.LOGGLY_SUBDOMAIN
var LOGGLY_TAGS = (process.env.LOGGLY_TAGS || '').split(',')

var LOGENTRIES_TOKEN = process.env.LOGENTRIES_TOKEN

/**
 * Export `log`
 */

module.exports = logger

/**
 * Initialize the production `log` singleton
 *
 * @return {Log}
 * @api public
 */

function logger(name) {
  // Setup General Log
  //  Used for any other important log messages (e.g. unexpected system states, rate-limit warnings, system info, etc)
  //  Audit Trail and Transaction Ledger messages will also be piped into this log
  var logger = Logger(name, {
    transports: [
      (new Console({
        prettyPrint: true,
        colorize: true,
        label: name
      }))
    ]
  })

  if (SLACK_WEBHOOK && SLACK_CHANNEL) {
    logger.use(slack, {
      level: 'warn',
      webhook_url: SLACK_WEBHOOK,
      channel: SLACK_CHANNEL,
      customFormatter: slackFormatter
    })
  }

  if (LOGGLY_TOKEN && LOGGLY_SUBDOMAIN) {
    logger.use(loggly, {
      level: 'info',
      subdomain: LOGGLY_SUBDOMAIN,
      inputToken: LOGGLY_TOKEN,
      json: true,
      tags: ['NodeJS'].concat(LOGGLY_TAGS)
    })
  }

  if (LOGENTRIES_TOKEN) {
    logger.use(logentries, {
      level: 'info',
      token: LOGENTRIES_TOKEN
    })
  }

  return logger
}
