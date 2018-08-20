import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

var SeatStore = require('../data/SeatStore.js');
var SeatActions = require('../action/SeatActions');

var UpdateSeatPage = React.createClass({
	getInitialState : function() {
		return {
			seatSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			seat: {},
			hints: {},
			validRules: []
		}
	},
      mixins: [Reflux.listenTo(SeatStore, "onServiceComplete"), ModalForm('seat')],
      onServiceComplete: function(data) {
          if(this.state.modal && (data.operation === 'update' || data.operation === 'remove')){
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
                      seatSet: data
                  });
              }
          }
      },

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
          {id: 'seatCode', desc:'工位编号', required: true, max: 256},
          {id: 'seatType', desc:'工位类型', required: true, max: 32},
          {id: 'rowSpan', desc:'行数', required: true, dataType:'int', max: 3},
          {id: 'colSpan', desc:'列数', required: true, dataType:'int', max: 3},
          {id: 'seatDesc', desc:'工位说明', max: 256}
		];
	},

	initPage: function(seat)
	{
		this.state.hints = {};
		Utils.copyValue(seat, this.state.seat);

		this.state.loading = false;
        this.state.seatSet.operation='';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.seat)){
			this.state.seatSet.operation = '';
			this.setState({loading: true});
			SeatActions.updateHrSeat( this.state.seat );
		}
	},
	onClickDelete: function(){
		this.setState({loading: true});
		SeatActions.deleteHrSeat( this.state.seat.uuid );
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
	        <Modal visible={this.state.modal} width='540px' title="修改工位信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	          footer={[
	          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-seat/update']}/>
	           		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
	           		<Button key="btnDelete" type="danger" size="large" onClick={this.onClickDelete} loading={this.state.loading}>删除</Button>{' '}
	           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	           </div>
	          ]}
	        >
	       		<Form layout={layout}>
					<FormItem {...formItemLayout} label="工位编号" colon={true} className={layoutItem} help={hints.seatCodeHint} validateStatus={hints.seatCodeStatus}>
						<Input type="text" name="seatCode" id="seatCode" value={this.state.seat.seatCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工位类型" colon={true} className={layoutItem} help={hints.seatTypeHint} validateStatus={hints.seatTypeStatus}>
						<DictSelect name="seatType" id="seatType" value={this.state.seat.seatType} appName='考勤系统' optName='工位类型' onSelect={this.handleOnSelected.bind(this, "seatType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="坐标" colon={true} className={layoutItem} help={hints.seatPosHint} validateStatus={hints.seatPosStatus}>
						<Input type="text" name="seatPos" id="seatPos" value={this.state.seat.seatPos} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="位置" colon={true} className={layoutItem}>
						<Col span="8">
							<FormItem className={layoutItem} help={hints.rowIndexHint} validateStatus={hints.rowIndexStatus}>
								<InputGroup compact>
									<Input style={{ width:'35%',textAlign:'center'}} defaultValue="行" readOnly={true}/>
									<Input style={{ width:'65%',textAlign:'center'}} type="text" name="rowIndex" id="rowIndex"  value={this.state.seat.rowIndex} onChange={this.handleOnChange}/>
								</InputGroup>
							</FormItem>
						</Col>
						<Col span="3">
						</Col>
						<Col span="8">
							<FormItem help={hints.colIndexHint} validateStatus={hints.colIndexStatus}>
								<InputGroup compact>
									<Input style={{ width:'35%',textAlign:'center'}} defaultValue="列" readOnly={true}/>
									<Input style={{ width:'65%',textAlign:'center'}} type="text" name="colIndex" id="colIndex" value={this.state.seat.colIndex} onChange={this.handleOnChange}/>		
								</InputGroup>
							</FormItem>
						</Col>
					</FormItem>
					<FormItem {...formItemLayout} label="大小" colon={true} className={layoutItem}>
						<Col span="8">
							<FormItem help={hints.rowSpanHint} validateStatus={hints.rowSpanStatus}>
								<InputGroup compact>
									<Input style={{ width:'35%',textAlign:'center'}} defaultValue="行高" readOnly={true}/>
									<Input style={{ width:'65%',textAlign:'center'}} type="text" name="rowSpan" id="rowSpan" value={this.state.seat.rowSpan} onChange={this.handleOnChange}/>
								</InputGroup>
							</FormItem>
						</Col>
						<Col span="3">
						</Col>
						<Col span="8">
							<FormItem className={layoutItem} help={hints.colSpanHint} validateStatus={hints.colSpanStatus}>
								<InputGroup compact>
									<Input style={{ width:'35%',textAlign:'center'}} defaultValue="列宽" readOnly={true}/>
									<Input style={{ width:'65%',textAlign:'center'}} type="text" name="colSpan" id="colSpan" value={this.state.seat.colSpan} onChange={this.handleOnChange}/>
								</InputGroup>
							</FormItem>
						</Col>
					</FormItem>
					<FormItem {...formItemLayout} label="工位说明" colon={true} className={layoutItem} help={hints.seatDescHint} validateStatus={hints.seatDescStatus}>
						<Input type="textarea" name="seatDesc" id="seatDesc" value={this.state.seat.seatDesc} onChange={this.handleOnChange} style={{height:'80px'}}/>
					</FormItem>
	        	</Form>
	        </Modal>
	    );
	}
});

export default UpdateSeatPage;
