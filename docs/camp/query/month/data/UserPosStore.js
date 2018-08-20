var Reflux = require('reflux');
var UserPosActions = require('../action/UserPosActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var UserPosStore = Reflux.createStore({
	listenables: [UserPosActions],

    month: '',
	recordSet: [],

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.campUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
            month: self.month,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('month-pos', operation, errMsg);
	},

    onRetrieveMonthPos: function (month) {
		var self = this;
		var filter = {};
        filter.month = month;
        var url = this.getServiceUrl('user-pos/retrieve-month');
        Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object ? result.object : [];
                self.month = month;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

    onInitMonthPos: function (month) {
		if( this.recordSet.length > 0 ){
            if (this.month === month ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

        this.onRetrieveMonthPos(month);
	},
});

module.exports = UserPosStore;
