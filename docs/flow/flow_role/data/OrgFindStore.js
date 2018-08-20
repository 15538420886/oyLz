﻿var Reflux = require('reflux');
var OrgFindActions = require('../action/OrgFindActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var OrgFindStore = Reflux.createStore({
    listenables: [OrgFindActions],

    orgType: '',
    orgUuid: '',
    orgName: '',
    filterValue: '',
    object: null,
	
	init: function() {
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			recordSet: self.recordSet,
            orgType: self.orgType,
            orgUuid: self.orgUuid,
            orgName: self.orgName,
            filterValue: self.filterValue,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('org-find', operation, errMsg);
	},
	
    onFindPool: function(poolUuid) {
		var self = this;
        var url = Utils.projUrl + 'res-pool/get-by-uuid';
        Utils.doGetRecordService(url, poolUuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                var pool = result.object;
                self.orgType = '资源池';
                self.orgUuid = (pool === null) ? '' : pool.uuid;
                self.orgName = (pool === null) ? '' : pool.poolName;
                self.filterValue = poolUuid;
                self.object = pool;

                self.fireEvent('pool', '', self);
			}
			else{
                self.fireEvent('pool', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('pool', "调用服务错误", self);
		});
    },

    onFindPoolTeam: function (teamUuid) {
        var self = this;
        var url = Utils.projUrl + 'res-team/get-by-uuid';
        Utils.doGetRecordService(url, teamUuid).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var team = result.object;
                self.orgType = '资源池小组';
                self.orgUuid = (team === null) ? '' : team.uuid;
                self.orgName = (team === null) ? '' : team.teamName;
                self.filterValue = teamUuid;
                self.object = team;

                self.fireEvent('team', '', self);
            }
            else {
                self.fireEvent('team', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('team', "调用服务错误", self);
        });
    },

    onFindDeptGrp: function (deptUuid) {
        var self = this;
        var url = Utils.hrUrl + 'hr_dept/get-dept-grp';
        Utils.doGetRecordService(url, deptUuid).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var dept = result.object;
                self.orgType = '事业群';
                self.orgUuid = (dept === null) ? '' : dept.uuid;
                self.orgName = (dept === null) ? '' : dept.deptName;
                self.filterValue = deptUuid;
                self.object = dept;

                self.fireEvent('grp', '', self);
            }
            else {
                self.fireEvent('grp', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('grp', "调用服务错误", self);
        });
    },
	
});

module.exports = OrgFindStore;
