var logentries = require('winston-logentries').Logentries;
var slack = require('winston-bishop-slack').Slack;
var slackFormatter = require('./slack.js')
var loggly = require('winston-loggly').Loggly;
var Logger = require('winston-chains');
var Console = require('./console.js').Console;

var SLACK_LOG_WEBHOOK = process.env.SLACK_LOG_WEBHOOK
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
 * Initialize the log with the given name
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

  if (SLACK_LOG_WEBHOOK && SLACK_LOG_CHANNEL) {
    logger.use(slack, {
      level: 'warn',
      webhook_url: SLACK_LOG_WEBHOOK,
      channel: SLACK_LOG_CHANNEL || '#' + name,
      customFormatter: slackFormatter
    })
  }

  if (LOGGLY_TOKEN && LOGGLY_SUBDOMAIN) {
    logger.use(loggly, {
      level: 'info',
      subdomain: LOGGLY_SUBDOMAIN,
      inputToken: LOGGLY_TOKEN,
      json: true,
      tags: ['NodeJS'].concat(LOGGLY_TAGS).concat(name)
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
