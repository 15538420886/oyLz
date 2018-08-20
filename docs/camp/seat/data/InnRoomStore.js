var Reflux = require('reflux');
var InnRoomActions = require('../action/InnRoomActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var InnRoomStore = Reflux.createStore({
	listenables: [InnRoomActions],

	seatUuid: '',
	recordSet: [],

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.campUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
    {
        var innRoom = (self.recordSet.length > 0) ? self.recordSet[0] : null;
		self.trigger({
			seatUuid: self.seatUuid,
			innRoom: innRoom,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('inn-room', operation, errMsg);
	},

    onRetrieveHrRoom: function (seatUuid, operation) {
		var opt = operation || 'retrieve';
		var self = this;
		var filter = {};
		filter.buildUuid = seatUuid;
        var url = this.getServiceUrl('hr-room/retrieve');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.seatUuid = seatUuid;

				self.fireEvent(opt, '', self);
			}
			else{
				self.fireEvent(opt, "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent(opt, "调用服务错误", self);
		});
	},

	onInitHrRoom: function(seatUuid, operation) {
        if (this.recordSet.length > 0) {
			if( this.seatUuid === seatUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrRoom(seatUuid, operation);
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

module.exports = InnRoomStore;
