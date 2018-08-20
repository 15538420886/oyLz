import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

var HolidayStore = require('../data/HolidayStore.js');
var HolidayActions = require('../action/HolidayActions');

var CreateHolidayPage = React.createClass({
	getInitialState : function() {
		return {
			holidaySet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
            modal: false,
            hints: {},
            validRules: [],

            year: this.props.year,
            holiday: {},
            holidayMap: this.props.holidayMap,
		}
	},

	mixins: [Reflux.listenTo(HolidayStore, "onServiceComplete"), ModalForm('holiday')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.setState({
				  loading: false,
				  modal: false
			  });
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  holidaySet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
	},
    componentWillReceiveProps: function(newProps){
        this.setState({holidayMap:newProps.holidayMap, year:newProps.year})
    },
	
	initPage: function(holiday)
    {
        var flag = this.state.holidayMap[holiday];
        if (flag !== '1' && flag !== '2') {
            flag = '0';
        }

        this.state.hints = {};
        this.state.holiday = { date: holiday, flag: flag};
        
		this.state.loading = false;
		this.state.holidaySet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
        var holiday = this.state.holiday;

        var flag = this.state.holidayMap[holiday.date];
        if (flag !== '1' && flag !== '2') {
            flag = '0';
        }

        if (flag === holiday.flag) {
            this.setState({
                modal: false
            });
        }

        var holidayMap = this.state.holidayMap;
        holidayMap[holiday.date] = holiday.flag;

        var holidaySet = [];
        for (var tDate in holidayMap) {
            var flag = holidayMap[tDate];
            if (flag === '1' || flag === '2') {
                holidaySet.push({ date: tDate, flag: flag });
            }
        }

        //发送请求
		var obj = {
			"year":this.state.year,
			"holidayList":holidaySet
        }
		this.setState({
			loading: true
		});

		HolidayActions.createHoliday( obj );
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改节假日信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['holiday/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="假日类型" colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                        <RadioGroup id='flag' name='flag' value={this.state.holiday.flag} onChange={this.onRadioChange}>
                            <Radio id='flag' name='flag' key='0' style={{display: 'inline-block',height: '30px',lineHeight: '30px',}} value='0'>工作日</Radio>
                            <Radio id='flag' name='flag' key='1' style={{display: 'inline-block',height: '30px',lineHeight: '30px',}} value='1'>周末</Radio>
                            <Radio id='flag' name='flag' key='2' style={{display: 'inline-block',height: '30px',lineHeight: '30px',}} value='2'>节假日</Radio>
                        </RadioGroup>
                    </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateHolidayPage;