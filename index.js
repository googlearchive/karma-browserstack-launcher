var bs = require('browserstack');

var BrowserStackBrowser = function(baseBrowserDecorator, name) {
  baseBrowserDecorator(this);

  this.name = name;
  
  var split = this.name.split(':');
  this.os = split[2].toLowerCase();
  this.browser = split[1];
  if (this.os !== 'ios') {
    this.browser = this.browser.toLowerCase();
  }

  this.client = bs.createClient({
  });

  this._start = function(url) {
    var self = this;
    this.client.createWorker({
      os: this.os,
      browser: this.browser,
      device: this.browser,
      version: 'latest',
      url: url
    }, function(error, worker) {
      // super hack
      self._process = {
        kill: function() {
          self.client.terminateWorker(worker.id, function() {
            self._onProcessExit();
          });
        }
      };
    });
  };
};

BrowserStackBrowser.$inject = ['baseBrowserDecorator', 'name'];

module.exports = {
  'launcher:BrowserStack:Chrome:Win': ['type', BrowserStackBrowser],
  'launcher:BrowserStack:Chrome:Mac': ['type', BrowserStackBrowser],
  'launcher:BrowserStack:Firefox:Win': ['type', BrowserStackBrowser],
  'launcher:BrowserStack:Firefox:Mac': ['type', BrowserStackBrowser],
  'launcher:BrowserStack:IE:Win': ['type', BrowserStackBrowser],
  'launcher:BrowserStack:iPad 3rd (6.0):iOS': ['type', BrowserStackBrowser],
};
