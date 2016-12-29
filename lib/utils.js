var glob = require('glob');
var path = require('path');

exports.getEntry = function(pattern) {
  var entry = {};
  
  glob.sync(pattern).forEach(function(file) {
    var fileName = path.parse(file).name;
    entry[fileName] = file;
  })
  return entry;
}

exports.fullPath = function(dir) {
  return path.resolve(__dirname, dir);
}