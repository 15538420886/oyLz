var Reflux = require('reflux');
var LevelActions = require('../action/LevelActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var LevelStore = Reflux.createStore({
	listenables: [LevelActions],

	corpUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-level', operation, errMsg);
	},

	onRetrieveHrLevel: function(corpUuid) {

		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr-level/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
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

	onRetrieveHrLevelPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrLevel( corpUuid );
	},

	onInitHrLevel: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrLevel(corpUuid);
	},

	onCreateHrLevel: function(hrLevel) {
		var url = this.getServiceUrl('hr-level/create');
		Utils.recordCreate(this, hrLevel, url);
	},

	onUpdateHrLevel: function(hrLevel) {
		var url = this.getServiceUrl('hr-level/update');
		Utils.recordUpdate(this, hrLevel, url);
	},

	onDeleteHrLevel: function(uuid) {
		var url = this.getServiceUrl('hr-level/remove');
		Utils.recordDelete(this, uuid, url);
	},
	onGetLevelName: function(corpUuid, uuid) {
		if( this.recordSet.length > 0 && this.corpUuid === corpUuid ){
			Utils.findRecordName(uuid, this.recordSet, 'lvlCode', 'hr_level');
			return;
		}

		this.onRetrieveHrLevel(corpUuid);
	}
});

module.exports = LevelStore;
