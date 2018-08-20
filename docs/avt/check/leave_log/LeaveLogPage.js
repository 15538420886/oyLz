'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../../public/script/common');
import { Spin , Tabs} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

import LeaveLogPerPage from './Components/LeaveLogPerPage';
import LeaveLogDetailPage from './Components/LeaveLogDetailPage';
const TabPane = Tabs.TabPane;

var LeaveLogPage = React.createClass({
    getInitialState : function() {
        return {
            userUuid:''
        }
    },

    componentDidMount : function(){
       
    },
    //点击Tab后回调
    onTabClick:function(){
    	
    },
   
    render : function() { 

	    var cs = Common.getGridMargin(this, 0);
	    return (
	        <div className='tab-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['auth-app-role/retrieve','auth-app-role/remove','auth-app-func/retrieve','auth-app-func/remove']}/>
				</div>
		        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey='1'  onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="休假信息" key="1" style={{width: '100%', height: '100%'}}>
	                        <LeaveLogPerPage/>
	                    </TabPane>
	                    <TabPane tab="详细信息" key="2" style={{width: '100%', height: '100%'}}>
	                       <LeaveLogDetailPage userUuid={this.state.userUuid}/>
	                    </TabPane>
	                </Tabs>
	           </div>
	        </div>
	    );
    }
});

module.exports = LeaveLogPage;

