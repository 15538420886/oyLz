'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

import ModListPage from '../mod/Components/ModListPage';
import FntMenuTablePage from './Components/FntMenuTablePage';

var FntMenuPage = React.createClass({
    getInitialState : function() {
      	return {
            loading:false,
            modUuid:'',
      	}
    },

    componentDidMount : function(){
        if(this.props.modUuid) {
            var fntMod = {};
            this.setState({loading: true});
            fntMod.uuid= this.props.modUuid;
            this.refs.menuPage.initAppMenu(fntMod);
        }
    },

    componentWillReceiveProps:function(nextProps){
        if(nextProps.modUuid) {
            if(nextProps.modUuid === this.state.modUuid){
            return;
        }
        this.state.modUuid = nextProps.modUuid;
        this.setState({loading: true});
        var fntMod = {};
        fntMod.uuid= nextProps.modUuid;
        this.refs.menuPage.initAppMenu(fntMod);
        } 
    },

    onSelectFntMod:function(fntMod){  
        this.setState({loading: true});
        this.state.modUuid = fntMod.uuid;
        this.refs.menuPage.initAppMenu(fntMod);
    },

    render : function() {
        var cs = Common.getGridMargin(this, 0);
	    return (
    		<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['fnt-app-menu/retrieve', 'fnt-app-menu/remove', 'fnt_app_mod/retrieve']}/>
				</div>
		        <div style={{height:'100%', paddingLeft: '4px'}}>
		            <ModListPage ref='modList' caption='请选择模块' width='200px' onSelectFntMod={this.onSelectFntMod} >
		            	<FntMenuTablePage ref='menuPage'/>
		            </ModListPage>
		        </div>
	        </div>
	    );
    }
});

module.exports = FntMenuPage;
