'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../public/script/common');
import { Spin , Tabs } from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';

import WorkTablePage from './Components/WorkTablePage.js'
import WorkFactorPage from '../work_factor/WorkFactorPage.js'
const TabPane = Tabs.TabPane;

var WorkTypePage = React.createClass({
	getInitialState : function() {
		return {
			isSelect: true,
            selectKey: '1',
            work:{},
		}
	},

	componentDidMount : function(){
       
    },
    selectsRole: function (work) {
        this.state.work = work;
        this.setState({
            isSelect: false,
            selectKey:'2',
        })
    },
	 //点击Tab后回调
    onTabClick:function(){
        this.setState({
            isSelect: true,
            selectKey:'1'
        });
    },

	render : function() {
		var selectKey = this.state.selectKey;
		
	    return (
	        <div className='tab-page' style={{paddingLeft: '4px'}}>
                <Tabs activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="工种管理" key="1" style={{width: '100%', height: '100%'}}>
                        <WorkTablePage selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                    <TabPane tab="指标项" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
					   <WorkFactorPage workUuid={this.state.work.uuid} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                </Tabs>
	        </div>
	    );
    }
});

module.exports = WorkTypePage;
                              