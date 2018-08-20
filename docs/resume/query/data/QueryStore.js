var Reflux = require('reflux');
var QueryActions = require('../action/QueryActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');
var Query=require('../../resume/data/ResumeStore');
var QueryStore = Reflux.createStore({
	listenables: [QueryActions],
	
	personUuid: '',
	recordSet: [],
	employee:[],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	filter: '',
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.resumeUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			personUuid: self.personUuid,
			recordSet: self.recordSet,
			employee: self.employee,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('resPerson', operation, errMsg);
	},

	onRetrieveHrEmployee: function(filter) {
		//判断filter是否相同
		var self = this;
		var url = Utils.hrUrl +'hr-employee/retrieve';
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.employee = result.object.list;
				self.filter = filter;
				self.fireEvent('retrieveEmployee', '', self);
			}
			else{
				self.fireEvent('retrieveEmployee', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieveEmployee', "调用服务错误", self);
		});
	},
	
	onRetrieveResPerson: function(personUuid) {
		var self = this;
		var filter = {};

		filter.personUuid = personUuid;
		var url = this.getServiceUrl('resPerson/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.personUuid = personUuid;
				
				self.fireEvent('retrieve', '', self);
				
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveResPersonPage: function(personUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveResPerson( personUuid );
	},
	
	onInitResPerson: function(personUuid) {
		if( this.recordSet.length > 0 ){
			if( this.personUuid === personUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveResPerson(personUuid);
	},
	
	onCreateResPerson: function(person) {
		var url = this.getServiceUrl('resPerson/create');
		Utils.recordCreate(this, person, url);
	},
	
	onUpdateResPerson: function(person) {
		var url = this.getServiceUrl('resPerson/update-resume');
		Utils.recordUpdate(this, person, url);
	},
	
	onDeleteResPerson: function(uuid) {
		var url = this.getServiceUrl('resPerson/del-resume');
		Query.recordDeleteById(this, uuid, url);
	}
});

module.exports = QueryStore;
