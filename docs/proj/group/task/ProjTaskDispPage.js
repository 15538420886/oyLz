'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Checkbox, Spin, Button } from 'antd';
const CheckboxGroup = Checkbox.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ProjTaskDispStore = require('./data/ProjTaskDispStore');
var ProjTaskDispActions = require('./action/ProjTaskDispActions');

import ProjTaskDispLeftPage from './Components/ProjTaskDispLeftPage';
import ProjTaskPage from './Components/ProjTaskPage';


var ProjTaskDispPage = React.createClass({
	getInitialState : function() {
		return {
            loading:false,
            disabled: false,
            parentUuid:'',
            ProjGrpUuid:'',
		}
	},

	mixins: [Reflux.listenTo(ProjTaskDispStore)],
   
	 // 第一次加载
    componentDidMount : function(){
    },

	onSelectProjGrp: function(ProjGrp){
        var filter = {};
		    filter.corpUuid = window.loginData.compUser.corpUuid;
        if(ProjGrp){   
           	var parentUuid = ProjGrp.parentUuid;
           	var ProjGrpUuid = ProjGrp.uuid; 
           	this.setState({
           		loading: true,
           		ProjGrpUuid:ProjGrpUuid,
           		parentUuid:parentUuid,

           	});
            this.refs.ProjTask.onGoBack()
        }  
    },

	render : function() {
	    var cs = Common.getGridMargin(this, 0);
		return (
			 <div className='grid-page' style={{padding: '10px'}} >
                <div style={{ display: 'flex', height: '100%' }}>   
                      <div style={{ height: '100%',float:'left',width: '200px', borderRight: "1px solid #e2e2e2"}}>
                        <ProjTaskDispLeftPage onSelectProjGrp={this.onSelectProjGrp}/>
                     </div>
                    <div  style={{   width:'100%', paddingRight:'8px', paddingTop:'10px'}}>
                      <ProjTaskPage ref='ProjTask'  ProjGrpUuid={this.state.ProjGrpUuid} parentUuid={this.state.parentUuid} />
                    </div>
                </div>
            </div>
		);
	}
});

module.exports = ProjTaskDispPage;

