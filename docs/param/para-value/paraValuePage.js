﻿"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Menu} from 'antd';

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var ParamFormActions = require('./action/ParamFormActions');
import ParamForm from './Components/ParamForm';
import ModListPage from '../mod/Components/ModListPage'
var Context = require('../ParamContext');

var ParaValuePage2 = React.createClass({
  getInitialState : function() {
      return {
          hide:'hidden',
          selectedRowKeys: [],
          groupUuid:'',
      }
  },

  handleModuleClick : function(mod,index){
    this.state.groupUuid = '';
    if( mod !== null ){
        this.setState({
            groupUuid: mod.uuid
        })
        this.refs.paraValuePage.loadParaValues( mod );
    }
  },

  render : function() {
      return (
        <div style={{backgroundColor:'#FEFEFE', width:'100%', height:'100%'}}>
          <ModListPage width='220px' caption='请选择模块' onSelectMod={record => {this.handleModuleClick(record)}} appUuid={Context.paramApp.uuid}>
              <div style={{paddingLeft: '16px', paddingRight: '16px'}}>
                  <ParamForm groupUuid={this.state.groupUuid} ref='paraValuePage'/>
              </div>
          </ModListPage>
        </div>);
    }
});

module.exports = ParaValuePage2;
