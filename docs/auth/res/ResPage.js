'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');
var Context = require('../AuthContext');
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Utils = require('../../public/script/utils');

import ResListPage from '../module/Components/ModuleListPage';
import ResTablePage from './Components/ResTablePage';

var filterValue = '';
var ResPage = React.createClass({
    getInitialState : function() {
      	return {
           
      	}
    },
	
    componentDidMount : function(){
    },

    onSelectModule:function(module){ 
        this.refs.tablePage.initResMod(module);
    },
    render : function() {
        var cs = Common.getGridMargin(this, 0);
	    return (
    		<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['auth_app_res/retrieve','auth_app_res/remove']} />
				</div>
		        <div style={{height:'100%', paddingLeft: '4px'}}>
		            <ResListPage ref='modList' caption='请选择模块' width='220px' onSelectModule={this.onSelectModule} >
		            	<ResTablePage ref="tablePage"/>
		            </ResListPage>
		        </div>
		        
	         
	        </div>
	    );
    }
});

module.exports = ResPage;
