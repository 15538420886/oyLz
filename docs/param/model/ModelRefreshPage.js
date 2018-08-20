'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import {Button} from 'antd';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');


var ModelRefreshPage = React.createClass({
	getInitialState : function() {
		return null;
	},

	// 第一次加载
	componentDidMount : function(){
	},

	onLoadModel: function()
	{
		var url = Utils.paramUrl+'model-info/flush';

        var self = this;
        Utils.doCreateService(url, {corpUuid: '#'}).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
            	Common.succMsg('模板已经刷新');
            }
            else {
            	Common.errMsg("处理错误[" + result.errCode + "][" + result.errDesc + "]");
            }
        }, function (value) {
        	Common.errMsg("调用服务错误");
        });
	},
	render : function() {
		return (
			<div className='grid-page' style={{padding: '100px 0 0 100px'}}>
			    <Button key="btnLoadModel" type="primary" size="large" onClick={this.onLoadModel}>刷新模板文件</Button>
			</div>
		);
	}
});

module.exports = ModelRefreshPage;
