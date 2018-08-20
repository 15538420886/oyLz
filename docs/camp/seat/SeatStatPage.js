'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, DatePicker, Spin } from 'antd';
import Draggable from 'react-draggable';

import XlsDown from '../../lib/Components/XlsDown';
import SelectDate from '../../lib/Components/SelectDate';
const dateFormat = 'YYYY-MM-DD';

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import XlsTempFile from '../../lib/Components/XlsTempFile';

var Context = require('../CampContext');
var XlsConfig = require('../XlsConfig');
var RoomImageStore = require('./data/RoomImageStore');
var RoomImageActions = require('./action/RoomImageActions');
var PosStore = require('./data/PosStore.js');
var PosActions = require('./action/PosActions');

var today = '' + Common.getToday();
var SeatStatPage = React.createClass({
    getInitialState: function () {
        return {
            seatSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            posSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: false,
            posLoading: false,
            room: null,
            imgWidth: '2000',
            imgHeight: '1000',
            dragMap: {},
            selectedSeat: null,
            workDate: today,

            action: 'image',
        }
    },
    mixins: [Reflux.listenTo(RoomImageStore, "onServiceComplete"), Reflux.listenTo(PosStore, "onPosComplete"), XlsTempFile()],
    onServiceComplete: function (data) {
        // 生成工位的坐标
        this.preSeatMap(data.recordSet);
        this.setState({
            loading: false,
            seatSet: data
        });
    },
    onPosComplete: function (data) {
        this.setState({
            posLoading: false,
            posSet: data
        });
    },

    preSeatMap: function (recordSet) {
        var seatMap = {};
        var dragMap = {};
        this.state.dragMap = dragMap;
        this.state.selectedSeat = null;

        recordSet.map((node, i) => {
            var pos = node.rowIndex + '.' + node.colIndex;
            seatMap[pos] = node;

            if (node.memo2 !== null && node.memo2 !== '') {
                var pos = node.memo2.split(',');
                if (pos.length === 4) {
                    var left = parseInt(pos[0]);
                    var top = parseInt(pos[1]);
                    var o = {
                        id: node.seatCode,
                        uuid: node.uuid,
                        left: left,
                        top: top,
                        width: parseInt(pos[2]) - left,
                        height: parseInt(pos[3]) - top,
                        node: node,
                        group: null,
                    };

                    if (node.seatType === '1') {
                        o.group = node.rowIndex;
                    }

                    dragMap[o.id] = o;
                }
            }
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.state.seatSet.operation = '';
        this.state.posSet.operation = '';
        this.setState({ loading: true });
        RoomImageActions.initHrSeat(this.state.room.uuid);
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.seatSet.operation = '';
        this.state.posSet.operation = '';
        this.setState({ loading: true, posLoading: true });
        this.state.room = Context.selectedRoom;

        // 图像大小
        var rc = Context.selectedRoom.memo2;
        if (rc !== null) {
            var k = rc.indexOf(',');
            if (k > 0) {
                var w = rc.substr(0, k);
                var h = rc.substr(k + 1);
                this.state.imgWidth = parseInt(w);
                this.state.imgHeight = parseInt(h);
            }
        }

        RoomImageActions.initHrSeat(this.state.room.uuid);
        PosActions.initRoomSeat(this.state.room.uuid, this.state.workDate);
    },
    onSelDate: function (date, dateString) {
        if (dateString.length != 10) {
            return;
        }

        this.state.seatSet.operation = '';
        this.state.posSet.operation = '';

        var room = Context.selectedRoom;
        var dd = dateString.substr(0, 4) + dateString.substr(5, 2) + dateString.substr(8, 2);
        this.setState({ posLoading: true, workDate: dd });
        PosActions.initRoomSeat(room.uuid, dd);
    },
    // 选择日期
    onChangeDate: function (e) {
        this.state.seatSet.operation = '';
        this.state.posSet.operation = '';

        var room = Context.selectedRoom;
        var workDate = e.target.value;
        this.setState({ posLoading: true, workDate: workDate });
        PosActions.initRoomSeat(room.uuid, workDate);
    },

    onDblClickSeat: function (seat, event) {
        console.log(seat);
    },

    goImage: function () {
        this.setState({ action: 'image' });
    },
    goPos: function () {
        this.setState({ action: 'pos' });
    },
    xlsExport: function () {
        var data = [];
        var recordSet = this.state.posSet.recordSet;
        recordSet.map((seat, ii) => {
            var r = {};
            r.username = seat.username;
            r.posType = seat.posType;
            r.posTime = seat.posTime;
            r.seatCode = seat.seatCode;

            data.push(r);
        });

        this.downXlsTempFile2(XlsConfig.dailyFields, data, this.refs.xls);
    },

    render: function () {
        var campus = Context.selectedCampus;
        var build = Context.selectedBuild;
        var room = Context.selectedRoom;

        var loading = this.state.loading || this.state.posLoading;
        var page = null;
        if (this.state.action === 'image') {
            // 工位状态
            var seatStat = {};
            this.state.posSet.recordSet.map((seat, ii) => {
                if (seat.posType === 'check_in') seatStat[seat.seatUuid] = seat;
            });
            var imageUrl = room.image;
            if (imageUrl !== null && imageUrl !== '') {
                imageUrl = Utils.fmtGetUrl(Utils.campUrl + imageUrl.substr(1));
                imageUrl = 'url(' + imageUrl + ')';
            }

            // seat
            var seatList = [];
            var dragMap = this.state.dragMap;
            for (var name in dragMap) {
                var seat = dragMap[name];
                var pos = { x: seat.left, y: seat.top };
                var w = seat.width + 'px';
                var h = seat.height + 'px';

                var span = null;
                var t = seatStat[seat.uuid];
                if (t && typeof (t) != 'undefined') {
                    span = <span style={{ padding: '3px 3px 3px 3px', backgroundColor: '#98FF95' }}>{t.username}</span>;
                } else {
                    span = <span style={{ padding: '3px 3px 3px 3px', backgroundColor: '#e0f0e9' }}>{seat.id}</span>;
                }

                var node = <Draggable position={pos} disabled='true'>
                    <div className="box" key={seat.id} style={{ width: w, height: h }} onDoubleClick={this.onDblClickSeat.bind(this, seat)}>
                        {span}
                    </div>
                </Draggable>;

                seatList.push(node);
            }

            var seat = {};
            if (this.state.selectedSeat !== null) {
                seat = this.state.selectedSeat;
            }
            var imgWidth = this.state.imgWidth + 'px';
            var imgHeight = this.state.imgHeight + 'px';
            var img =
                <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px' }}>
                    <div style={{ width: imgWidth, height: imgHeight, backgroundRepeat: 'no-repeat', position: 'relative', backgroundImage: imageUrl }}>
                        {seatList}
                    </div>
                </div>;
            page = loading ? <Spin tip="正在努力加载数据...">{img}</Spin> : img
        }
        else {
            var recordSet = this.state.posSet.recordSet;
            const columns = [
                {
                    title: '姓名',
                    dataIndex: 'username',
                    key: 'username',
                    width: 140,
                },
                {
                    title: '类型',
                    dataIndex: 'posType',
                    key: 'posType',
                    width: 140,
                },
                {
                    title: '时间',
                    dataIndex: 'posTime',
                    key: 'posTime',
                    width: 140,
                },
                {
                    title: '工位号',
                    dataIndex: 'seatCode',
                    key: 'seatCode',
                    width: 140,
                },
            ];
            page =
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} loading={loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>;
        }
        return (
            <div className='grid-page' style={{ padding: '74px 0px 0px' }}>
                <ServiceMsg ref='mxgBox' svcList={['day-pos/retrieve']} />
                <div style={{ margin: '-74px 0px 0px 16px', float: 'left' }}>
                    <a key='backCampus' href='#' onClick={Context.goBackCampus.bind(Context)}>{campus.campusName}</a>{' > '}
                    <a key='backBuild' href='#' onClick={Context.goBackBuild}>{build.buildCode}</a>{' > '}
                    <a key='backRoom' href='#' onClick={Context.goBackRoom}>{room.roomCode}</a>{' > '}
                    工位状态查询
			    </div>

                <div style={{ height: '42px', width: '100%', display: 'inherit', paddingLeft: '12px', marginTop: '-42px', float: 'left' }}>
                    <SelectDate value={this.state.workDate} onChange={this.onChangeDate} />
                    <DatePicker style={{ width: '100px', marginLeft: '16px' }} format={dateFormat} onChange={this.onSelDate} allowClear={false} />
                    <Button icon='download' title="导出签到数据" onClick={this.xlsExport} style={{marginLeft: '14px'}}/>
                    <div style={{ float: 'right', paddingRight: '28px' }}>
                        <Button key="image" type={this.state.action === 'image' ? 'primary' : 'default'} size="large" onClick={this.goImage}>工位图</Button>{' '}
                        <Button key="pos" type={this.state.action === 'pos' ? 'primary' : 'default'} size="large" onClick={this.goPos}>签到表</Button>
                    </div>
                </div>
                <XlsDown ref='xls' />
                {page}
            </div>
        );
    }
});

ReactMixin.onClass(SeatStatPage, Reflux.connect(RoomImageStore, 'seatSet'));
ReactMixin.onClass(SeatStatPage, Reflux.connect(PosStore, 'posSet'));
module.exports = SeatStatPage;
