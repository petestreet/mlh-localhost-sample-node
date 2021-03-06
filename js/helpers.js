module.exports = {
  btoa: function(str) {
    // Since btoa() isn't automatically included in Node, recreate it here.
    // Source: https://github.com/node-browser-compat/btoa/blob/master/index.js

    var buffer;

    if (str instanceof Buffer) {
      buffer = str;
    } else {
      buffer = new Buffer(str.toString(), 'binary');
    }

    return buffer.toString('base64');
  }
};


