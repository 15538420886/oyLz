var $ = require('jquery');
var Promise = require('promise');
var FindNameActions = require('../../lib/action/FindNameActions');

module.exports = {
	initConf: function(conf){
		for(var name in conf){
			try{this[name] = conf[name];}catch(E){}
		}
		console.log(this);
	},

	// 调用服务的序号
	actionFlowNo: 1,

    // LzSelect 选择项
    lzOptions: {},
    lzOptionsWait: {},
    loadOptions: function(appName2, optName, callback){
        var opt = this.lzOptions[appName2];
        if( opt === null || typeof(opt) === 'undefined' ){
			var lst = this.lzOptionsWait[appName2];
			if( lst !== null && typeof(lst) !== 'undefined' ){
				lst.push( {name: optName, func: callback} );
				return;
			}

			lst = [{name: optName, func: callback}];
			this.lzOptionsWait[appName2] = lst;

			var self = this;
            var fileName = '';
            if(this.localDict){
            	fileName = '/dict/' + appName2 + '.js';
            }
            else {
                fileName = this.paramUrl + 'app-info/dict?appName=' + encodeURI(appName2);
            }

			$.getScript(fileName, function(){
                var itemMap = {};
                if (dict !== null) {
                    dict.map((node, i) => {
                        itemMap[node.indexName] = node;
                    });
                }

				// console.log(itemMap);
				self.lzOptions[appName] = itemMap;

				lst = self.lzOptionsWait[appName2];
				lst.map((nd, i) => {
					var values = itemMap[nd.name];
					if(nd.func !== null){
                        nd.func((values === null || typeof (values) === 'undefined') ? [] : values, nd.name );
					}
				});

				self.lzOptionsWait[appName2] = null;
			});
        }
		else{
			var values = opt[optName];
			if(callback !== null){
				callback( (values === null || typeof(values) === 'undefined') ? [] : values );
			}
			
			return values;
		}
    },
    getOptionName: function(appName2, optName, value, showCode, page){
		var opt = this.lzOptions[appName2];
        if( opt === null || typeof(opt) === 'undefined' ){
			var callback = null;
			var lst = this.lzOptionsWait[appName2];
			if( lst === null || typeof(lst) === 'undefined' ){
				callback = function(){ page.setState({loading: page.state.loading}) };
			}

			this.loadOptions(appName2, optName, callback);
			return value;
		}

		var opts = opt[optName];
		if(opts !== null && typeof(opts) !== 'undefined'){
			var cc = opts.codeData.length;
			for(var i=0; i<cc; i++){
				var node = opts.codeData[i];
				if(node.codeValue === value){
					return ((showCode && value !== node.codeDesc) ? value+'-'+node.codeDesc : node.codeDesc);
				}
			}
		}

		return value;
    },
    getOptionName2: function (opts, value, showCode) {
        var text = '';
        var optsObj = {};
        var opts = opts.split(';');
        opts.map((opt, i) => {
            var pos = opt.indexOf('=');
            if (pos > 0) {
                var value = opt.substr(0, pos);
                var desc = opt.substr(1 + pos);
                if (showCode && value !== desc) {
                    text = value + '-' + desc;
                }
                else {
                    text = value;
                }
            }
            else {
                text = value;
            }
        });

        return text;
    },
	findRecordName: function(uuid, recordSet, fieldName, resName){
		var len = recordSet.length;
		for(var i=0; i<len; i++){
			var obj = recordSet[i];
			if(obj.uuid === uuid){
				FindNameActions.findName(resName, uuid, obj[fieldName]);
				return;
			}
		}

		FindNameActions.findName(resName, uuid, uuid);
	},

	sessionID: '',
	saveSessionID: function(result, self){
		// console.log(result);
		if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
			self.sessionID = result.object.sessionId;
			window.sessionStorage.setItem('sessionID', self.sessionID);
		}
	},
	getSessionID: function(){
		if(this.sessionID === ''){
			this.sessionID = window.sessionStorage.getItem('sessionID');
		}

		return this.sessionID;
	},
	fz_setCookie: function(name, value, daysExpire)
	{
		var e='';
		if(daysExpire){
			var expires = new Date();
			expires.setTime(expires.getTime() + 1000*60*60*24*daysExpire);
			e = ";expires=" + expires.toGMTString();
		}

		document.cookie=name+"="+((value==null) ? '' : escape(value))+e+";path=/";
    },
    fmtGetUrl: function (url) {
        var idx = url.indexOf('corp')
        if (idx >= 0) {
            return url;
        }

        if (window.loginData === undefined) {
            return url;
        }

        var compUser = window.loginData.compUser;
        if (compUser === null || compUser.corpUuid === '' || compUser.corpUuid === undefined) {
            return url;
        }

        idx = url.indexOf('?');
        if (idx >= 0) {
            url = url + '&corp=' + compUser.corpUuid;
        }
        else {
            url = url + '?corp=' + compUser.corpUuid;
        }

        return url;
    },
	ajaxBody: function(url, data, self){
		/*var sid = this.getSessionID();
		if( sid !== null ){
			this.fz_setCookie('SESSION', sid, 1);
		}*/

		data.term='web';
		if(typeof(window.loginData) !== 'undefined'){
			var compUser = window.loginData.compUser;
	        data.corp = (compUser === null) ? '' : compUser.corpUuid;
	    }
	    else{
	    	data.corp = '';
	    }

		return {
			type:'post',
			url:url,
			contentType: 'application/json; charset=UTF-8',
			data:JSON.stringify(data),
			dataType:'json',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true
		};
	},
	loginService: function(url, data) {
		var self = this;
        var promise = new Promise(function (resolve, reject) {
        	var record = {
				flowNo:'0',
				term: 'web',
				object:data
			};

        	$.ajax({
				type:'post',
				url:url,
				contentType: 'application/json; charset=UTF-8',
				data:JSON.stringify(record),
				dataType:'json',
				success: function(result,status,xhr){
					self.saveSessionID(result, self);
				},
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true
			}).done(resolve).fail(reject);
        });

        return promise;
    },
    doDeployService: function (url, data) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                type: 'post',
                url: url,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain:  true
            }).done(resolve).fail(reject);
        });

        return promise;
    },


    fetch: function(url) {
        var promise = new Promise(function (resolve, reject) {
            $.get(url).done(resolve).fail(reject);
        });

        return promise;
    },

    doJsonService: function (url, data) {
		var req = this.ajaxBody(url, data);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doGetService: function (url) {
        url = this.fmtGetUrl(url);
        var promise = new Promise(function (resolve, reject) {
            $.get(url).done(resolve).fail(reject);
        });

        return promise;
    },

    doRetrieveService: function(url, filter, startPage, pageRow, totalRow) {
		var query = {
			pageRow:pageRow,
			startPage:startPage,
			totalRow:totalRow,
			object:filter
		};

		var filter2 = {
			flowNo:'0',
			object:query
		};

		var req = this.ajaxBody(url, filter2);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },
    //text
     doTextService: function(url, filter, startPage, pageRow, totalRow) {
		var query = {
			pageRow:pageRow,
			startPage:startPage,
			totalRow:totalRow,
			object:filter
		};

		var filter2 = {
			flowNo:'111111',
			object:'1'
		};

		var req = this.ajaxBody(url, filter2);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doGetRecordService: function(url, uuid) {
		var record = {
			flowNo:'0',
			object:uuid
		};

		var req = this.ajaxBody(url, record);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doCreateService: function(url, data) {
		var record = {
			flowNo:'0',
			object:data
		};

		var req = this.ajaxBody(url, record);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doUpdateService: function(url, data) {
		var record = {
			flowNo:'0',
			object:data
		};

		var req = this.ajaxBody(url, record);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doRemoveService: function(url, data) {
    	
		var filter = {
			flowNo:'0',
			object:data
		};

		var req = this.ajaxBody(url, filter);
        var promise = new Promise(function (resolve, reject) {
        	$.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },
    doUploadService: function(url, data, fileList) {
        let formData = new FormData();

		var req = {
			flowNo:'0',
			object:data
		};

        req.term = 'web';
        if (typeof (window.loginData) !== 'undefined') {
            var compUser = window.loginData.compUser;
            req.corp = (compUser === null) ? '' : compUser.corpUuid;
        }
        else {
            req.corp = '';
        }

        formData.append('reqObject', JSON.stringify(req))

        var index = 0;
        for(var item of fileList){
            formData.append('file_' + index, item);
            index ++;
        }

		/*var sid = this.getSessionID();
		if( sid !== null ){
			this.fz_setCookie('SESSION', sid, 1);
		}*/

		var ajaxBody = {
            type:'post',
            url: this.fmtGetUrl(url),
            data: formData,
            dataType:'json',
            cache: false,
            contentType: false,
            //contentType: 'application/json; charset=UTF-8',
            processData: false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
        };

        return new Promise(function (resolve, reject) {
        	$.ajax(ajaxBody).done(resolve).fail(reject);
        });
    },

    copyValue: function(fromObj, toObj)
    {
		for(var name in fromObj){
            try {
				toObj[name] = fromObj[name];
			}catch(E){}
		}
    },
	//深度拷贝对象
    deepCopyValue:function (source) {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            if(source[item]!==null){
                sourceCopy[item] = typeof source[item] === 'object' ? this.deepCopyValue(source[item]) : source[item];
            }
            else{
                sourceCopy[item]=source[item]=null;
            }
        }
        return sourceCopy;
    },
    compareTo: function(fromObj, toObj)
    {
		for(var name in fromObj){
			try{
				if(toObj[name] !== fromObj[name]){
					return false;
				}
			}catch(E){
				return false;
			}
		}

		for(var name in toObj){
			try{
				if(toObj[name] !== fromObj[name]){
					return false;
				}
			}catch(E){
				return false;
			}
		}

		return true;
    },

	findRecord: function(store, uuid)
	{
		for(var x=store.recordSet.length-1; x>=0; x--){
			if(store.recordSet[x].uuid === uuid){
				return x;
			}
		}

		return -1;
	},

    getResErrMsg: function (value) {
        if (value !== undefined && value !== null) {
            var res = value.responseJSON;
            if (res !== undefined && res !== null) {
                var msg = res.message;
                if (msg !== undefined && msg !== null) {
                    return msg;
                }
            }
        }

        return "调用服务错误";
    },
	// !!! 不要修改 !!!
    recordCreate: function (store, data, url, syncRecord)
    {
        var util = this;
		var self = store;
        this.doCreateService(url, data).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (syncRecord === undefined || syncRecord === null) {
                    var type = typeof (result.object.list);
                    if (type === "object" && result.object.list.constructor === Array) {
                        var len = result.object.list.length;
                        for (var i = 0; i < len; i++) {
                            self.recordSet.push(result.object.list[i]);
                        }
                    }
                    else {
                        self.recordSet.push(result.object);
                    }
                }
                else {                
                    syncRecord(self, result.object);
                }

				self.totalRow = self.totalRow + 1;                
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
        }, function (value) {
            self.fireEvent('create', util.getResErrMsg(value), self);
		});        
	},

	// !!! 不要修改 !!!
	recordUpdate: function(store, data, url, syncRecord)
    {
        var util = this;
		var self = store;
		var idx = this.findRecord( store, data.uuid );

		if(idx < 0){
			self.fireEvent('update', '没有找到记录['+data.uuid+']', self);
			return;
		}

		// 数据没有变更
		if(this.compareTo(self.recordSet[idx], data)){
			console.log('数据没有变更');
			self.fireEvent('update', '', self);
			return;
		}

		var util = this;
		this.doUpdateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {

                if (syncRecord === undefined || syncRecord === null) {
                    util.copyValue(result.object, self.recordSet[idx]);
                }
                else {
                    syncRecord(self, self.recordSet[idx], result.object);
                }

				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('update', util.getResErrMsg(value), self);
		});
	},

	// !!! 不要修改 !!!
	recordDelete: function(store, uuid, url) {
		console.log(store,uuid,url)
		var self = store;
		var idx = this.findRecord( store, uuid );

		if(idx < 0){
			self.fireEvent('remove', '没有找到记录['+uuid+']', self);
			return;
		}

        var util = this;
		this.doRemoveService(url, uuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.splice(idx, 1);
				self.totalRow = self.totalRow - 1;
				self.fireEvent('remove', '', self);
			}
			else{
				self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('remove', util.getResErrMsg(value), self);
		});
  },
  //多条删除
  recordDeleteMore: function(store, uuid, url) {
		var self = store;
		var idx = this.findRecord( store, uuid );

		if(idx < 0){
			self.fireEvent('remove', '没有找到记录['+uuid+']', self);
			return;
		}

        var util = this;
		this.doRemoveService(url, uuid).then(function(result) {
			console.log(result)
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.splice(idx, 1);
				self.fireEvent('remove', '', self);
			}
			else{
				self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('remove', util.getResErrMsg(value), self);
		});
  },
  
    recordRetrieve: function (url, filter, startPage, pageRow, totalRow) {
        var util = this;
        var promise = new Promise(function (resolve, reject) {
            util.doRetrieveService(url, filter, startPage, pageRow, totalRow).then(function (result) {
                if (record) {
                    if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                        resolve(result.object);
                    }
                    else {
                        reject("处理错误[" + result.errCode + "][" + result.errDesc + "]");
                    }
                }
                else {
                    reject('查询数据时错误');
                }
            }, function (value) {
                reject(JSON.stringify(value));
            });
        });

        return promise;
    },
    


    // 菜单权限
    selModName: '',     // 查找菜单
    selectedApp: null,     // 查找角色
    menuMap: {},
    getAppMenu: function (appName) {
        // 先检查菜单是否已经下载
        var loadedMenu = window.sessionStorage.getItem('loadedMenu');
        if (loadedMenu === null || loadedMenu === undefined || loadedMenu === '') {
            return null;
        }

        var isLoaded = false;
        var list = loadedMenu.split(',');
        for (var x = list.length - 1; x >= 0; x--) {
            if (appName === list[x]) {
                isLoaded = true;
                break;
            }
        }

        if (!isLoaded) {
            return null;
        }

        var m = this.menuMap[appName];
        if (m !== undefined && m !== null) {
            return m;
        }

        var ms = window.sessionStorage.getItem('menu.' + appName);
        if (ms !== undefined && ms !== null) {
            m = JSON.parse(ms);
            this.menuMap[appName] = m;

            this.selModName = appName;
            window.sessionStorage.setItem('activeMenu', appName);
            return m;
        }

        return null;
    },
    setSelectedApp: function (appCode) {
        this.selectedApp = null;

        if (typeof (window.loginData) === 'undefined') {
            return;
        }

        var appList = null;
        var compUser = window.loginData.compUser;
        if (compUser === null) {
            var user = window.loginData.authUser;
            if (user.userName === 'admin') {
                appList = [{ appCode: 'MA' }];
            }
            else {
                return;
            }
        }
        else {
            appList = compUser.appAuthList;
        }

        if (appList !== null) {
            if (appCode.charAt(0) === '*') {
                appCode = appCode.substr(1);
            }

            var len = appList.length;
            for (var x = 0; x < len; x++) {
                var app2 = appList[x];
                if (app2.appCode === appCode) {
                    this.selectedApp = app2;
                    window.sessionStorage.setItem('activeApp', appCode);
                    break;
                }
            }
        }
    },
    saveAppMenu: function (appName, menuList) {
        if (menuList === undefined || menuList === null) {
            menuList = [];
        }

        var m = {};
        menuList.map((node, i) => {
            m[node.menuPath] = node.roleName;
        });

        this.menuMap[appName] = m;
        window.sessionStorage.setItem('menu.' + appName, JSON.stringify(m));

        var loadedMenu = window.sessionStorage.getItem('loadedMenu');
        if (loadedMenu === null || loadedMenu === undefined || loadedMenu === '') {
            loadedMenu = appName;
        }
        else {
            loadedMenu = loadedMenu + ',' + appName;
        }

        window.sessionStorage.setItem('loadedMenu', loadedMenu);
    },
    setActiveMenuName: function (menuName) {
        this.selModName = menuName;
        window.sessionStorage.setItem('activeMenu', menuName);
    },
    // 检查权限：0=生产没有，1=有，2=测试没有
    checkMenuPriv: function (menuPath) {
        if (this.selectedApp === null) {
            // 页面刷新
            var appCode = window.sessionStorage.getItem('activeApp');
            if (appCode !== null && appCode !== undefined) {
                this.setSelectedApp(appCode);
            }
            
            var menuName = window.sessionStorage.getItem('activeMenu');
            if (menuName !== null && menuName !== undefined) {
                this.getAppMenu(menuName);
            }
        }

        if (this.selModName === '') {
            // 首页面
            return 1;
        }

        var m = this.menuMap[this.selModName];
        if (m === undefined || m === null) {
            return this.checkRole ? 0 : 2;
        }

        var role = m[menuPath];
        if (role === undefined || role === null) {
            // console.log('menuPath', menuPath)
//            return 1;   // 禁止权限
            return this.checkRole ? 0 : 2;
        }

        if (role.indexOf('*') >= 0) {
            return 1;
        }

        // APP授权
        if (this.selectedApp === null) {
            return this.checkRole ? 0 : 2;
        }

        // 维护功能
        var compUser = window.loginData.compUser;
        if (compUser === null) {
            if ('MA' === this.selectedApp.appCode) {
                var user = window.loginData.authUser;
                if (user.userName === 'admin') {
                    return 1;
                }
            }
        }

        // 用户权限
        var roles = this.selectedApp.roleList;
        if (roles === null || roles === undefined) {
            return this.checkRole ? 0 : 2;
        }

        var list = roles.split(',');
        for (var x = list.length - 1; x >= 0; x--) {
            var rn = ',' + list[x] + ',';
            if (role.indexOf(rn) >= 0) {
                return 1;
            }
        }

        return this.checkRole ? 0 : 2;
    },
    checkAppPriv: function (appCode) {
        // console.log('this.checkRole', this.checkRole)
        if (typeof (window.loginData) === 'undefined') {
            return this.checkRole ? 0 : 2;
        }

        var compUser = window.loginData.compUser;
        if (compUser === null) {
            if ('MA' === appCode) {
                var user = window.loginData.authUser;
                if (user.userName === 'admin') {
                    return 1;
                }
            }

            return this.checkRole ? 0 : 2;
        }

        if (appCode.charAt(0) === '*') {
            // 无权限控制
            return 1;
        }

        // console.log('compUser.appAuthList', compUser.appAuthList)
        if (compUser.appAuthList !== null) {
            var len = compUser.appAuthList.length;
            for (var x = 0; x < len; x++) {
                var app2 = compUser.appAuthList[x];
                // console.log('app2', app2, appCode)
                if (app2.appCode === appCode) {
                    return 1;
                }
            }
        }

//        return 1;
        return this.checkRole ? 0 : 2;
    },

    // 下载菜单
    downAppMenu: function (menuName, roleApp) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            var m = self.getAppMenu(menuName);
            if (m) {
                self.setSelectedApp(roleApp);
                self.setActiveMenuName(menuName);
                resolve(m);
                return;
            }

            // 先下载菜单
            var url = self.authUrl + 'fnt-app-menu/appName';
            self.doCreateService(url, menuName).then(function (result) {
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.saveAppMenu(menuName, result.object);

                    self.setSelectedApp(roleApp);
                    self.setActiveMenuName(menuName);
                    resolve(result.object);
                }
                else {
                    reject("下载菜单错误[" + result.errCode + "][" + result.errDesc + "]");
                }
            }, function (value) {
                reject("下载菜单错误");
            });
        });

        return promise;
    },

}
