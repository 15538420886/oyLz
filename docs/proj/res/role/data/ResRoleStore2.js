var Reflux = require('reflux');
var ResRoleActions = require('../action/ResRoleActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ResRoleStore2 = Reflux.createStore({
	listenables: [ResRoleActions],
	
	recordSet: [],
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('res-role', operation, errMsg);
	},
	
    onRetrieveResPoolStaff: function(poolUuid) {
		var self = this;
		var filter = {};
		filter.poolUuid = poolUuid;
        var url = this.getServiceUrl('res-role/pool-staff');
		Utils.doRetrieveService(url, filter, 0, 0, 0).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
    },
    onRetrieveResTeamStaff: function (teamUuid) {
        var self = this;
        var filter = {};
        filter.teamUuid = teamUuid;
        var url = this.getServiceUrl('res-role/pool-staff');
        Utils.doRetrieveService(url, filter, 0, 0, 0).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
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

module.exports = ResRoleStore2;

