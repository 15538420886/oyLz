import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Button, Icon, Input, DatePicker, Tabs, Col, Row, Spin, Upload } from 'antd';
const FormItem = Form.Item;

const TabPane = Tabs.TabPane;
import DictSelect from '../../../lib/Components/DictSelect';
var ResumeStore = require('../data/ResumeStore');
var ResumeActions = require('../action/ResumeActions');
var UploadResumePage = React.createClass({
	getInitialState : function() {
		return {
			loading: false,
			resume: {},
			resumeFile: null,
			hints: {},
			validRules: [],
			reqUuid:'',
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"),ModalForm('resume')],
	onServiceComplete: function(data) {
	  if( data.operation === 'upload'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  this.setState({loading: false});
		  }
	  };
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
        	
        ];
		this.initPage( this.props.resume );
	},
	
	initPage: function(resume){
		this.state.reqUuid = resume.uuid
	},
	beforeUpload: function(file) {
		this.state.resume.docFile = file.name;
		this.state.resume.reqUuid = this.state.reqUuid;	
		this.setState( {resumeFile: file} );
		return false;
	},

	onClickSave : function(salaryList){
		if(!Common.formValidator(this, this.state.resume)){
			return;
		};
        this.setState({ loading: true });
         ResumeActions.createResumeUpload(this.state.resume, this.state.resumeFile)
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
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

		var hints=this.state.hints;
		var form=(
			 <Form layout={layout} style={{margin:'12px 0 0 0'}}>
				<Row>
					<FormItem {...formItemLayout} label="姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
						<Input type="text" name="perName" id="perName" value={this.state.resume.perName } onChange={this.handleOnChange} />
					</FormItem>
				</Row>
				<Row>
					<FormItem {...formItemLayout} className={layoutItem} label='简历来源' required={true} colon={true} help={hints.channelHint} validateStatus={hints.channelStatus}>
            		    <DictSelect name='channel' id='channel' appName='简历系统' optName='简历来源' value={this.state.resume.channel} onSelect={this.handleOnSelected.bind(this, 'channel')} />
                    </FormItem>

				</Row>
				<Row>
					<FormItem {...formItemLayout} className={layoutItem} label='文件类型' required={true} colon={true} help={hints.fileTypeHint} validateStatus={hints.fileTypeStatus}>
            		    <DictSelect name='fileType' id='fileType' appName='简历系统' optName='简历文件来源' value={this.state.resume.fileType} onSelect={this.handleOnSelected.bind(this, 'fileType')} />
                    </FormItem>
				</Row>
				
				
				<Row>
					<FormItem {...formItemLayout} label="人员文件" required={true} colon={true} className={layoutItem} help={hints.salaryFileHint} validateStatus={hints.salaryFileStatus}>
						<Col span="19">
							<Input type="text" name="docFile" id="docFile" value={this.state.resume.docFile} readOnly={true}/>
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
                    <TabPane tab="上传简历" key="2" style={{width: '100%', height: '100%'}}>
                      <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                        <div style={{padding:"8px",height: '100%',overflowY: 'auto'}} >
                          <div style={{width:'100%', maxWidth:'600px'}}>
				        	<ServiceMsg ref='mxgBox' svcList={['hr-resume-log/upload']}/>
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


module.exports = UploadResumePage;
