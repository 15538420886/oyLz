import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var InnRoomStore = require('../data/InnRoomStore.js');
var InnRoomActions = require('../action/InnRoomActions');

var CreateInnRoomPage = React.createClass({
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

    mixins: [Reflux.listenTo(InnRoomStore, "onServiceComplete"), ModalForm('room')],
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
          {id: 'seatRows', desc:'工位行数', required: true, dataType:'int', max: 3},
          {id: 'seatCols', desc:'工位列数', required: true, dataType:'int', max: 3}
		];
	},

	clear : function(seatUuid, roomCode){
		this.state.hints = {};
		this.state.room.corpUuid='N/A';
		this.state.room.roomCode='H'+roomCode;
		this.state.room.floor='';
		this.state.room.manager='';
		this.state.room.seatRows='';
		this.state.room.seatCols='';
		this.state.room.buildUuid = seatUuid;

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
			InnRoomActions.createHrRoom( this.state.room );
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
					<ServiceMsg ref='mxgBox' svcList={['inn-room/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="工位行" colon={true} className={layoutItem} help={hints.seatRowsHint} validateStatus={hints.seatRowsStatus}>
						<Input type="text" name="seatRows" id="seatRows" value={this.state.room.seatRows} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工位列" colon={true} className={layoutItem} help={hints.seatColsHint} validateStatus={hints.seatColsStatus}>
						<Input type="text" name="seatCols" id="seatCols" value={this.state.room.seatCols} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateInnRoomPage;
