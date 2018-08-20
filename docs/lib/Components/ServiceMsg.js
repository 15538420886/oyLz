import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var MsgActions = require('../action/MsgActions');
var MsgStore = require('../data/MsgStore');

const propTypes = {
	svcList: React.PropTypes.array
};

var ServiceMsg = React.createClass({
	getInitialState : function(){
	  return {
	  	svcMsg: {
			resName: '',
			operation: '',
			errMsg: ''
		},
		hints: []
	  }
	},
    mixins: [Reflux.listenTo(MsgStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.errMsg.indexOf('[AUTH09]') >= 0){
			// 超时，重新登入
			window.sessionStorage.removeItem('loginData');
		}

        this.setState({
            svcMsg: data
        });
    },

	componentDidMount : function(){
		this.clear();
	},
	clear: function(){
		this.state.hints = [];
		var len = this.props.svcList.length;
  		for(var i=0; i<len; i++){
  			this.state.hints.push('');
  		}
    },
    showError: function (errMsg) {
        var hints = this.state.hints;
        var len = hints.length;
        if (len > 0) {
            hints[0] = errMsg;
        }

        this.setState({
            hints: hints
        });
    },
	onClose: function(){
		var hints = this.state.hints;
		var len=hints.length;
  		for(var i=0; i<len; i++){
  			hints[i] = '';
  		}

		this.setState({
			hints: hints
		});
	},

  render : function() {
  	var svcMsg = this.state.svcMsg;
  	if(svcMsg != null && svcMsg.operation !== null && svcMsg.operation !== ''){
  		var name = svcMsg.resName+'/'+svcMsg.operation;
  		var len = this.props.svcList.length;
  		for(var i=0; i<len; i++){
  			if(this.props.svcList[i] === name){
  				this.state.hints[i] = svcMsg.errMsg;
  				break;
  			}
  		}

  		this.state.svcMsg = null;
  	}

  	var message = '';
	var len=this.state.hints.length;
	for(var i=0; i<len; i++){
		message = this.state.hints[i];
		if(message !== null && message !== ''){
			break;
		}
	}

  	if(message === ''){
  		return null;
  	}

    return (
    	<div data-show="true" className="ant-alert ant-alert-error" style={{textAlign: 'left'}}>
			<i className="anticon anticon-cross-circle ant-alert-icon"></i>
			<span className="ant-alert-message">{message}</span>
			<span className="ant-alert-description"></span>
			<a className="ant-alert-close-icon" onClick={this.onClose}><i className="anticon anticon-cross"></i></a>
		</div>
    );
  }
});

ServiceMsg.propTypes = propTypes;
module.exports = ServiceMsg;
