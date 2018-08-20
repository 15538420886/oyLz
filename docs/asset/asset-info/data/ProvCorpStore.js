var Reflux = require('reflux');
var ProvCorpActions = require('../action/ProvCorpActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ProvCorpStore = Reflux.createStore({
    listenables: [ProvCorpActions],

    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.assetUrl+action;
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

        MsgActions.showError('prov-corp', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },

    onRetrieveProvCorp: function(filter) {
        var self = this;
        var url = this.getServiceUrl('prov-corp/retrieve');
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

    onRetrieveProvCorpPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveProvCorp( filter );
    },

    onInitProvCorp: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveProvCorp(filter);
    },

    onCreateProvCorp: function(provCorp,provType) {
        var url = this.getServiceUrl('prov-corp/create');
        var self = this;
        Utils.doCreateService(url, provCorp).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if(result.object.provType === provType){
                    self.recordSet.push(result.object);
				            self.totalRow = self.totalRow + 1;
                }
				    self.fireEvent('create', '', self);
			      }
			      else{
				      self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			      }
        }, function (value) {
            self.fireEvent('create', Utils.getResErrMsg(value), self);
		    });
    },

    onUpdateProvCorp: function(provCorp,provType) {
        var url = this.getServiceUrl('prov-corp/update');
        this.recordUpdate(this, provCorp, url, provType);
    },
    recordUpdate: function(store, data, url, provType){
    	var self = store;
    	var idx = Utils.findRecord( store, data.uuid );

    	if(idx < 0){
    		self.fireEvent('update', '没有找到记录['+data.uuid+']', self);
    		return;
    	}

  		// 数据没有变更
  		if(Utils.compareTo(self.recordSet[idx], data)){
  			console.log('数据没有变更');
  			self.fireEvent('update', '', self);
  			return;
  		}

  		Utils.doUpdateService(url, data).then(function(result) {
              if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {

                  if(result.object.provType === provType){
                      Utils.copyValue(result.object, self.recordSet[idx]);
                  }else{
                      self.recordSet.splice(idx, 1);
  				    self.totalRow = self.totalRow - 1;
                  }
  				self.fireEvent('update', '', self);
  			}
  			else{
  				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
  			}
  		}, function(value){
              self.fireEvent('update', Utils.getResErrMsg(value), self);
  		});
	  },

    onDeleteProvCorp: function(uuid) {
        var url = this.getServiceUrl('prov-corp/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = ProvCorpStore;
