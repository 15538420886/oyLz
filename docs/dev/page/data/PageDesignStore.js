var Reflux = require('reflux');
var PageDesignActions = require('../action/PageDesignActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var PageDesignStore = Reflux.createStore({
	listenables: [PageDesignActions],

	pageUuid: '',
    pageInfo: {},
    updateObject: {},
    pageText: '',

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.devUrl+action;
	},	
	findRecord: function(resName)
	{
		for(var x=this.pageInfo.resList.length-1; x>=0; x--){
			if(this.pageInfo.resList[x].resName === resName){
				return x;
			}
		}

		return -1;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			pageUuid: self.pageUuid,
            pageInfo: self.pageInfo,
            updateObject: self.updateObject,
            pageText: self.pageText,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('page-design', operation, errMsg);
	},

	onGetPageInfo: function(pageUuid){
		// /page-design/get-by-uuid
		var self = this;
		var url = this.getServiceUrl('page-design/get-by-uuid');
		Utils.doGetRecordService(url, pageUuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.pageInfo = result.object;
                self.pageUuid = pageUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onAddResource: function(res){
		// /resList/create
		// 内容增加到 pageInfo.resList[].push
		var self = this;
		var url = this.getServiceUrl('resList/create');
 		var obj = {filter: self.pageUuid, object: res};
		Utils.doCreateService(url, obj).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (self.pageInfo.resList === null || self.pageInfo.resList === undefined) {
                    self.pageInfo.resList = [];
                }

				self.pageInfo.resList.push(result.object);
				self.fireEvent('createResource', '', self);
			}
			else{
				self.fireEvent('createResource', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
        }, function (value) {
            self.fireEvent('createResource', '调用服务错误' , self);
		});
	},

	onUpdateResource: function(resName, pageInfo){
		// /pageInfo/update	
		// 内容替换 pageInfo.resList[resName].pageInfo
		var self = this;
		var url = this.getServiceUrl('pageInfo/update');
		var obj = {};
		obj = {
			filter:self.pageUuid,
			filter2:resName,
			object:{pageInfo:pageInfo},
		}
		var idx = this.findRecord( resName );
		if(idx < 0){
			self.fireEvent('updateResource', '没有找到记录['+resName+']', self);
			return;
		}
		Utils.doUpdateService(url, obj).then(function(result) {console.log(result)
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var res = self.pageInfo.resList[idx];
                if (res.pageInfo === undefined || res.pageInfo === null) {
                    res.pageInfo = {};
                }

                Utils.copyValue(result.object, res.pageInfo);
                self.updateObject = res.pageInfo;
				self.fireEvent('updateResource', '', self);
			}
			else{
				self.fireEvent('updateResource', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('updateResource', '调用服务错误', self);
		});
	},
	
	onUpdateFields: function(resName, fields){
		// /fields/update
		// 内容替换 pageInfo.resList[resName].fields
		var self = this;
		var url = this.getServiceUrl('fields/update');
		var obj = {};
		obj = {
			filter:self.pageUuid,
			filter2:resName,
            object: {fields},
		}
		var idx = this.findRecord( resName );
		if(idx < 0){
			self.fireEvent('updateFields', '没有找到记录['+resName+']', self);
			return;
		}

		Utils.doUpdateService(url, obj).then(function(result) {
			console.log('result',result);
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.pageInfo.resList[idx].fields = [];
				result.object.map((data, i) =>{
					self.pageInfo.resList[idx].fields.push({});
                    Utils.copyValue(data, self.pageInfo.resList[idx].fields[i]);
                })

                self.updateObject = self.pageInfo.resList[idx];
				self.fireEvent('updateFields', '', self);
			}
			else{
				self.fireEvent('updateFields', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('updateFields', '调用服务错误', self);
		});
	},
	
	onCreatePage: function(resName, page){
		// /pages/create1
		// 内容增加到 pageInfo.resList[resName].pages[].push
		var self = this;
        var url = this.getServiceUrl('pages/create1');

        var obj = {
            filter: self.pageUuid,
            filter2: resName,
            object: { pages:page },
        }

		var idx = this.findRecord( resName );
		if(idx < 0){
			self.fireEvent('createPage', '没有找到记录['+resName+']', self);
			return;
		}

		Utils.doCreateService(url, obj).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var res = self.pageInfo.resList[idx];
                if (res.pages === null || res.pages === undefined) {
                    res.pages = [];
                }

				res.pages.push(result.object);
				self.fireEvent('createPage', '', self);
			}
			else{
				self.fireEvent('createPage', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('createPage', '调用服务错误', self);
		});
	},
	
	onUpdatePage: function(resName, page){
		// /pages/update
		// 内容替换 pageInfo.resList[resName].pages[page.pageID]
		var self = this;
        var url = this.getServiceUrl('pages/update');

        var obj = {
            filter: self.pageUuid,
            filter2: resName,
            filter3: page.pageID,
            object: { pages:page },
        }

		var idx = this.findRecord( resName );
		if(idx < 0){
			self.fireEvent('updatePage', '没有找到记录['+resName+']', self);
			return;
        }

        var idx2 = -1;
        var pages = this.pageInfo.resList[idx].pages;
        if (pages !== null && pages !== undefined) {
            for (var x = pages.length - 1; x >= 0; x--) {
                if (pages[x].pageID === page.pageID) {
                    idx2 = x;
                }
            }
        }

		if(idx2 < 0){
			self.fireEvent('updatePage', '没有找到记录['+page.pageName+']', self);
			return;
		}

		Utils.doUpdateService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                Utils.copyValue(result.object, self.pageInfo.resList[idx].pages[idx2]);
                self.updateObject = self.pageInfo.resList[idx].pages[idx2];
				self.fireEvent('updatePage', '', self);
			}
			else{
				self.fireEvent('updatePage', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('updatePage', '调用服务错误', self);
		});
    },

    onNewPage: function (obj) {
        var self = this;
        var url = this.getServiceUrl('pages/new-page');
        Utils.doUpdateService(url, obj).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.pageText = result.object;
                self.fireEvent('newPage', '', self);
            }
            else {
                self.fireEvent('newPage', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('newPage', '调用服务错误', self);
        });
    }
});

module.exports = PageDesignStore;