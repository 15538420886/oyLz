'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';

import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';
var Utils = require('../../public/script/utils');
 
var LogoutPage = React.createClass({
    getInitialState : function() {
        return {
            loading: false,
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },

    render : function() {
        return (
	      <div className='grid-page'>
	        用户签退
	      </div>
        );
    }
});

module.exports = LogoutPage;
