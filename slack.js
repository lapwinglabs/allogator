var fmt = require('util').format;

/**
 * Format slack message
 *
 * @param {String} level
 * @param {String} message
 * @param {Object} meta
 * @return {Object}
 */

module.exports = function slackFormatter(level, message, meta) {
  meta = meta || {}
  var color = '#00A2FF';
  if (level == 'warn') color = '#F8C82D'
  if (level == 'error') color = '#E84B3A'

  var attachmentFields = [];

  // Custom format error details
  if (meta.error) {
    attachmentFields.push({
      title: 'stack',
      value: wrapMarkdown(meta.error.stack)
    })

    delete meta.error
  }

  // Attach any additional details
  for (var key in meta) {
    var value = meta[key]
    attachmentFields.push({
      title: key,
      value: wrapMarkdown(value)
    })
  }

  var message = fmt('[%s] %s', level.toUpperCase(), message);
  return { attachments: [ {
    fallback: message,
    pretext: message,
    color: color,
    fields: attachmentFields,
    mrkdwn_in: ["pretext", "text", "title", "fields", "fallback"]
  }]};
}

function wrapMarkdown(value) {
  if (typeof value === 'object') value = JSON.stringify(value, null, 2)
  var str = String(value)
  if (str == '') return str
  if (str.indexOf('\n') >= 0) {
    return '```' + str + '```'
  }
  else {
    return '`' + str + '`'
  }
}
