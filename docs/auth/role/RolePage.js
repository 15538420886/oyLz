'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../public/script/common');
import { Spin , Tabs} from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';

import RoleTablePage from './Components/RoleTablePage'
import FuncTablePage from './Components/FuncTablePage'
const TabPane = Tabs.TabPane;

var RolePage = React.createClass({
    getInitialState : function() {
        return {
        	roleUuid: '',
            isSelect: true,
            selectKey: '1'
        }
    },

    componentDidMount : function(){
       
    },
    selectsRole:function(roleUuid){
        this.setState({
        	roleUuid: roleUuid,
            isSelect: false,
            selectKey:'2'
        });
        
        var funcPage=this.refs.funcPage;
        if(funcPage !== null && typeof(funcPage) !== 'undefined'){
        	funcPage.loadData(roleUuid);
        }
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
	    var cs = Common.getGridMargin(this, 0);
	    return (
	        <div className='tab-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['auth-app-role/retrieve','auth-app-role/remove','auth-app-func/retrieve','auth-app-func/remove']}/>
				</div>
		        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="业务角色" key="1" style={{width: '100%', height: '100%'}}>
	                        <RoleTablePage ref="rolePage" selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
	                    </TabPane>
	                    <TabPane tab="角色功能" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
	                        <FuncTablePage ref="funcPage" roleUuid={this.state.roleUuid} style={{width: '100%', height: '100%'}}/>
	                    </TabPane>
	                </Tabs>
	           </div>
	        </div>
	    );
    }
});

module.exports = RolePage;

