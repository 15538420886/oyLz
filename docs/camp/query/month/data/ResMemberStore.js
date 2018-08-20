var Reflux = require('reflux');
var ResMemberActions = require('../action/ResMemberActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ResMemberStore = Reflux.createStore({
	listenables: [ResMemberActions],

	corpUuid:'',
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
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('res-member', operation, errMsg);
	},

    onRetrieveAllMember: function (corpUuid) {
        var self = this;
        var filter = { corpUuid: corpUuid};
		var url = this.getServiceUrl('res-member/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
                self.corpUuid = corpUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
    
    onInitAllMember: function (corpUuid) {
		if( this.recordSet.length > 0 ){
            if (this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

        this.onRetrieveAllMember(corpUuid);
	},
});

module.exports = ResMemberStore;
