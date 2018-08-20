import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

var RoomStore = require('../data/RoomStore.js');
var RoomActions = require('../action/RoomActions');

var CreateRoomPage = React.createClass({
	getInitialState : function() {
		return {
			roomSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			room: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(RoomStore, "onServiceComplete"), ModalForm('room')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'create'){
            if( data.errMsg === ''){
                // 成功
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    roomSet: data
                });
            }
        }
    },
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
          {id: 'roomCode', desc:'房间编号', required: true, max: 64},
          {id: 'floor', desc:'楼层', max: 12},
          { id: 'manager', desc: '城市', required: true, max: 24},
          {id: 'seatRows', desc:'工位行数', required: true, dataType:'int', max: 3},
          {id: 'seatCols', desc:'工位列数', required: true, dataType:'int', max: 3}
		];
	},

	clear : function(buildUuid){
		this.state.hints = {};
		this.state.room.corpUuid='N/A';
		this.state.room.roomCode='';
		this.state.room.floor='';
		this.state.room.manager='';
		this.state.room.seatRows='';
		this.state.room.seatCols='';
		this.state.room.buildUuid = buildUuid;

	    this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	      this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		var isValid = false;
		if(Validator.validator(this, this.state.room)){
			var tt = parseInt(this.state.room.seatRows) * parseInt(this.state.room.seatCols);
			if(tt === 0){
				Validator.setError(this, 'seatCols', '工位数必须大于0');
			}
			else if(tt > 2000){
				Validator.setError(this, 'seatCols', '工位数必须小于2000');
			}
			else{
				isValid = true;
			}
		}

		if(isValid){
			this.setState({loading: true});
			RoomActions.createHrRoom( this.state.room );
		}
		else{
			this.setState({
				hint: this.state.hint
			});
		}
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
			<Modal visible={this.state.modal} width='540px' title="增加房间" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-room/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <FormItem {...formItemLayout} label="房间号" required={true} colon={true} className={layoutItem} help={hints.roomCodeHint} validateStatus={hints.roomCodeStatus}>
						<Input type="text" name="roomCode" id="roomCode" value={this.state.room.roomCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="楼层" colon={true} className={layoutItem} help={hints.floorHint} validateStatus={hints.floorStatus}>
						<Input type="text" name="floor" id="floor" value={this.state.room.floor} onChange={this.handleOnChange}/>
					</FormItem>
                    <FormItem {...formItemLayout} label="城市" required={true} colon={true} className={layoutItem} help={hints.managerHint} validateStatus={hints.managerStatus}>
						<Input type="text" name="manager" id="manager" value={this.state.room.manager} onChange={this.handleOnChange}/>
					</FormItem>
                    <FormItem {...formItemLayout} label="工位" colon={true} className={layoutItem}>
                        <Col span="8">
                            <FormItem help={hints.seatRowsHint} validateStatus={hints.seatRowsStatus}>
                                <InputGroup compact>
                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="行" readOnly={true} />
                                    <Input style={{ width: '70%', textAlign: 'center' }} type="text" name="seatRows" id="seatRows" value={this.state.room.seatRows} onChange={this.handleOnChange} />
                                </InputGroup>
                            </FormItem>
                        </Col>
                        <Col span="1">
                        </Col>
                        <Col span="8">
                            <FormItem help={hints.seatColsHint} validateStatus={hints.seatColsStatus}>
                                <InputGroup compact>
                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="列" readOnly={true} />
                                    <Input style={{ width: '70%', textAlign: 'center' }} type="text" name="seatCols" id="seatCols" value={this.state.room.seatCols} onChange={this.handleOnChange} />
                                </InputGroup>
                            </FormItem>
                        </Col>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateRoomPage;
