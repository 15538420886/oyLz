'use strict';

﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Input, Button} from 'antd';
const FormItem = Form.Item;

var InputCode = React.createClass({
  getInitialState : function() {
      return {
  	      modal: false,
  	      input: {}
      }
  },

  handleClose: function () {
        this.setState({
            modal: false
        });
  },
	handleOpen: function (selRows,mark) {
		if(mark==='inForm'){
			this.state.input = `
===================================有效规则=======================================
this.state.validRules = [
${selRows.map((fiel,k)=>{
              return `#\t{id: '${fiel.fieldName}', desc:'${fiel.fieldDesc}', required: ${fiel.notNull}, max: '${fiel.fieldLength}'},
`
            })}];

===================================初始化=======================================

\tthis.state.hints = {};
${selRows.map((fiel,k)=>{
          return `#\tthis.state.****.${fiel.fieldName}='';
`
          })}

===================================表单=======================================

<Form layout={layout}>
${selRows.map((fiel,k)=>{
      return `#\t<FormItem {...formItemLayout} label="${fiel.fieldDesc}" required={true} colon={true} className={layoutItem} help={hints.${fiel.fieldName}Hint} validateStatus={hints.${fiel.fieldName}Status}>
\t\t<Input type="text" name="${fiel.fieldName}" id="${fiel.fieldName}" value={this.state.****.${fiel.fieldName} } onChange={this.handleOnChange} />
\t</FormItem>
`})}
</Form>


`.replace(/,#/g,"").replace(/#/g,"")


      }else if(mark==='inTable'){
        	this.state.input = `
        		const columns = [
        		${selRows.map((fiel,k)=>{
      		return `{
            		    title: '${fiel.fieldDesc}',
            		    dataIndex: '${fiel.fieldName}',
            		    key: '${fiel.fieldName}',
            		    width: 140,
      		        },
      		        `
        			})}]`.replace(/ ,/g,"")
      }
	    this.setState({
	        modal: true
	    });
	},

  render : function() {
    var sourceCode = this.state.input;
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };
    return (
      <Modal visible={this.state.modal} width='850px' title="源代码" maskClosable={false} onOk={this.handleClose} onCancel={this.handleClose}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <Button key="btnClose" size="large" onClick={this.handleClose}>关闭</Button>
          </div>
      	]}>   
          <Input type="textarea" name="indexDesc" id="indexDesc" value={sourceCode} style={{height:'380px'}} />
      </Modal>
    );
  }
});

export default InputCode;
