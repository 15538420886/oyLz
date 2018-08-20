import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');

import { Form, Modal, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var DeptStore = require('../data/DeptStore.js');
var DeptActions = require('../action/DeptActions');

var CreateDeptPage = React.createClass({
    getInitialState : function() {
      return {
        deptSet: {
            operation : '',
            errMsg : ''
        },

        loading: false,
	      modal: false,
	      dept: {},
          hints: {},
          validRules: []
      }
  },

  // 第一次加载
  componentDidMount : function(){
      this.state.validRules = [
          {id: 'deptCode', desc:'部门编号', required: true, max: 64},
          {id: 'deptName', desc:'部门名称', max: 128},
          {id: 'deptDesc', desc:'部门描述', max: 512}
      ];
  },

  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },

  clear : function(corpUuid, puuid){
    this.state.hints = {};
    this.state.dept.deptCode='';
    this.state.dept.deptName='';
    this.state.dept.deptDesc='';
    this.state.dept.corpUuid = corpUuid;
    this.state.dept.puuid = puuid;

    this.state.loading = false;
    this.state.deptSet.operation='';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
    	this.refs.mxgBox.clear();
    }
  },

  handleOnChange : function(e) {
      var dept = this.state.dept;
      dept[e.target.id] = e.target.value;
      Validator.validator(this, dept, e.target.id);
      this.setState({
        dept: dept
      });
  },

  onClickSave : function(){
      if(Validator.formValidator(this, this.state.dept)){
          this.state.deptSet.operation = '';
          this.setState({loading: true});
          DeptActions.createAuthDept( this.state.dept );
      }
  },

  render : function(){
  	if(this.state.modal && this.state.deptSet.operation === 'create'){
	  	if(this.state.deptSet.errMsg === ''){
			this.state.modal = false;
            return null;
		}
  	}

    if( this.state.loading ){
        if(this.state.deptSet.operation === 'create'){
            this.state.loading = false;
        }
    }

    var layout='vertical';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="增加部门" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['auth-dept/create']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
         </div>
        ]}
      >
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="部门代码" required={true} colon={true} className={layoutItem} help={hints.deptCodeHint} validateStatus={hints.deptCodeStatus}>
              <Input type="text" name="deptCode" id="deptCode" value={this.state.dept.deptCode} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="部门名称" colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
              <Input type="text" name="deptName" id="deptName" value={this.state.dept.deptName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="部门描述" colon={true} className={layoutItem} help={hints.deptDescHint} validateStatus={hints.deptDescStatus}>
              <Input type="textarea" name="deptDesc" id="deptDesc" value={this.state.dept.deptDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

ReactMixin.onClass(CreateDeptPage, Reflux.connect(DeptStore, 'deptSet'));
export default CreateDeptPage;
