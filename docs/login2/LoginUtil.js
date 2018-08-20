'use strict';
var $ = require('jquery');

var Common = require('../public/script/common');
var Utils = require('../public/script/utils');


module.exports = {
    loadContext: function () {
        var loginData = window.sessionStorage.getItem('loginData');
        if (loginData !== null && typeof (loginData) !== 'undefined') {
            var utilConf = window.sessionStorage.getItem('utilConf');
            var commonConf = window.sessionStorage.getItem('commonConf');
            if (utilConf !== null && typeof (utilConf) !== 'undefined' &&
                commonConf !== null && typeof (commonConf) !== 'undefined') {
                var uConf = JSON.parse(utilConf);
                var cConf = JSON.parse(commonConf);
                Utils.initConf(uConf);
                Common.initConf(cConf);

                window.loginData = JSON.parse(loginData);
                return true;
            }
        }
        return false;
    },

    downConfig: function (loginPage) {
        var self = loginPage;

        var file = '/config.js';
        var href = window.location.href;
        if (href.startsWith('https:')) {
            file = '/config-s.js';
        }

        self.setState({ loading: true });
        $.getScript(file, function () {
            Utils.initConf(utilConf);
            Common.initConf(commonConf);
            window.sessionStorage.setItem('utilConf', JSON.stringify(utilConf));
            window.sessionStorage.setItem('commonConf', JSON.stringify(commonConf));

            if (Common.corpStruct !== '单公司') {
                self.onConfigLoaded();
            }

            self.setState({ loading: false });
        });
    },

    saveLoginData: function (loginData, corpUuid) {
        try {
            var corp = null;
            var len = loginData.compUser.length;
            for (var i = 0; i < len; i++) {
                if (loginData.compUser[i].corpUuid === corpUuid) {
                    corp = loginData.compUser[i];
                    break;
                }
            }

            loginData.compUser = corp;
            console.log(loginData);
            window.loginData = loginData;
            window.sessionStorage.setItem('loginData', JSON.stringify(loginData));
        }
        catch (err) {
            console.log(err);
        }

        try {
            // 清空缓存的菜单
            window.sessionStorage.setItem('loadedMenu', '');
        }
        catch (err) {
            console.log(err);
        }
    }

}
