var Reflux = require('reflux');
var WifiActions = require('../action/WifiActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var WifiStore = Reflux.createStore({
	listenables: [WifiActions],

	roomUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.campUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			roomUuid: self.roomUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-wifi', operation, errMsg);
	},

	onRetrieveHrWifi: function(roomUuid) {
		var self = this;
		var filter = {};
		filter.roomUuid = roomUuid;
		// console.log(filter)
		var url = this.getServiceUrl('hr-wifi/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.roomUuid = roomUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveHrWifiPage: function(roomUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrWifi( roomUuid );
	},

	onInitHrWifi: function(roomUuid) {
		if( this.recordSet.length > 0 ){
			if( this.roomUuid === roomUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrWifi(roomUuid);
	},

	onCreateHrWifi: function(wifi) {
		var url = this.getServiceUrl('hr-wifi/create');
		Utils.recordCreate(this, wifi, url);
	},

	onUpdateHrWifi: function(wifi) {
		var url = this.getServiceUrl('hr-wifi/update');
		Utils.recordUpdate(this, wifi, url);
	},

	onDeleteHrWifi: function(uuid) {
		var url = this.getServiceUrl('hr-wifi/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = WifiStore;
