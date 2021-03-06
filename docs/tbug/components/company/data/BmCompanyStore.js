var Reflux = require('reflux');
var BmCompanyActions = require('../action/BmCompanyActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BmCompanyStore = Reflux.createStore({
    listenables: [BmCompanyActions],
    
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

        MsgActions.showError('bm-company', operation, errMsg);
    },
    
    onRetrieveBmCompany: function(filter) {
        var self = this;
        var url = this.getServiceUrl('bm-company/getCompanyList  ');
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
    
    onRetrieveBmCompanyPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveBmCompany( filter );
    },
    
    onInitBmCompany: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveBmCompany(filter);
    },
    
    onCreateBmCompany: function(bmCompany) {
        var url = this.getServiceUrl('bm-company/create');
        Utils.recordCreate(this, bmCompany, url);
    },
    
    onUpdateBmCompany: function(bmCompany) {
        var url = this.getServiceUrl('bm-company/update');
        Utils.recordUpdate(this, bmCompany, url);
    },
    
    onDeleteBmCompany: function(uuid) {
    	console.log(uuid)
        var url = this.getServiceUrl('bm-company/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = BmCompanyStore;