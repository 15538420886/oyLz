import React from 'react';
var $ = require('jquery');
var Utils = require('../../public/script/utils');

module.exports = function(){
	return {
		getInitialState : function() {
			return {
                __actionName: '',
                __upUrl: '',
				__xlsFields: [],
    			__xlsOptList: [],
                __xlsData: {},
                __xlsFile: null,
                __callback: null,
			}
		},

		downXlsTempFile: function(cols){
            var self = this;
            this.state.__actionName = 'down';
            this.state.__upUrl = '';
            this.state.__xlsFields = [];
            this.state.__xlsOptList = [];
            this.state.__xlsData = {};
            this.state.__xlsFile = null;
            this.state.__callback = null;

            cols.map((node, i) => {
                var opts = node.opts;
                if(opts === undefined){
                    var field = {};
                    Utils.copyValue(node, field);
                    self.state.__xlsFields.push(field);
                }
                else{
                    self._addXlsField(node, self);
                }
            });

            this._doDownTempFile();
        },
        downXlsTempFile2: function (cols, data, obj) {
            var self = this;
            this.state.__actionName = 'down2';
            this.state.__upUrl = '';
            this.state.__xlsFields = [];
            this.state.__xlsOptList = [];
            this.state.__xlsData = JSON.stringify(data);
            this.state.__xlsFile = null;
            this.state.__callback = obj;

            cols.map((node, i) => {
                var opts = node.opts;
                if (opts === undefined) {
                    var field = {};
                    Utils.copyValue(node, field);
                    self.state.__xlsFields.push(field);
                }
                else {
                    self._addXlsField(node, self);
                }
            });

            this._doDownTempFile();
        },
		uploadXlsFile: function(url, data, cols, file, callback){
            var self = this;
            this.state.__actionName = 'up';
            this.state.__upUrl = url;
            this.state.__xlsFields = [];
            this.state.__xlsOptList = [];
            this.state.__xlsData = data;
            this.state.__xlsFile = file;
            this.state.__callback = callback;

            cols.map((node, i) => {
                var opts = node.opts;
                if(opts === undefined){
                    var field = {};
                    Utils.copyValue(node, field);
                    self.state.__xlsFields.push(field);
                }
                else{
                    self._addXlsField(node, self);
                }
            });

            this._doUploadFile();
		},
        _addXlsField: function(node, self){
            var field = {};
            field.id = node.id;
            field.name = node.name;
            field.title = node.title;

            var opts = node.opts;
            if(opts.charAt(0) !== '#'){
                field.opts = opts;
                self.state.__xlsFields.push(field);
                return;
            }

            // 需要下载选择项
            opts = opts.substr(1);
            var pos = opts.indexOf('.');
            if(pos <= 0){
                self.state.__xlsFields.push(field);
                return;
            }

            var appName = opts.substr(0, pos);
            var optName = opts.substr(1+pos);
            var list = Utils.loadOptions(appName, optName, self._onGetOptions);
            if(list !== undefined){
                var names=[];
                list.codeData.map((node, i) => {
                    names.push(node.codeValue + '=' + node.codeDesc);
                });

                field.opts = names.join(',');
                self.state.__xlsFields.push(field);
                return;
            }

            self.state.__xlsFields.push(field);

            var f = {name: optName, field:field};
            self.state.__xlsOptList.push(f);
        },
        _onGetOptions: function (values, optName) {
            if(optName === undefined){
                return;
            }

            var names=[];
            if(this.state.__actionName === 'down'){
                values.codeData.map((node, i) => {
                    names.push(node.codeDesc);
                });
            }
            else if(this.state.__actionName === 'up'){
                values.codeData.map((node, i) => {
                    names.push(node.codeValue+'='+node.codeDesc);
                });
            }

            var flag = false;
            var optList = this.state.__xlsOptList;
            optList.map((node, i) => {
                if(node.name === optName && node.field !== null){
                    flag = true;
                    node.field.opts = names.join(',');
                    node.field = null;
                }
            });

            if (flag) {
                var act = this.state.__actionName;
                if (act === 'down' || act === 'down2'){
                    this._doDownTempFile();
                }
                else if (act === 'up'){
                    this._doUploadFile();
                }
            }
        },
        _doDownTempFile: function(){
            // 是否已经下载完
            var optList = this.state.__xlsOptList;
            var len = optList.length;
            for(var i=0; i<len; i++){
                if(optList[i].field !== null){
                    return;
                }
            }
            
            var param = JSON.stringify(this.state.__xlsFields);
            if ('down2' === this.state.__actionName) {
                this.state.__callback.downFile(param, this.state.__xlsData);
            }
            else {
                var url = Utils.paramUrl + 'xlsx-file/down-temp?param=' + encodeURI(param);

                // 补充企业用户信息
                if (window.loginData !== undefined) {
                    var compUser = window.loginData.compUser;
                    if (compUser !== null && compUser.corpUuid !== '' && compUser.corpUuid !== undefined) {
                        url = url + '&corp=' + compUser.corpUuid;
                    }
                }

                window.location.href = url;
            }
        },
        _doUploadFile: function(){
            // 是否已经下载完
            var optList = this.state.__xlsOptList;
            var len = optList.length;
            for(var i=0; i<len; i++){
                if (optList[i].field !== null) {
                    console.log('optList[i].field', optList[i].field);
                    return;
                }
            }

            // 提交请求
            var obj = {data: this.state.__xlsData, fields:this.state.__xlsFields};
    		var url = this.state.__upUrl
    		var fileList = [this.state.__xlsFile];

            var func = this.state.__callback;
            Utils.doUploadService(url, obj, fileList).then(function (result) {
                var errMsg = '';
                var resData = null;
    			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                    resData = result.object;
    			}
    			else{
    				errMsg = "导入数据错误["+result.errCode+"]["+result.errDesc+"]";
                }

                if (func !== undefined && func !== null) {
                    func(errMsg, resData);
                }
    		}, function(value){
                var errMsg = "上传文件错误";
                if (func !== undefined && func !== null) {
                    func(errMsg, null);
                }
    		});
        }
	};
};
