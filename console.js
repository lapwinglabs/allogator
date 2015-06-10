var winston = require('winston')
var util = require('util')
var BaseConsole = winston.transports.Console

var Console = exports.Console = function (options) {
  options = options || {};
  this.baseConsole = new BaseConsole(options)
}

util.inherits(Console, winston.Transport);

Console.prototype.name = 'console'

Console.prototype.log = function (level, msg, meta, callback) {
  if (meta.error) {
    msg += '\n'
    msg += meta.error.stack
  }
  var newMeta = JSON.parse(JSON.stringify(meta))
  delete newMeta.error

  this.baseConsole.log(level, msg, newMeta, callback)
};
