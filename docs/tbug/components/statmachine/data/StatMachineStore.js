var Reflux = require('reflux');
var StatMachineActions = require('../action/StatMachineActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StatMachineStore = Reflux.createStore({
	listenables: [StatMachineActions],
	
	InStatMachine: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.tbugUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			InStatMachine: self.InStatMachine,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('stat-machine', operation, errMsg);
	},
	
	onRetrieveStatMachine: function(InStatMachine) {
		var self = this;
		var filter = {};
		filter.InStatMachine = InStatMachine;
		var url = this.getServiceUrl('stat-machine/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.InStatMachine = InStatMachine;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveStatMachinePage: function(InStatMachine, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveStatMachine( InStatMachine );
	},
	
	onInitStatMachine: function(InStatMachine) {
		if( this.recordSet.length > 0 ){
			if( this.InStatMachine === InStatMachine ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveStatMachine(InStatMachine);
	},
	
	onCreateStatMachine: function(statMachine) {
		var regUser=window.loginData.authUser.userId;
		var cmpId=window.loginData.compUser.corpUuid;
		statMachine.regUser = regUser;
		statMachine.cmpId = cmpId;
		var url = this.getServiceUrl('stat-machine/create');
		Utils.recordCreate(this, statMachine, url);
	},
	
	onUpdateStatMachine: function(statMachine) {
		var url = this.getServiceUrl('stat-machine/update');
		Utils.recordUpdate(this, statMachine, url);
	},
	
	onDeleteStatMachine: function(uuid) {
		var url = this.getServiceUrl('stat-machine/remove');
		Utils.recordDelete(this, uuid, url);
	}

});

module.exports = StatMachineStore;

