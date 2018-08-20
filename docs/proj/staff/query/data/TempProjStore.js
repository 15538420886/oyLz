var Reflux = require('reflux');
var TempProjActions = require('../action/TempProjActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TempProjStore = Reflux.createStore({
    listenables: [TempProjActions],
    corpUuid: '',
    staffCode: '',
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
            corpUuid: self.corpUuid,
            staffCode: self.staffCode,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('temp-member', operation, errMsg);
	},
	
    onRetrieveTempProj: function (corpUuid, staffCode) {
        var self = this;
        if (staffCode === null || staffCode === '' || staffCode === undefined) {
            self.recordSet = [];
            self.corpUuid = corpUuid;
            self.staffCode = '';

            self.fireEvent('retrieve', '', self);
            return;
        }

        var filter = {};
        filter.corpUuid = corpUuid;
        filter.staffCode = staffCode;
        var url = this.getServiceUrl('proj_temp_member/findStaffLog');
        Utils.doRetrieveService(url, filter, 0, 0, 0).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.corpUuid = corpUuid;
                self.staffCode = staffCode;

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

module.exports = TempProjStore;

