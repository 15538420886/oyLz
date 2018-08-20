'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';
var Context = require('../CampContext');

var Utils = require('../../public/script/utils');
var SeatStore = require('./data/SeatStore.js');
var SeatActions = require('./action/SeatActions');
import RegSeatPage from './Components/RegSeatPage';

var SeatTestPage = React.createClass({
	getInitialState : function() {
		return {
			seatSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			seatRows: [],
		}
	},

	// 刷新
	handleQueryClick : function(event) {
		var room = Context.selectedRoom;
		SeatActions.retrieveHrSeat(room.uuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var room = Context.selectedRoom;
		SeatActions.initHrSeat(room.uuid);
	},

	handleOpenCreateWindow : function(rowIndex, colIndex, event) {

	},

	onClickUpdate : function(seat, event)
	{
		if(seat != null){
			this.refs.regWindow.clear(seat);
			this.refs.regWindow.toggle();
		}
	},

	render : function() {
		// 生成工位的坐标
		var seatMap = {};
		var recordSet = this.state.seatSet.recordSet;
		recordSet.map((node, i) => {
            var pos=node.rowIndex+'.'+node.colIndex;
            seatMap[pos] = node;
        });

		var joinMap = {};
		this.state.seatRows = [];
		var room = Context.selectedRoom;
		var rowCount = parseInt(room.seatRows);
		var colCount = parseInt(room.seatCols);
		for( var ri=0; ri<rowCount; ri++ ){
			var seatRow = {};
			seatRow.key = ''+(ri+1);
			seatRow.seats = [];
			this.state.seatRows.push( seatRow );

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

		var titles = [];
		titles.push(<td key='col.0' className='seat-index' style={{borderTop: '1px solid #9B9B9B'}}></td>);
		var campus=null;
		for( var ci=0; ci<colCount; ci++ ){
            titles.push(<td key={'col.'+(ci+1)} className='seat-title'>{ci+1}</td>);
        }

		var campus = Context.selectedCampus;
		var build = Context.selectedBuild;
		var room = Context.selectedRoom;

		return (
			<div className='grid-page'>
				<ServiceMsg ref='mxgBox' svcList={['hr-seat/retrieve']}/>

			    <div style={{marginLeft:'16px', marginBottom:'12px'}}>
			    	<a key='backCampus' href='#' onClick={Context.goBackCampus.bind(Context)}>{campus.campusName}</a>{' > '}
			    	<a key='backBuild' href='#' onClick={Context.goBackBuild}>{build.buildCode}</a>{' > '}
			    	<a key='backRoom' href='#' onClick={Context.goBackRoom}>{room.roomCode}</a>{' > '}
			    	工位签到测试
			    </div>

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

				<RegSeatPage ref="regWindow"/>
			</div>
		);
	}
});

ReactMixin.onClass(SeatTestPage, Reflux.connect(SeatStore, 'seatSet'));
module.exports = SeatTestPage;
