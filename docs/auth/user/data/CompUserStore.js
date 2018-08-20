var Reflux = require('reflux');
var CompUserActions = require('../action/CompUserActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var CompUserStore = Reflux.createStore({
	listenables: [CompUserActions],

    deptUuid: '',
    filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
            deptUuid: self.deptUuid,
            filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('comp-user', operation, errMsg);
	},

    onRetrieveCompUser: function (filter) {
        var deptUuid = filter.deptUuid;
		/*if(deptUuid === '' || deptUuid === null || typeof(deptUuid)==="undefined"){
            this.deptUuid = '';
            this.filter = {};
			this.recordSet = [];
			this.startPage = 0;
			this.pageRow = 0;
			this.totalRow = 0;
			this.fireEvent('retrieve', '', this);
            return;
		}*/

		var self = this;
        var url = this.getServiceUrl('comp-user/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
                self.deptUuid = deptUuid;
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

    onRetrieveCompUserPage: function (filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
        this.onRetrieveCompUser(filter);
	},

    onInitCompUser: function (filter, startPage, pageRow) {
		if( this.recordSet.length > 0 ){
            if (Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.totalRow = 0;
        this.onRetrieveCompUserPage(filter, startPage, pageRow);
	},

	onCreateCompUser: function(compUser) {
		var url = this.getServiceUrl('comp-user/create');
		Utils.recordCreate(this, compUser, url);
	},

	onUpdateCompUser: function(compUser) {
		var url = this.getServiceUrl('comp-user/update');
		Utils.recordUpdate(this, compUser, url);
	},

	onDeleteCompUser: function(uuid) {
		var url = this.getServiceUrl('comp-user/remove');
		Utils.recordDelete(this, uuid, url);
	},


	fireEvent2: function(corpUser, errMsg, self)
	{
		self.trigger({
			corpUser: corpUser,
			operation: 'find',
			errMsg: errMsg
		});

		MsgActions.showError('comp-user', 'find', errMsg);
	},
	onGetCompUser: function(corpUuid, userName) {
		var self = this;
		var filter = {};
		filter.username = userName;
		var url = this.getServiceUrl('comp-user/get-by-username');
		Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				var errMsg = '';
				var corpUser = null;
				var userSet = result.object.list;
				var cc = userSet.length;
				for(var i=0; i<cc; i++){
					var user = userSet[i];
					if(user.corpUuid === corpUuid){
						corpUser = user;
						errMsg = '用户已经存在';
						break;
					}
				}

				self.fireEvent2(corpUser, errMsg, self);
			}
			else{
				self.fireEvent2(null, "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent2(null, "调用服务错误", self);
		});
    },
    
});

module.exports = CompUserStore;
