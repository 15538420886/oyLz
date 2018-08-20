var Reflux = require('reflux');

var OrderItemActions = Reflux.createActions([
    'createOrderItem',
    'deleteOrderItem',
    'updateOrderItem',
    'retrieveOrderItem',
    'retrieveOrderItemPage',
    'initOrderItem'
]);

module.exports = OrderItemActions;