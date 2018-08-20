var Reflux = require('reflux');
var ArticlesActions = require('../action/ArticlesActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ArticlesStore = Reflux.createStore({
    listenables: [ArticlesActions],
    
    filter: '',
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

        MsgActions.showError('articles', operation, errMsg);
    },

    onInitArticles: function(recordSet) {
        if(recordSet != null && recordSet.length > 0 ){
            this.recordSet = recordSet;
        }else{
            this.recordSet = [];
        }
        this.fireEvent('retrieve', '', this);
    },
    
    onCreateArticles: function(object) {
        var url = this.getServiceUrl('articles/create');
        Utils.recordCreate(this, object, url);
        
    },
    
    onUpdateArticles: function(object) {
        var url = this.getServiceUrl('articles/update');
        Utils.recordUpdate(this, object, url);
    },

    onDeleteArticles: function(object) {
        var url = this.getServiceUrl('articles/delete');
        var self = this;
		var idx = -1;
        var inventCode = object.object;
        for(var x=self.recordSet.length-1; x>=0; x--){
			if(self.recordSet[x].inventCode === inventCode){
				idx = x;
                break;
			}
		}

		if(idx < 0){
			self.fireEvent('remove', '没有找到记录['+inventCode+']', self);
			return;
		}

		Utils.doRemoveService(url, object).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.splice(idx, 1);
				self.totalRow = self.totalRow - 1;
				self.fireEvent('remove', '', self);
			}
			else{
				self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('remove', Utils.getResErrMsg(value), self);
		});
    }

});

module.exports = ArticlesStore;