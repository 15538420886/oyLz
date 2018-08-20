var Reflux = require('reflux');
var TreeResTeamActions = require('../action/TreeResTeamActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var TreeResTeamStore = Reflux.createStore({
	listenables: [TreeResTeamActions],

	corpUuid: '',
	poolSet: [],
	teamSet: [],

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
			poolSet: self.poolSet,
			teamSet: self.teamSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('res-team', operation, errMsg);
	},

    onRetrieveResTeam: function (corpUuid) {
        var self = this;
        var filter = { corpUuid: corpUuid };
        var url = this.getServiceUrl('res-pool/get-by-corp_uuid');
        Utils.doRetrieveService(url, filter, 0, 0, 0).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.poolSet = result.object.list;
                self.onRetrieveResTeam2(corpUuid);
            }
            else {
                self.fireEvent('retrieve', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },

    onRetrieveResTeam2: function (corpUuid) {
        var self = this;
        var filter = { corpUuid: corpUuid };
		var url = this.getServiceUrl('res-team/get-by-pool_uuid');
		Utils.doRetrieveService(url, filter, 0, 0, 0).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.teamSet = result.object.list;
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

    onInitResTeam: function (corpUuid) {
        if (this.teamSet.length > 0 ){
            if (this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

        this.onRetrieveResTeam(corpUuid);
	},

});

module.exports = TreeResTeamStore;
