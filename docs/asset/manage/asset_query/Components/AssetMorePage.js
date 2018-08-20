'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Modal, Button, Input, Select, Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import AssetInforPage from './AssetInforPage';
import AssetImagePage from './AssetImagePage';

var AssetQueryStore = require('../data/AssetQueryStore');
var AssetQueryActions = require('../action/AssetQueryActions');

var AssetMorePage = React.createClass({
    getInitialState : function() {
        return {
            user:{},
            asset:{},
            message: '',
            assetDisp: {},
            action: 'tab'
        }
    },

    componentDidMount : function(){
    },

    mixins: [Reflux.listenTo(AssetQueryStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
		  if( data.errMsg === ''){
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false
			  });
		  }
	  }
	},

    goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }  
    },
     
    doAction:function(name, disp){
        this.setState({ action: name, assetDisp: disp})
    },

    onGoBack: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
        else {
            this.setState({ action: 'tab' });
        }
    },
    render : function() {
        var asset = this.props.asset;
	    var selectKey = this.state.selectKey;
	    var cs = Common.getGridMargin(this, 0);

         return (
	        <div className='tab-page' style={{padding: cs.padding}}>
	        	<div style={{margin: cs.margin}}>
	            	<ServiceMsg ref='mxgBox' svcList={['asset-info/retrieve']}/>
	            </div>
	            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                        </TabPane>
	                    <TabPane tab="资产信息" key="2" style={{width: '100%', height: '100%'}}>
                            <AssetInforPage doAction={this.doAction} goBack={this.goBack} asset={asset} />
                        </TabPane>
                        <TabPane tab="图片" key="3" style={{ width: '100%', height: '100%' }}>
                            <AssetImagePage doAction={this.doAction} goBack={this.goBack} asset={asset}/>
                        </TabPane>
	                </Tabs>
	            </div>
         </div>  
         );  
    }
});

module.exports = AssetMorePage;
