import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Input, Tooltip, Icon, Row, Col, Button, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import DictRadio from '../../../../lib/Components/DictRadio';

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Validator = require('../../../../public/script/common');

var FntModStore = require('../data/FntModStore.js');
var FntModActions = require('../action/FntModActions');
var Context = require('../../../AuthContext');

var CreateFntModPage = React.createClass({
    getInitialState : function() {
        return {
            fntModSet: {
                operation : '',
                errMsg : ''
            },

            loading: false,
            modal: false,
            fntMod: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(FntModStore, "onServiceComplete"), ModalForm('fntMod')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'create'){
            if( data.errMsg === ''){
                // 成功
                this.setState({
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    fntModSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'termType', desc:'终端类型', required: false, max: '24'},
            {id: 'modName', desc:'模块名称', required: true, max: '64'},
            {id: 'modCode', desc:'模块编号', required: true, max: '64'},
            {id: 'modDesc', desc:'模块说明', required: false, max: '1024'},
            {id: 'iconFile', desc:'图标', required: false, max: '128'},
        ];
    },

  clear : function(){
    this.state.hints = {};
    this.state.fntMod.termType='0';
	this.state.fntMod.modName='';
	this.state.fntMod.modCode='';
	this.state.fntMod.modDesc='';
	this.state.fntMod.iconFile='';
    this.state.fntMod.appUuid=Context.fntApp.uuid;

    this.state.loading = false;
    this.state.fntModSet.operation='';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      	this.refs.mxgBox.clear();
      }
  },

  onClickSave : function(){
      if(Validator.formValidator(this, this.state.fntMod)){
          this.state.fntModSet.operation = '';
          this.setState({loading: true});
          FntModActions.createFntAppMod( this.state.fntMod );
      }
  },

  render : function(){
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="增加模块" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['fnt_app_mod/create']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
         </div>
        ]}
      >
        <Form layout={layout}>
            <FormItem {...formItemLayout} label="模块编号" required={true} colon={true} className={layoutItem} help={hints.modCodeHint} validateStatus={hints.modCodeStatus}>
                <Input type="text" name="modCode" id="modCode" value={this.state.fntMod.modCode } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="模块名称" required={true} colon={true} className={layoutItem} help={hints.modNameHint} validateStatus={hints.modNameStatus}>
                <Input type="text" name="modName" id="modName" value={this.state.fntMod.modName } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="支持终端" required={false} colon={true} className={layoutItem} help={hints.termTypeHint} validateStatus={hints.termTypeStatus}>
                    <DictRadio name="termType" id="termType" onChange={this.onRadioChange} value={this.state.fntMod.termType} appName='项目管理' optName='支持终端' />
            </FormItem>
            <FormItem {...formItemLayout} label="图标" required={false} colon={true} className={layoutItem} help={hints.iconFileHint} validateStatus={hints.iconFileStatus}>
                <Input type="text" name="iconFile" id="iconFile" value={this.state.fntMod.iconFile } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="模块说明" required={false} colon={true} className={layoutItem} help={hints.modDescHint} validateStatus={hints.modDescStatus}>
                <Input type="textarea" name="modDesc" id="modDesc" value={this.state.fntMod.modDesc } onChange={this.handleOnChange} />
            </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default CreateFntModPage;
