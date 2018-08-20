var Reflux = require('reflux');
var HotelActions = require('../action/HotelActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var HotelStore = Reflux.createStore({
    listenables: [HotelActions],

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

        MsgActions.showError('hotel', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },

    onRetrieveHotel: function(corpUuid) {
        var self = this;
        var url = this.getServiceUrl('hotel/retrieve');
        var filter= {};
        filter.corpUuid = corpUuid;
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

    onRetrieveHotelPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveHotel( filter );
    },

    onInitHotel: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveHotel(filter);
    },

    onCreateHotel: function(hotel) {
        var url = this.getServiceUrl('hotel/create');
        Utils.recordCreate(this, hotel, url);
    },

    onUpdateHotel: function(hotel) {
        var url = this.getServiceUrl('hotel/update');
        Utils.recordUpdate(this, hotel, url);
    },

    onDeleteHotel: function(uuid) {
        var url = this.getServiceUrl('hotel/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = HotelStore;
