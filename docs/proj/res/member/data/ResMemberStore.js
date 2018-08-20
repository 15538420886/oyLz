var Reflux = require('reflux');
var ResMemberActions = require('../action/ResMemberActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ResMemberStore = Reflux.createStore({
	listenables: [ResMemberActions],

	filter: {},
	userUuid:'',
	recordSet: [],
	empJob: {},
	startPage : 0,
	pageRow : 10,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	getServiceUrl2: function(action)
	{
		return Utils.hrUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			empJob: self.empJob,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('res-member', operation, errMsg);
	},

	onClearResMember: function(){
		var self = this;
		self.recordSet = [];
		self.startPage = 1;
		self.pageRow = 10;
		self.totalRow = 10;
		self.filter = '';

		self.fireEvent('', '', self);
	},

	onRetrieveEmpJob: function(userUuid){
		if(userUuid === undefined || userUuid === '' || userUuid === this.userUuid){
			this.fireEvent('retrieveEmpJob', '', this);
			return;
		}
		var self = this;
		var filter = {};
		filter.userUuid = userUuid;
		var url = this.getServiceUrl2('hr_emp_job/get-by-user_uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.list.length === 1){
					self.empJob = result.object.list[0];
					
				}
				self.userUuid = userUuid;
				self.fireEvent('retrieveEmpJob', '', self);
				
			}
			else{
				self.fireEvent('retrieveEmpJob', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieveEmpJob', "调用服务错误", self);
		});
	},

	onRetrieveResMember: function(filter) {
		var self = this;
		var url = this.getServiceUrl('res-member/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveResMemberPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveResMember( filter );
	},

	onInitResMember: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveResMember(filter);
	},

	onCreateResMember: function(resMember) {
		var url = this.getServiceUrl('res-member/create');
		Utils.recordCreate(this, resMember, url);
	},

	onBatchCreateResMember: function(resMember) {
		var url = this.getServiceUrl('res-member/batchCreate');
		Utils.recordCreate(this, resMember, url);
	},

	onUpdateResMember: function(resMember) {
		var url = this.getServiceUrl('res-member/update');
		Utils.recordUpdate(this, resMember, url);
    },
    updateResMember2: function (resMember) {
        var url = this.getServiceUrl('res-member/update2');
        Utils.recordUpdate(this, resMember, url);
    },

	onDeleteResMember: function(uuid) {
		var url = this.getServiceUrl('res-member/remove1');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ResMemberStore;
