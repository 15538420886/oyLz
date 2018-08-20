var Reflux = require('reflux');
var HotelRoomActions = require('../action/HotelRoomActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var HotelRoomStore = Reflux.createStore({
    listenables: [HotelRoomActions],

    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.costUrl+action;
    },

    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('hotel-room', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },

    onRetrieveHotelRoom: function(hotelUuid) {
        var self = this;
        var url = this.getServiceUrl('hotel-room/get-by-hotelUuid');
        var filter= {};
        filter.hotelUuid = hotelUuid;
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

    onRetrieveHotelRoomPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveHotelRoom( filter );
    },

    onInitHotelRoom: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveHotelRoom(filter);
    },

    onCreateHotelRoom: function(hotelRoom) {
        var url = this.getServiceUrl('hotel-room/create');
        Utils.recordCreate(this, hotelRoom, url);
    },

    onUpdateHotelRoom: function(hotelRoom) {
        var url = this.getServiceUrl('hotel-room/update');
        Utils.recordUpdate(this, hotelRoom, url);
    },

    onDeleteHotelRoom: function(uuid) {
        var url = this.getServiceUrl('hotel-room/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = HotelRoomStore;
