var Reflux = require('reflux');
var ProjTempDetailActions = require('../action/ProjTempDetailActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjTempTableStore = Reflux.createStore({
	listenables: [ProjTempDetailActions],
	
	filter:{},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-task-member', operation, errMsg);
	},
	
	onRetrieveProjTemp: function(filter) {
        var self = this;
		var url = this.getServiceUrl('proj-task-member/user-task');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.filter = filter;

				self.fireEvent('user-task', '', self);
			}
			else{
				self.fireEvent('user-task', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('user-task', "调用服务错误", self);
		});
	},

	onRretrieveProjTempPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjTemp( filter );
	},
	
	onInitProjTemp: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('user-task', '', this);
				return;
			}
		}
		
		this.onRetrieveProjTemp(filter);
	},
	
	onCreateProjTemp: function(projTemp) {
		var url = this.getServiceUrl('proj-task-member/create');
		Utils.recordCreate(this, projTemp, url);
	},
	
	onUpdateProjTemp: function(projTemp) {
		var url = this.getServiceUrl('proj-task-member/update');
		Utils.recordUpdate(this, projTemp, url);
	},
	
	onDeleteProjTemp: function(uuid) {
		var url = this.getServiceUrl('proj-task-member/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjTempTableStore;

