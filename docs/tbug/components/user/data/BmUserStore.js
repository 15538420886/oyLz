var Reflux = require('reflux');
var BmUserActions = require('../action/BmUserActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BmUserStore = Reflux.createStore({
    listenables: [BmUserActions],
    
    filter: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.tbugUrl+action;
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

        MsgActions.showError('bmUser', operation, errMsg);
    },
    
    onRetrieveBmUser: function(filter) {
        var self = this;
        var url = this.getServiceUrl('bmUser/getBmuserList');
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
    
    onRetrieveBmUserPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveBmUser( filter );
    },
    
    onInitBmUser: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveBmUser(filter);
    },
    
    onCreateBmUser: function(bmUser) {
        var url = this.getServiceUrl('bmUser/create');
        Utils.recordCreate(this, bmUser, url);
    },
    
    onUpdateBmUser: function(bmUser) {
        var url = this.getServiceUrl('bmUser/update');
        Utils.recordUpdate(this, bmUser, url);
    },
    onUpdateBmUserKey:function(bmUser){
    	var url = this.getServiceUrl('bmUser/resetPassword');
    	Utils.doRetrieveService(url, bmUser, self.startPage, self.pageRow, self.totalRow).then(function(result) {
    		console.log(result)
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
    
    onDeleteBmUser: function(uuid) {
        var url = this.getServiceUrl('bmUser/remove');
        Utils.recordDelete(this, uuid, url);
//      Utils.doRetrieveService(url, filter.uuid, self.startPage, self.pageRow, self.totalRow).then(function(result) { 
//      	console.log(result)
//          if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
//          	self.recordSet = result.object.list;
//              self.startPage = result.object.startPage;
//              self.pageRow = result.object.pageRow;
//              self.totalRow = result.object.totalRow;
//              self.filter = filter;
//              self.fireEvent('retrieve', '', self);
//          }
//          else{
//              self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
//          }
//      }, function(value){
//          self.fireEvent('retrieve', "调用服务错误", self);
//      });
    }
});

module.exports = BmUserStore;