'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../../public/script/common');
import { Spin , Tabs} from 'antd';

import HrReqPage from './Components/HrReqPage.js'
import ProjHrReqDetail from './Components/ProjHrReqDetailPage.js'
const TabPane = Tabs.TabPane;

var ProjHrReqPage = React.createClass({
    getInitialState : function() {
        return {
            isSelect: true,
            selectKey: '1',
            HrReq:{},
        }
    },

    componentDidMount : function(){
       
    },
    selectsRole:function(HrReq){
       
        this.setState({
            isSelect: true,
            selectKey:'2',
            HrReq:HrReq
        })
    },
    //点击Tab后回调
    onTabClick:function(HrReq){
        this.setState({
            isSelect: true,
            selectKey:'1'
        });
    },
    
    render : function() {
        var selectKey = this.state.selectKey;
        var cs = Common.getGridMargin(this, 0);
        //console.log("this.state.HrReq.uuid",this.state.HrReq.uuid)
        return (
            <div className='tab-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    
                </div>
                <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                    <Tabs defaultActiveKey="1" activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                        <TabPane tab="人员需求" key="1" style={{width: '100%', height: '100%'}}>
                            <HrReqPage selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
                        </TabPane>
                        <TabPane tab="人员明细" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
                            <ProjHrReqDetail reqUuid={this.state.HrReq.uuid} style={{width: '100%', height: '100%'}}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
});

module.exports = ProjHrReqPage;

