'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../public/script/common');
import { Spin , Tabs} from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';

import BranchTablePage from './Components/BranchTabelPage.js'
import BranchStaffPage from '../branch_staff/BranchStaffPage.js'
const TabPane = Tabs.TabPane;

var BranchPage = React.createClass({
    getInitialState : function() {
        return {
            isSelect: true,
            selectKey: '1',
            branch:{},
        }
    },

    componentDidMount : function(){
       
    },
    selectsRole:function(branch){
        this.setState({
            isSelect: false,
            selectKey:'2',
            branch:branch
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
    var cs = Common.getGridMargin(this, 0);
    return (
        <div className='tab-page' style={{padding: cs.padding}}>
            <div style={{margin: cs.margin}}>
                <ServiceMsg ref='mxgBox' svcList={['hr_branch/retrieve','hr_branch/remove']}/>
            </div>
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="1" activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="分公司管理" key="1" style={{width: '100%', height: '100%'}}>
                        <BranchTablePage selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                    <TabPane tab="人员维护" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
                        <BranchStaffPage branchUuid={this.state.branch.uuid} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                </Tabs>
            </div>
        </div>);
    }
});

module.exports = BranchPage;