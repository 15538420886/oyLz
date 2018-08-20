'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Checkbox, Spin, Button } from 'antd';
const CheckboxGroup = Checkbox.Group;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var ChkProjGrpStore = require('./data/ChkProjGrpStore');
var ChkProjGrpActions = require('./action/ChkProjGrpActions');

import ChkProjGrpTree from './Components/ChkProjGrpTree';
import ChkFlowDef from './Components/ChkFlowDef';

var ChkProjGrpPage = React.createClass({
	getInitialState : function() {
		return {
			  ProjGrpSet : {
				recordSet: [],
				errMsg:'',
			},
            loading:false,
            disabled: false,
		}
	},

	mixins: [Reflux.listenTo(ChkProjGrpStore, "onServiceComplete")],
    onServiceComplete: function(data) {
            this.setState({
                ProjGrpSet:data,
                loading: false
            });

    },

	 // 第一次加载
    componentDidMount : function(){
    },

	onSelectProjGrp: function(ProjGrp){
		this.setState({loading: true});
        var filter = {};
		filter.corpUuid = window.loginData.compUser.corpUuid;
        if(ProjGrp){
            filter.grpUuid = ProjGrp.uuid ? ProjGrp.uuid : '';
            this.refs.chkflow.getByUuid(ProjGrp.uuid);
        }  
    },

	render : function() {
	    var cs = Common.getGridMargin(this, 0);
		return (
			 <div className='grid-page' >
                <div style={{margin: cs.margin}}>
                   <ServiceMsg ref='mxgBox' svcList={['proj_group/retrieve','flow-def/get-by-corpUuid', 'chk-proj-grp/create', 'chk-proj-grp/update','chk-proj-grp/get-by-uuid']}/>
                </div>
                <div style={{ display: 'flex', height: '100%' }}>
                     <div className='left-tree' style={{flex: '0 0 200px', width: '200px', overflowY:'auto', overflowX:'hidden'}}>
                        <ChkProjGrpTree onSelectProjGrp={this.onSelectProjGrp}/>
                     </div>
                    <div className='left-tree' style={{ width: '300px', overflowY: 'auto', overflowX: 'hidden',  marginRight: '10px', borderRightWidth:'0px' , paddingTop:'10px'}}>
                        <ChkFlowDef ref='chkflow'/>
                    </div>
                </div>
            </div>
		);
	}
});

module.exports = ChkProjGrpPage;
