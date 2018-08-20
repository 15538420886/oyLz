import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker, Col } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateHonorPage = React.createClass({
	getInitialState : function() {
		return {
			honorSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			honor: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('honor')],
	onServiceComplete: function(data) {
		if(data.resource==='honorList' && (data.operation === 'create' || data.operation === 'update')){
			if( data.errMsg === ''){
				this.state.btnOpen=false;
				this.clear();
			}

			this.setState({loading: false});
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.clear();
		this.state.validRules = [
          {id: 'schName', desc:'学校', required: true, max: 128},
          {id: 'hoLevel', desc:'奖学金',required: true, max: 32},
          {id: 'hoLevel2', desc:'等级',required: true, max: 20},
          {id: 'endDate', desc:'时间',required: true, max: 24},
          {id: 'hoDesc', desc:'说明',required: false, max: 256}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.honorSet.operation='';
		this.state.honor.schName='';
		this.state.honor.hoLevel='国家级';
		this.state.honor.hoLevel2='一等奖学金';
		this.state.honor.endDate='';
		this.state.honor.hoDesc='';
	},
	initPage: function(honor)
	{
		this.state.hints = {};
		Utils.copyValue(honor, this.state.honor);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.honor)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateHonor( this.state.honor );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.honor)){
			this.setState({loading: true});
			ResumeActions.addHonor( this.state.honor );
		}
	},
	onClickBack:function(){
		browserHistory.push({
			pathname: '/resume2/PreviewPage/',
        });
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};

		var hints=this.state.hints;
		return (
            <div className='resume-form'>
		   		<Form layout={layout}>
		   			<FormItem {...formItemLayout} required={true} label="学校" colon={true} className={layoutItem} help={hints.schNameHint} validateStatus={hints.schNameStatus}>
						<Input type="text" name="schName" id="schName" value={this.state.honor.schName} onChange={this.handleOnChange} />
					</FormItem>

					<FormItem {...formItemLayout} required={true} label="奖学金" colon={true} className={layoutItem}>
						<Col span="12">
							<FormItem help={hints.hoLevelHint} validateStatus={hints.hoLevelStatus}>
								<DictSelect name="hoLevel" id="hoLevel" value={this.state.honor.hoLevel}  appName='简历系统' optName='奖学金' onSelect={this.handleOnSelected.bind(this, "hoLevel")} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem help={hints.hoLevel2Hint} validateStatus={hints.hoLevel2Status} >
								<DictSelect name="hoLevel2" id="hoLevel2" value={this.state.honor.hoLevel2}  appName='简历系统' optName='等级' onSelect={this.handleOnSelected.bind(this, "hoLevel2")}/>
							</FormItem >
						</Col>
					</FormItem>

					<FormItem  {...formItemLayout} label="时间" required={true} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
					    <MonthPicker name="endDate" id="endDate"  value={this.formatMonth(this.state.honor.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
					</FormItem>
					<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.hoDescHint} validateStatus={hints.hoDescStatus}>
						<Input type="textarea" name="hoDesc" id="hoDesc" value={this.state.honor.hoDesc} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['honorList/create', 'honorList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack"  size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreateHonorPage;
