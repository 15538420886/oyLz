var Reflux = require('reflux');
var PerformLogActions = require('../action/PerformLogActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var PerformLogStore = Reflux.createStore({
    listenables: [PerformLogActions],
    
    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.atsUrl+action;
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

        MsgActions.showError('perform-Log', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },
    
    onRetrieveRecruit: function(filter) {
        var self = this;
        var obj ={};
        obj.corpUuid = filter.corpUuid ;
        var url = this.getServiceUrl('recruit/retrieve');
        Utils.doRetrieveService(url, obj, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.filter = filter;
                if(result.object.list){
                    var len = result.object.list.length;
                    for(var i = 0; i < len; i++){
                        if(result.object.list[i].uuid == filter.uuid){
                             self.recordSet = result.object.list[i].perFormLog===null?[]:result.object.list[i].perFormLog;          
                        }
                    }
                };
                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },  

    onCreatePerformLog: function(performLog) {
        var url = this.getServiceUrl('perform-Log/create');
        Utils.recordCreate(this, performLog, url);
    },
    
    onUpdatePerformLog: function(filter) {
        var self = this;
        var url = this.getServiceUrl('perform-Log/update');
        Utils.doGetRecordService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet.map(function(item,i) {
                    if(result.object.uuid == item.uuid){
                       self.recordSet.splice(i,1,result.object);
                    }
                })
                self.fireEvent('update', '', self);
            }
            else{
                self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('update', "调用服务错误", self);
        });
    },
    
    onDeletePerformLog: function(object) {
        var self = this;
        var url = this.getServiceUrl('perform-Log/remove');
       
		Utils.doRemoveService(url, object).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet.map(function(item,i) {
                    if(result.object == item.uuid){
                       self.recordSet.splice(i,1);
                    }
                })
                self.fireEvent('remove', '', self);
			}
			else{
				self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('remove', "调用服务错误", self);
		});
	
    }
});

module.exports = PerformLogStore;