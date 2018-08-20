var Reflux = require('reflux');
var ProjTempActions = require('../action/ProjTempActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjTempStore = Reflux.createStore({
	listenables: [ProjTempActions],
	filter:{},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	projTemp:{},
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter:self.filter,
			projTemp:self.projTemp,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj_temp_member', operation, errMsg);
	},

	onRetrieveProjTemp: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj_temp_member/user-temp-proj');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;

				self.fireEvent('user-temp-proj', '', self);
				
				if(result.object){
					self.projTemp = result.object.list[0];
					self.filter = filter;
					self.fireEvent('user-proj', '', self);
				}
				else{
					self.fireEvent('user-proj', "没有找到记录["+result.object+"]", self);
				}

			}
			else{
				self.fireEvent('user-temp-proj', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('user-temp-proj', "调用服务错误", self);
		});
	},

	onInitProjTemp: function(filter) {
        if (this.recordSet.length > 0) {
            if (Utils.compareTo(this.filter, filter) ){
				this.fireEvent('user-temp-proj', '', this);
				return;
			}
		}
		this.onRetrieveProjTemp(filter);
	},

	onCreateProjTemp: function(projTemp) {
		var url = this.getServiceUrl('proj_temp_member/create');
		Utils.recordCreate(this, projTemp, url);
	},

	onUpdateProjTemp: function(projTemp) {
		var url = this.getServiceUrl('proj_temp_member/update');
		Utils.recordUpdate(this, projTemp, url);
	},

	onDeleteProjTemp: function(uuid) {
		var url = this.getServiceUrl('proj_temp_member/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjTempStore;
