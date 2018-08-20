var Reflux = require('reflux');

var PoolActions = Reflux.createActions([
	'createResPool',
	'deleteResPool',
	'updateResPool',
	'retrieveResPool',
	'retrieveResPoolPage',
    'initResPool',
    {
        getPoolName: {
            sync: true
        }
    }
]);

module.exports = PoolActions;