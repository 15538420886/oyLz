'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button } from 'antd';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');


var LoadRedisPage = React.createClass({
    getInitialState: function () {
        return null;
    },

    // 第一次加载
    componentDidMount: function () {
    },

    onLoadRedis: function () {
        var url = Utils.authUrl + 'sys/init';

        var self = this;
        Utils.doCreateService(url, {}).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Common.infoMsg('权限已启用');
            }
            else {
                Common.errMsg("处理错误[" + result.errCode + "][" + result.errDesc + "]");
            }
        }, function (value) {
            Common.errMsg("调用服务错误");
        });
    },
    render: function () {
        return (
            <div className='grid-page' style={{ padding: '100px 0 0 100px' }}>
                <Button key="btnLoadRedis" type="primary" size="large" onClick={this.onLoadRedis}>更新权限数据</Button>
            </div>
        );
    }
});

module.exports = LoadRedisPage;
