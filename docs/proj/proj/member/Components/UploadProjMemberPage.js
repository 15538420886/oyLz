import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import XlsTempFile from '../../../../lib/Components/XlsTempFile';
import XlsConfig from '../../../lib/XlsConfig';
import { Form, Button, Icon, Input, DatePicker, Tabs, Col, Row, Spin, Upload } from 'antd';
const FormItem = Form.Item;
const { MonthPicker} = DatePicker;
const TabPane = Tabs.TabPane;

import SearchProjDisp from '../../../lib/Components/SearchProjDisp'
var ProjContext = require('../../../ProjContext');

var UploadProjMemberPage = React.createClass({
	getInitialState : function() {
		return {
			projMember:{},
			file:{},
			user:{},
			loading: false,
			hints: {},
			validRules: []
		}
	},

	mixins: [ModalForm('projMember'),XlsTempFile()],
	// 第一次加载
	componentDidMount : function(){
        this.state.validRules = [
            {id: 'beginDate', desc:'入组日期', required: true, max:'24'},
            {id: 'beginTime', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];
       
        this.clear();
		this.initPage();
	},

	componentWillReceiveProps:function(newProps){
		 this.clear();
	},
	
	initPage: function(){
		this.setState( {loading:false, hints:{}} );
		if(  typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	clear : function(){
		this.state.hints = {};
		this.state.projMember.corpUuid = window.loginData.compUser.corpUuid;
		this.state.file='';
		this.state.projMember.applyTime="";
        this.state.projMember.projUuid="";
        this.state.projMember.projName="";
        this.state.projMember.projLoc="";
		this.state.projMember.dispatcher='';
		this.state.projMember.beginDate=''+Common.getToday();
		this.state.projMember.beginTime = '09:00';

		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	uploadComplete: function(errMsg){
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }else{
        	this.goBack();
        }
    },
    beforeUpload: function(file) {
    	var beginDate= this.state.projMember.beginDate;
    	var beginTime=this.state.projMember.beginTime;
        var data={
        	corpUuid: window.loginData.compUser.corpUuid,
        	applyTime:beginDate,
        	projUuid:ProjContext.selectedProj.uuid,
        	projName:ProjContext.selectedProj.projName,
            projLoc: ProjContext.selectedProj.projLoc,
            grpUuid: ProjContext.selectedProj.parentUuid,
        	beginDate:beginDate,
        	beginTime:beginTime,
        	projMemberFile:file.name,
        	dispUuid:this.state.user.dispUuid,
        	dispCode:this.state.user.dispCode,
        	dispatcher:this.state.user.dispatcher,
        };
        this.setState({
        	file:file,
        	projMember:data,
        }); 
        return false;
    },
	

	onClickSave : function(salaryList){
		if(!Common.formValidator(this, this.state.projMember)){
			return;
		}

        this.setState({ loading: true });
        var url = Utils.projUrl+'proj-member/upload-xls';
        var data=this.state.projMember;
        var file=this.state.file;
        this.uploadXlsFile(url, data, XlsConfig.projMemberFields, file, this.uploadComplete);
        return false;
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },
    onSelectDisp:function(data){
    	var dispatcher=data.dispatcher;
    	this.state.projMember.dispatcher=data.dispatcher;
    	this.refs.dispSearchBox.setValue(data.dispatcher);
    	this.setState({ user: data });
    },

	render : function() { 
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		var corpUuid = window.loginData.compUser.corpUuid;
		var projUuid=ProjContext.selectedProj.uuid;
		var hints=this.state.hints;
		var form=(
			 <Form layout={layout} style={{margin:'12px 0 0 0'}}>
				<Row>
				 	<Col span="12">
				    <FormItem {...formItemLayout2} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                            <DatePicker style={{width:'100%'}} name="beginDate" id="beginDate" format={Common.dateFormat} value={this.formatDate(this.state.projMember.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
                    </FormItem>  
                    </Col>      
                </Row>
                <Row>
                	<Col span="12">
                	<FormItem {...formItemLayout2} label="入组时间" required={true} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                            <Input type="text" name="beginTime" id="beginTime" value={this.state.projMember.beginTime} onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>    
                </Row>
				<Row>
					<FormItem {...formItemLayout} label="人员文件" required={true} colon={true} className={layoutItem} help={hints.salaryFileHint} validateStatus={hints.salaryFileStatus}>
						<Col span="19">
							<Input type="text" name="projMemberFile" id="projMemberFile" value={this.state.projMember.projMemberFile} readOnly={true}/>
						</Col>
						<Col span="5">
							<Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{width: '100%'}}>
								<Button icon="upload" style={{width: '100%', marginLeft: '4px'}}>选择文件</Button>
							</Upload>
						</Col>
					</FormItem>
				</Row>
				<Row>
					<FormItem style={{textAlign:'right',margin:'12px 0'}} className={layoutItem}>
						<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>上传文件</Button>
						<Button key="btnClose" size="large" onClick={this.goBack} style={{margin: '0 0 0 12px'}}>取消</Button>
					</FormItem>
				</Row>
			</Form>
		);

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onTabClick={this.goBack}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="上传人员文件" key="2" style={{width: '100%', height: '100%'}}>
                      <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                        <div style={{padding:"8px",height: '100%',overflowY: 'auto'}} >
                          <div style={{width:'100%', maxWidth:'600px'}}>
				        	{form}
						  </div>
						</div>
					  </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default UploadProjMemberPage;