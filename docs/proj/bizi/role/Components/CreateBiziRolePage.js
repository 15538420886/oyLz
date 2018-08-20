import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import AntUtil from '../../../lib/AntUtil';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Tabs, Col, Row } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
var Fields = require('./BiziRoleFields');
var BiziRoleStore = require('../data/BiziRoleStore');
var BiziRoleActions = require('../action/BiziRoleActions');
var ProjContext = require('../../../ProjContext');

var CreateBiziRolePage = React.createClass({
	getInitialState : function() {
		return {
			projRoleSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			user:'',
			projRole: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(BiziRoleStore, "onServiceComplete"), ModalForm('projRole'), AntUtil('projRole')],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              projRoleSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			Fields.roleName,
			Fields.staffCode,
			Fields.perName,
			Fields.beginDate,
			Fields.endDate
		];
		this.clear();
	},

	clear : function(){
		this.state.hints = {};
		this.state.projRole.corpUuid = window.loginData.compUser.corpUuid;
		this.state.projRole.projUuid = ProjContext.selectedBiziProj.uuid;

		this.state.projRole.roleName='助理';
		this.state.projRole.staffCode='';
		this.state.projRole.perName='';
		this.state.projRole.beginDate='';
		this.state.projRole.endDate='';

		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onSelectProjRole:function(data){
        this.state.projRole.memo2 = data.deptName;
		this.state.projRole.staffCode = data.staffCode;
        this.state.projRole.perName = data.perName;
        this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projRole)){
			this.setState({loading: true});
			BiziRoleActions.createBiziProjRole( this.state.projRole );
		}
	},

	goBack:function(){
        this.props.onBack();
    },
	onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
			className: layoutItem,
		};

		var hints=this.state.hints;
		var boo = this.state.projRole.perName? false : true ;
        var projUuid = ProjContext.selectedBiziProj.uuid;
		if(this.state.projRole.roleName === undefined){
			this.state.projRole.roleName = '助理';
		}
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="增加管理人员" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"20px 0 16px 0px", height: '100%',overflowY: 'auto'}}>
							<ServiceMsg ref='mxgBox' svcList={['bizi-proj-role/create']}/>
							<Form layout={layout} style={{width:'500px'}}>
                                {this.getField(Fields.roleName, formItemLayout)}
                                <FormItem {...formItemLayout} label="姓名" required={true} colon={true} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <SearchEmployee projUuid={projUuid} ref='empSearchBox' name="perName" id="perName" value={this.state.projRole.perName} onSelectEmpLoyee={this.onSelectProjRole} />
                                </FormItem>
								{this.getField(Fields.beginDate, formItemLayout)}
								{this.getField(Fields.endDate, formItemLayout)}
								<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
									<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
								</FormItem>
							</Form>
						</div>
					</TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default CreateBiziRolePage;
