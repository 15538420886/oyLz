'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import {Button} from 'antd';
var Utils = require('../../public/script/utils');


var DownPage = React.createClass({
	getInitialState : function() {
		return null;
	},

	// 第一次加载
	componentDidMount : function(){
	},

	downloadDictCode: function()
	{
		var url = Utils.paramUrl+'app-info/get-all-dict';
        window.location.href = Utils.fmtGetUrl(url);
	},
	render : function() {
		return (
			<div className='grid-page' style={{padding: '100px 0 0 100px'}}>
			    <Button key="btnDownDict" type="primary" size="large" onClick={this.downloadDictCode}>下载字典表</Button>
			</div>
		);
	}
});

module.exports = DownPage;
