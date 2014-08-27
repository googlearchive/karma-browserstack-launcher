/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var bs = require('browserstack');
var fs = require('fs');
var path = require('path');

var CONFIG_FILE = path.join(process.env.HOME, ".browserstack.json");
var config = (function() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
})();

var BrowserStackBrowser = function(baseBrowserDecorator, name) {
  baseBrowserDecorator(this);

  this.name = name;
  
  var split = this.name.split(':');
  this.os = split[2].toLowerCase();
  this.browser = split[1];
  if (this.os !== 'ios') {
    this.browser = this.browser.toLowerCase();
  }

  this.client = bs.createClient(config);

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
