import React from 'react';
var Reflux = require('reflux');
var FindNameStore = require('../../lib/data/FindNameStore');

var TeamStore = require('../proj/team/data/ProjTeamStore');
var TeamActions = require('../proj/team/action/ProjTeamActions');

var ResTeamStore = require('../res/team/data/ResTeamStore');
var ResTeamActions = require('../res/team/action/ResTeamActions');

var PoolStore = require('../res/pool/data/PoolStore');
var PoolActions = require('../res/pool/action/PoolActions');

module.exports = function () {
    return {
        getInitialState: function () {
            return {
                waitPages: {},
                obj: null,
            }
        },
        _getNullValue_2: function (uuid, resName) {
            this.state.obj = null;
            if (uuid === null || typeof (uuid) === 'undefined' || uuid === '') {
                return '';
            }

            var wPage = this.state.waitPages[resName];
            if (wPage !== null && typeof (wPage) !== 'undefined') {
                return uuid;
            }

            return null;
        },
        _getResultValue_2: function (uuid, resName) {
            var obj = this.state.obj;
            if (obj !== null && obj.resName === resName) {
                return obj.name;
            }

            // 等待查询结果
            this.state.waitPages[resName] = this;
            return uuid;
        },
        _fireEvent_2: function (resName) {
            var wPage = this.state.waitPages[resName];
            if (wPage !== null && typeof (wPage) !== 'undefined') {
                this.state.waitPages[resName] = null;
                wPage.setState({ loading: wPage.state.loading });
            }
        },

        mixins: [
            Reflux.listenTo(FindNameStore, "_onFindComplete_2"), 
            Reflux.listenTo(TeamStore, "_onTeamComplete"),
            Reflux.listenTo(ResTeamStore, "_onResTeamComplete"),
            Reflux.listenTo(PoolStore, "_onResPoolComplete"),
        ],
        _onFindComplete_2: function (data) {
            this.state.obj = data;
        },

        // 项目小组
        _onTeamComplete: function (data) {
            this._fireEvent_2('proj_team');
        },
        getTeamName: function (projUuid, uuid) {
            if (projUuid === undefined || projUuid === null || projUuid === '') {
                return uuid;
            }

            var value = this._getNullValue_2(uuid, 'proj_team')
            if (value === null) {
                TeamActions.getTeamName(projUuid, uuid);	// 下载数据
                value = this._getResultValue_2(uuid, 'proj_team');
            }

            return value;
        },

        // 资源池小组
        _onResTeamComplete: function (data) {
            this._fireEvent_2('res_team');
        },
        getResTeamName: function (poolUuid, uuid) {
            if (poolUuid === undefined || poolUuid === null || poolUuid === '') {
                return uuid;
            }

            var value = this._getNullValue_2(uuid, 'res_team')
            if (value === null) {
                ResTeamActions.getTeamName(poolUuid, uuid);	// 下载数据
                value = this._getResultValue_2(uuid, 'res_team');
            }

            return value;
        },

        // 资源池
        _onResPoolComplete: function (data) {
            this._fireEvent_2('res_pool');
        },
        getResPoolName: function (uuid) {
            var corpUuid = window.loginData.compUser.corpUuid;
            var value = this._getNullValue_2(uuid, 'res_pool')
            if (value === null) {
                PoolActions.getPoolName(corpUuid, uuid);	// 下载数据
                value = this._getResultValue_2(uuid, 'res_pool');
            }

            return value;
        },
    };
};
