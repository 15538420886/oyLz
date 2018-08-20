var Reflux = require('reflux');
var DictActions = require('../action/DictActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var DictStore = Reflux.createStore({
	listenables: [DictActions],

	codeUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			codeUuid: self.codeUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('SysCodeData', operation, errMsg);
	},

	onRetrieveSysCodeData: function(codeUuid) {
		var self = this;

		if(codeUuid === null || codeUuid === ''){
			self.codeUuid = '';
			self.recordSet = [];
			self.startPage = 0;
			self.pageRow = 0;
			self.totalRow = 0;
			self.fireEvent('retrieve', '', self);
			return;
		}

		var filter = {};
		
		filter.codeUuid = codeUuid; 
		var url = this.getServiceUrl('SysCodeData/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.codeUuid = codeUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitSysCodeData: function(codeUuid) {
		if( this.recordSet.length > 0 ){
			if( this.codeUuid === codeUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveSysCodeData(codeUuid);
	},

	onCreateSysCodeData: function(dict) {
		var url = this.getServiceUrl('SysCodeData/create');
		Utils.recordCreate(this, dict, url);
	},

	onUpdateSysCodeData: function(dict) {
		
		var url = this.getServiceUrl('SysCodeData/update');
		Utils.recordUpdate(this, dict, url);
	},

	onDeleteSysCodeData: function(uuid) {
		var url = this.getServiceUrl('SysCodeData/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = DictStore;
