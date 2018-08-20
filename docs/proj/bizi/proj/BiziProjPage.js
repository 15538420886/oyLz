'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var ProjContext = require('../../ProjContext');
import { Icon, Button, Spin } from 'antd';

var BiziProjPage = React.createClass({
	getInitialState : function() {
		return {
			loading: false,
			projList:[
				{
					name: '一个事务',
					hint: '事务描述信息'
				},
				{
					name: '另一个事务',
					hint: '事务描述信息'
				},
			]
		}
	},

	// 第一次加载
	componentDidMount: function () {
	},
	handleProjClick: function(proj){
		ProjContext.openBiziProjPage(proj);
	},

	render: function () {
        var cardList =
	      	this.state.projList.map((proj, i) => {
				return <div key={proj.name} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleProjClick.bind(this, proj)} >
						<div className="ant-card-head"><h3 className="ant-card-head-title">{proj.name}</h3></div>
						<div className="ant-card-body" style={{cursor:'pointer', minHeight: 84}}>
							{proj.hint}
						</div>
					</div>
				</div>
	      	});
	      	
		return (
			<div className='form-page' style={{width:'100%', padding: '24px 16px 0 16px'}}>
                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..."><div style={{minHeight: '200px'}}>{cardList}</div></Spin>
                        :
                        <div>{cardList}</div>
                }
			</div>);
	}
});

module.exports = BiziProjPage;

