# allogator
Switch logging services on and off in any project by simply setting environment variables

`npm install`

`var log = require('allogator')('my-log')`

*Returns a winston-chains instance*

# Usage

```js
var logger = require('allogator')
var log = logger('myLog')

log.info('hello') // info: [myLog] hello
log.error('error') // error: [myLog] error
log.warn('warn') // warn: [myLog] warn

```

# Setting Environment Variables

#### Set the following environment variables to turn on any of the services below

##### Slack
`SLACK_LOG_WEBHOOK`

`SLACK_LOG_CHANNEL`

(note that the stack trace will be included if an error is passed in meta as `{ error: Error }`)

##### Loggly
`LOGGLY_TOKEN`

`LOGGLY_SUBDOMAIN` (your loggly account subdomain)

`LOGGLY_TAGS` (comma-separated list of tags you want associated with these log messages)

##### LogEntries
`LOGENTRIES_TOKEN`
