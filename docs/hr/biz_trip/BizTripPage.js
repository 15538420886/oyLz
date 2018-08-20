'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../public/script/common');
import { Spin , Tabs} from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';

import BizTripTablePage from './Components/BizTripTabelPage.js'
import TripParamPage from '../biz_trip_param/TripParamPage.js'
const TabPane = Tabs.TabPane;

var BizTripPage = React.createClass({
    getInitialState : function() {
        return {
            isSelect: true,
            selectKey: '1',
            bizTrip:{},
        }
    },

    componentDidMount : function(){
       
    },
    selectsRole:function(bizTrip){
        this.setState({
            isSelect: false,
            selectKey:'2',
            bizTrip:bizTrip
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
                <ServiceMsg ref='mxgBox' svcList={['hr_biz_trip/retrieve','hr_biz_trip/remove']}/>
            </div>
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs activeKey={this.state.selectKey} onTabClick={this.onTabClick}>
                    <TabPane tab="差旅级别" key="1" style={{width: '100%', height: '100%'}}>
                        <BizTripTablePage selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                    <TabPane tab="报销额度" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
                        <TripParamPage tripUuid={this.state.bizTrip.uuid} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                </Tabs>
            </div>
        </div>);
    }
});

module.exports = BizTripPage;