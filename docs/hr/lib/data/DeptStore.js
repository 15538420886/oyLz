var Reflux = require('reflux');
var DeptActions = require('../action/DeptActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var DeptStore = Reflux.createStore({
	listenables: [DeptActions],
	
	corpUuid: '',
	recordSet: [],
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr_dept', operation, errMsg);
	},
	
    onInitDeptGroup: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

        var self = this;
        var filter = {};
        filter.corpUuid = corpUuid;
        var url = this.getServiceUrl('hr_dept/select-dept-group');
        Utils.doRetrieveService(url, filter, 0, 0, 0).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.corpUuid = corpUuid;
                self.fireEvent('retrieve', '', self);
            }
            else {
                self.fireEvent('retrieve', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('retrieve', "调用服务错误", self);
        });
	},
	
});

module.exports = DeptStore;

