var Reflux = require('reflux');

var ArticlesActions = Reflux.createActions([
    'createArticles',
    'updateArticles',
    'deleteArticles',
    'initArticles',
]);

module.exports = ArticlesActions;