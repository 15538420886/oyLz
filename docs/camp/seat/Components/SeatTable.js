'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Upload, Spin} from 'antd';
import FileRequest from '../../../lib/Components/FileRequest';
var Context = require('../../CampContext');

var Utils = require('../../../public/script/utils');
var SeatStore = require('../data/SeatStore.js');
var SeatActions = require('../action/SeatActions');
var RoomStore = require('../../room/data/RoomStore.js');
var RoomActions = require('../../room/action/RoomActions');

import CreateSeatPage from './CreateSeatPage';
import UpdateSeatPage from './UpdateSeatPage';
import InSeatTable from './InSeatTable';

var SeatTable = React.createClass({
	getInitialState : function() {
		return {
			seatSet: {
				recordSet: [],
				errMsg : ''
			},
			loading: false,
			seatRows: [],
			selectedSeat: null,
			
			roomLoading: false,
			previewVisible: false,
			previewImage: null,
		}
	},
    mixins: [Reflux.listenTo(SeatStore, "onServiceComplete"), Reflux.listenTo(RoomStore, "onRoomComplete")],
    onServiceComplete: function(data) {
    	// 生成工位的坐标
    	this.state.seatRows = this.preSeatMap(data.recordSet);
    	
        this.setState({
            loading: false,
            seatSet: data
        });
    },
    onRoomComplete: function(data) {
        this.setState({
            roomLoading: false,
        });
    },

	// 第一次加载
	componentDidMount : function(){
		var room = Context.selectedRoom;
		SeatActions.initHrSeat(room.uuid);
	},

	handleOpenCreateWindow : function(rowIndex, colIndex, event) {
		if(this.state.selectedSeat !== null){
			this.setState({selectedSeat: null});
		}
		
		var room = Context.selectedRoom;
		this.refs.createWindow.clear(room.uuid, rowIndex, colIndex);
		this.refs.createWindow.toggle();
	},
	onClickUpdate : function(seat, event)
	{
		if(this.state.selectedSeat !== null){
			this.setState({selectedSeat: null});
		}
		
		if(seat != null){
			this.refs.updateWindow.initPage(seat);
			this.refs.updateWindow.toggle();
		}
	},
	handleClickRoom : function(seat, event)
	{
		if(this.state.selectedSeat !== seat){
			this.setState({selectedSeat: seat});
		}
		
		event.stopPropagation();
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
		this.setState({roomLoading: true});
		RoomActions.deleteImage( file.uid );
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
		var seatMap = {};
		recordSet.map((node, i) => {
            var pos=node.rowIndex+'.'+node.colIndex;
            seatMap[pos] = node;
        });

		var joinMap = {};
		var seatRows = [];
		var room = Context.selectedRoom;
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

	render : function() {
		var room = Context.selectedRoom;
		var colCount = parseInt(room.seatCols);

		var titles = [];
		titles.push(<td key='col.0' className='seat-index' style={{borderTop: '1px solid #9B9B9B'}}></td>);
		var campus=null;
		for( var ci=0; ci<colCount; ci++ ){
            titles.push(<td key={'col.'+(ci+1)} className='seat-title'>{ci+1}</td>);
        }
		
		// 图片
		var fileList = [];
		console.log(room)
		var imageUrl = room.image;
		if(imageUrl !== null && imageUrl !== ''){
            imageUrl = Utils.campUrl + imageUrl.substr(1);
            console.log(imageUrl)
            imageUrl = Utils.fmtGetUrl(imageUrl);
            console.log(imageUrl)
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
            <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px 24px 20px 8px' }}>
                <ServiceMsg ref='mxgBox' svcList={['hr-seat/retrieve', 'hr-seat/remove', 'inn-room/retrieve', 'inn-room/remove']}/>
				<table style={{marginLeft:'16px'}}><tbody>
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
								var cell = null;
								var dtStyle = {textAlign: 'center', cursor:'default'};
								if(seat.node !== null){
									if(seat.node.seatType === "4" || seat.node.seatType === "2"){
										if(seat.rowSpan !== '1'){
											dtStyle['height'] = '100%';
										}
										
										cell = 
											<div className="seat-selected" style={{width: '100%', height: '100%', padding: '26px 0 0 0'}}>
							                    <div style={{width: '100%', height: '22px', textAlign: 'right', padding:'0 8px 0 0', margin: '-22px 0 0 0'}}>
							                        <a href="#" onClick={this.handleClickRoom.bind(this, seat)}>工位</a>
							                    </div>
							                    <div style={{width: '100%', overflow: 'hidden', justifyContent: 'center', paddingTop: '8px'}}>
							                    	{seat.node.seatCode}
							                    </div>
							                </div>
									}
									else{
										cell = seat.node.seatCode;
									}
								}
								else{
									cell = seat.rowIndex+'.'+seat.colIndex;
								}
								
					        	return (seat.node === null) ?
						        	<td key={seat.key} className='seat-box' style={dtStyle} onClick={this.handleOpenCreateWindow.bind(this, seat.rowIndex, seat.colIndex)}>
						        		{cell}
						        	</td> :
						        	<td key={seat.key} className='seat-box seat-selected' style={dtStyle} colSpan={seat.colSpan} rowSpan={seat.rowSpan} onClick={this.onClickUpdate.bind(this, seat.node)}>
						        		{cell}
						        	</td>
					        })
			            }
			            </tr>
			        })
			    }
				</tbody></table>

				<CreateSeatPage ref="createWindow"/>
				<UpdateSeatPage ref="updateWindow"/>
				
				<div style={{margin:'24px 0 0 16px'}}>
					<div className="clearfix">
						{this.state.roomLoading ? <Spin>{uploadBox}</Spin> : uploadBox}
					</div>
					<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
						<img style={{ width: '100%' }} src={this.state.previewImage} />
					</Modal>
				</div>
				
				{(this.state.selectedSeat === null) ? null : <InSeatTable ref='innRoom' seat={this.state.selectedSeat.node} style={{padding: '32px 0 0 0'}}/>}
			</div>
		);
	}
});

module.exports = SeatTable;

