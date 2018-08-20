'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin, Upload} from 'antd';
import FileRequest from '../../../lib/Components/FileRequest';

var Utils = require('../../../public/script/utils');
var InnSeatStore = require('../data/InnSeatStore.js');
var InnSeatActions = require('../action/InnSeatActions');
var InnRoomStore = require('../data/InnRoomStore.js');
var InnRoomActions = require('../action/InnRoomActions');

import CreateInnSeatPage from './CreateInnSeatPage';
import UpdateInnSeatPage from './UpdateInnSeatPage';
import CreateInnRoomPage from './CreateInnRoomPage';
import UpdateInnRoomPage from './UpdateInnRoomPage';


var InSeatTable = React.createClass({
	getInitialState : function() {
		return {
			seatSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			roomLoading: false,
            innRoom: null,
            seatUuid: '',
			
			seatLoading: false,
			seatRows: [],
			
			imageLoading: false,
			previewVisible: false,
			previewImage: null,
		}
	},
    mixins: [Reflux.listenTo(InnSeatStore, "onServiceComplete"), Reflux.listenTo(InnRoomStore, "onRoomComplete")],
    onServiceComplete: function(data) {
    	// 生成工位的坐标
    	this.state.seatRows = this.preSeatMap(data.recordSet);
    	
        this.setState({
            seatLoading: false,
            seatSet: data
        });
    },
    onRoomComplete: function (data) {
    	if(data.errMsg === '' && data.innRoom !== null){
    		if(data.operation === 'update-image'){
		        this.setState({
		            imageLoading: false,
		        });
    		}
            else {
		        this.setState({
		            roomLoading: false,
		            imageLoading: false,
		            seatLoading: true,
		            innRoom: data.innRoom
		        });

		        InnSeatActions.initHrSeat(data.innRoom.uuid);
		    }
    	}
    	else{
	        this.setState({
	            roomLoading: false,
	            imageLoading: false,
	            innRoom: data.innRoom
	        });
	    }
    },

	// 第一次加载
	componentDidMount : function(){
        var seat = this.props.seat;
        this.setState({ roomLoading: true, seatUuid: seat.uuid });
		InnRoomActions.initHrRoom(seat.uuid);
    },
    componentWillReceiveProps: function (newProps) {
        if (this.state.seatUuid !== newProps.seat.uuid) {
            var seat = newProps.seat;
            this.setState({ roomLoading: true, seatUuid: seat.uuid });
            InnRoomActions.initHrRoom(seat.uuid);
        }
    },

	handleOpenCreateWindow : function(rowIndex, colIndex, event) {
		var room = this.state.innRoom;
		this.refs.createWindow.clear(room.uuid, rowIndex, colIndex);
		this.refs.createWindow.toggle();
	},
	onClickUpdate : function(seat, event)
	{
		if(seat != null){
			this.refs.updateWindow.initPage(seat);
			this.refs.updateWindow.toggle();
		}
	},
	handleCreateRoom: function(){
		var seat = this.props.seat;
		this.refs.createInnRoom.clear(seat.uuid, seat.seatCode);
		this.refs.createInnRoom.toggle();
	},
	handleUpdateRoom: function(){
		var room = this.state.innRoom;
		this.refs.updateInnRoom.initPage( room );
		this.refs.updateInnRoom.toggle();
	},
	downloadQRCode: function(){
		var room = this.state.innRoom;
		var url = Utils.campUrl+'hr-seat/down-qrcode?roomUuid='+room.uuid;
        window.location.href = Utils.fmtGetUrl(url);
	},
	
	beforeUpload: function(file) {
		const isImage = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/png');
		if(!isImage){
			alert('请选择图片文件');
			return false;
		}
		
		return true;
	},
	onRemoveImage: function(file) {
		this.setState({imageLoading: true});
		InnRoomActions.deleteImage( file.uid );
		return true;
	},
	onPreviewImage: function(file) {
		this.setState({
			previewImage: file.url,
			previewVisible: true,
		});
	},
	onUploadImage: function(room, result){
		if(result.errCode === null || result.errCode === '' || result.errCode === '000000'){
			room.image = result.object;
			this.setState({loading: this.state.loading})
		}
	},
	handleCancel: function(){
		this.setState({ previewVisible: false })
	},
	
	preSeatMap: function(recordSet){
		var room = this.state.innRoom;
		
		var seatMap = {};
		recordSet.map((node, i) => {
            var pos=node.rowIndex+'.'+node.colIndex;
            seatMap[pos] = node;
        });

		var joinMap = {};
		var seatRows = [];
		var rowCount = parseInt(room.seatRows);
		var colCount = parseInt(room.seatCols);
		for( var ri=0; ri<rowCount; ri++ ){
			var seatRow = {};
			seatRow.key = ''+(ri+1);
			seatRow.seats = [];
			seatRows.push( seatRow );

			for( var ci=0; ci<colCount; ci++ ){
				// 无效的节点
				var k2=ri+'.'+ci;
				if(joinMap[k2] === 1){
					continue;
				}

				var seat = {};
				seat.key = ''+(ci+1);
				seatRow.seats.push( seat );

				var pos=seatRow.key+'.'+seat.key;
				seat.node = seatMap[pos];
				if(seat.node===null || typeof(seat.node)==="undefined"){
					seat.node = null;
					seat.rowIndex=ri+1;
					seat.colIndex=ci+1;
				}
				else{
					seat.rowSpan = parseInt(seat.node.rowSpan);
					seat.colSpan = parseInt(seat.node.colSpan);
					// console.log('seat.colSpan='+seat.colSpan);
					if(seat.rowSpan<0) seat.rowSpan=1;
					if(seat.colSpan<0) seat.colSpan=1;
					if( seat.rowSpan > 1 || seat.colSpan > 1 ){
						for( var ri2=0; ri2<seat.rowSpan; ri2++ ){
							for( var ci2=0; ci2<seat.colSpan; ci2++ ){
								if(ri2!==0 || ci2!==0){
									var k=(ri+ri2)+'.'+(ci+ci2);
									joinMap[k] = 1;
								}
							}
						}
					}
				}
			}
		}
		
		return seatRows;
	},

    render: function () {
        if (this.state.roomLoading || this.state.seatLoading) {
            return <Spin tip="正在加载工位信息..." style={{ height: '100px' }}>正在读取工位信息</Spin>
        }
        
		var seat = this.props.seat;
		var room = this.state.innRoom;
        if (room === null) {
			return <div {...this.props}>
					<div style={{marginLeft:'16px', marginBottom:'12px'}}>
						<div style={{display: 'inline'}}>房间【{seat.seatCode}】还没有创建</div>
	          			<Icon type="plus-circle-o" onClick={this.handleCreateRoom} title='创建房间信息' className='toolbar-icon' style={{paddingLeft:'8px', cursor:'pointer'}}/>
				    </div>
				    
				    <CreateInnRoomPage ref='createInnRoom'/>
				</div>
		}
		
		var colCount = parseInt(room.seatCols);

		var titles = [];
		titles.push(<td key='col.0' className='seat-index' style={{borderTop: '1px solid #9B9B9B'}}></td>);
		var campus=null;
		for( var ci=0; ci<colCount; ci++ ){
            titles.push(<td key={'col.'+(ci+1)} className='seat-title'>{ci+1}</td>);
        }

		// 图片
		var fileList = [];
		var imageUrl = room.image;
		if(imageUrl !== null && imageUrl !== ''){
            imageUrl = Utils.campUrl + imageUrl.substr(1);
            imageUrl = Utils.fmtGetUrl(imageUrl);
			
			fileList.push( {
				uid: room.uuid,
				name: 'xxx.png',
				status: 'done',
				url: imageUrl,
			} );
		}
		
		var actionUrl = Utils.campUrl + 'hr-room/map-upload';
		
		const reqData = {
			body:{uuid: room.uuid},
			callback: this.onUploadImage.bind(this, room)
		};
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);

		const uploadBox = (
			<Upload
				name="roomImage"
				listType="picture-card"
				fileList={fileList}
				action={actionUrl}
				data={reqData}
				customRequest={FileRequest}
				beforeUpload={this.beforeUpload}
				onRemove={this.onRemoveImage}
				onPreview={this.onPreviewImage}
			>
				{fileList.length > 0 ? null : uploadButton}
			</Upload>
		);

		return (
			<div {...this.props}>
				<div style={{marginLeft:'16px', marginBottom:'12px'}}>
					<div style={{display: 'inline'}}>房间【{seat.seatCode}】的工位信息</div>
          			<Icon type="edit" onClick={this.handleUpdateRoom} title='修改房间信息' className='toolbar-icon' style={{paddingLeft:'8px', cursor:'pointer'}}/>
			    	<Icon type="qrcode" onClick={this.downloadQRCode} title='下载工位的二维码文件' className='toolbar-icon' style={{paddingLeft:'8px', cursor:'pointer'}}/>
			    </div>

				<table style={{marginLeft:'16px', marginBottom: '16px'}}><tbody>
					<tr key='row.0' style={{height: '28px'}}>
						{titles}
					</tr>
				{
					this.state.seatRows.map((row, ri) => {
			            return <tr key={row.key} style={{height: '32px'}}>
			            	<td key='col.0' className='seat-index'>
			            		{row.key}
			            	</td>
			            {
							row.seats.map((seat, ci) => {
					        	return (seat.node === null) ?
					        	<td key={seat.key} className='seat-box' style={{textAlign: 'center'}} onClick={this.handleOpenCreateWindow.bind(this, seat.rowIndex, seat.colIndex)}>{seat.rowIndex+'.'+seat.colIndex}
					        	</td> :
					        	<td key={seat.key} className='seat-box seat-selected' style={{textAlign: 'center'}} colSpan={seat.colSpan} rowSpan={seat.rowSpan} onClick={this.onClickUpdate.bind(this, seat.node)}>{seat.node.seatCode}
					        	</td>
					        })
			            }
			            </tr>
			        })
			    }
				</tbody></table>

				<CreateInnSeatPage ref="createWindow"/>
				<UpdateInnSeatPage ref="updateWindow"/>
				<UpdateInnRoomPage ref='updateInnRoom'/>
				
				<div style={{margin:'24px 0 0 16px'}}>
					<div className="clearfix">
						{this.state.imageLoading ? <Spin>{uploadBox}</Spin> : uploadBox}
					</div>
					<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
						<img style={{ width: '100%' }} src={this.state.previewImage} />
					</Modal>
				</div>
			</div>
		);
	}
});

module.exports = InSeatTable;
