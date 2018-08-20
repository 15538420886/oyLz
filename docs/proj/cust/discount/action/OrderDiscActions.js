var Reflux = require('reflux');

var OrderDiscActions = Reflux.createActions([
	'createOrderDisc',
	'deleteOrderDisc',
	'updateOrderDisc',
	'retrieveOrderDisc',
	'retrieveOrderDiscPage',
	'initOrderDisc'
]);

module.exports = OrderDiscActions;
