var path = require('path');

module.exports = {
    extensions: ['', '.js', '.json'],
    alias: {
      'bootstrap-css': path.join(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css'),
      'antd-css': path.join(__dirname,'node_modules/antd/dist/antd.css')
    }
};
