'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

var Context = require('../CampContext');
var Utils = require('../../public/script/utils');
import SeatTable from './Components/SeatTable';
import WifiTable from './Components/WifiTable';
import RoomImagePage from './Components/RoomImagePage';


var SeatPage = React.createClass({
	getInitialState : function() {
		return {
		}
	},

	// 第一次加载
	componentDidMount : function(){
	},

	downloadQRCode: function()
	{
		var room = Context.selectedRoom;
		var url = Utils.campUrl+'hr-seat/down-qrcode?roomUuid='+room.uuid;
        window.location.href = Utils.fmtGetUrl(url);
	},
	render : function() {
		var campus = Context.selectedCampus;
		var build = Context.selectedBuild;
		var room = Context.selectedRoom;

		return (
            <div className='grid-page' style={{padding: '38px 0 0 0' }}>
			    <div style={{margin:'-38px 0 12px 16px'}}>
			    	<a key='backCampus' href='#' onClick={Context.goBackCampus.bind(Context)}>{campus.campusName}</a>{' > '}
			    	<a key='backBuild' href='#' onClick={Context.goBackBuild}>{build.buildCode}</a>{' > '}
			    	<a key='backRoom' href='#' onClick={Context.goBackRoom}>{room.roomCode}</a>{' > '}
			    	工位信息
			    	<Icon type="qrcode" onClick={this.downloadQRCode} title='下载工位的二维码文件' className='toolbar-icon'/>
			    </div>
                <Tabs defaultActiveKey="1" onChange={this.callback} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="工位" key="1" style={{ width: '100%', height: '100%' }}>
				    	<SeatTable ref="seatTable"/>
				    </TabPane>
                    <TabPane tab="WIFI" key="2" style={{ width: '100%', height: '100%' }}>
				    	<WifiTable ref="wifiTable"/>
                    </TabPane>
                    <TabPane tab="工位图" key="3" style={{ width: '100%', height: '100%' }}>
                        <RoomImagePage ref="roomImage" />
                    </TabPane>
				</Tabs>
			</div>
		);
	}
});

module.exports = SeatPage;
