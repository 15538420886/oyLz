var Reflux = require('reflux');
var BmSystemActions = require('../action/BmSystemActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BmSystemStore = Reflux.createStore({
    listenables: [BmSystemActions],
    
    filter: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    systemmdl:[],
   
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
            systemmdl:self.systemmdl,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('bm_system', operation, errMsg);
    },
    
    onRetrieveBmSystem: function(filter) {
        var self = this;
        var url = this.getServiceUrl('bm-system/getBmSystemList');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
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
    //系统-模块
    onBmSystemMdl: function(uuid) {
        var self = this;
        var filter = {}
        filter.sysId = uuid
        var url = this.getServiceUrl('bm-system-mdl/getBmSystemMdlList');
        Utils.doRetrieveService(url, filter,0,0,0).then(function(result) {
        	console.log(result)
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.systemmdl = result.object.list;  
                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },
    //添加系统-模块
    onAddBmSystemMdl:function(bmSystemMdl){
    	var url = this.getServiceUrl('bm-system-mdl/create');
        Utils.recordCreate(this, bmSystemMdl, url);
    },
    
    onRetrieveBmSystemPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveBmSystem( filter );
    },
    
    onInitBmSystem: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveBmSystem(filter);
    },
    
    onCreateBmSystem: function(bmSystem) {
        var url = this.getServiceUrl('bm-system/create');
        Utils.recordCreate(this, bmSystem, url);
    },
    
    onUpdateBmSystem: function(bmSystem) {
        var url = this.getServiceUrl('bm-system/update');
        Utils.recordUpdate(this, bmSystem, url);
    },
    
    onDeleteBmSystem: function(uuid) {
        var url = this.getServiceUrl('bm-system/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = BmSystemStore;