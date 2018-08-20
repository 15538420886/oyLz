import React from 'react';

const propTypes = {
	toggle: React.PropTypes.func,
	message: React.PropTypes.string
};

var ErrorMsg = React.createClass({
  getInitialState : function(){
      return {
      }
  },
  
  onClose: function(collapsed){
    this.props.toggle();
  },
  
  render : function() {
  	if(this.props.message === ''){
  		return null;
  	}
  	
    return (
    	<div data-show="true" className="ant-alert ant-alert-error" style={{textAlign: 'left'}}>
			<i className="anticon anticon-cross-circle ant-alert-icon"></i>
			<span className="ant-alert-message">{this.props.message}</span>
			<span className="ant-alert-description"></span>
			{(typeof(this.props.toggle)!="undefined") ? <a className="ant-alert-close-icon" onClick={this.onClose}><i className="anticon anticon-cross"></i></a> : ''}
		</div>
    );
  }
});

ErrorMsg.propTypes = propTypes;
module.exports = ErrorMsg;


