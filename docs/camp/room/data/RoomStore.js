var Reflux = require('reflux');
var RoomActions = require('../action/RoomActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var RoomStore = Reflux.createStore({
	listenables: [RoomActions],

	buildUuid: '',
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
			buildUuid: self.buildUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-room', operation, errMsg);
	},

	onRetrieveHrRoom: function(buildUuid) {
		var self = this;
		var filter = {};
		filter.buildUuid = buildUuid;
		var url = this.getServiceUrl('hr-room/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.buildUuid = buildUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitHrRoom: function(buildUuid) {
		if( this.recordSet.length > 0 ){
			if( this.buildUuid === buildUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrRoom(buildUuid);
	},

	onCreateHrRoom: function(room) {
		var url = this.getServiceUrl('hr-room/create');
		Utils.recordCreate(this, room, url);
	},

	onUpdateHrRoom: function(room) {
		var url = this.getServiceUrl('hr-room/update');
		Utils.recordUpdate(this, room, url);
	},

	onDeleteHrRoom: function(uuid) {
		var url = this.getServiceUrl('hr-room/remove');
		Utils.recordDelete(this, uuid, url);
	},
	
	onDeleteImage: function(uuid) {
		var url = this.getServiceUrl('hr-room/map-remove');
		
		var self = this;
		var idx = Utils.findRecord( this, uuid );
		Utils.doRemoveService(url, uuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(idx >= 0){
					self.recordSet[idx].image = '';
				}
				
				self.fireEvent('update-image', '', self);
			}
			else{
				self.fireEvent('update-image', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update-image', "调用服务错误", self);
		});
	}
});

module.exports = RoomStore;
