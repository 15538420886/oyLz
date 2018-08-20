'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Form, Icon, Modal, Input, Radio, Spin } from 'antd';
const InputGroup = Input.Group;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import Draggable from 'react-draggable';

var Context = require('../../CampContext');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var RoomImageStore = require('../data/RoomImageStore.js');
var RoomImageActions = require('../action/RoomImageActions');
var RoomStore = require('../../room/data/RoomStore.js');
var RoomActions = require('../../room/action/RoomActions');

import SelectSeatPage from './SelectSeatPage';

var RoomImagePage = React.createClass({
    getInitialState: function () {
        return {
            seatSet: {
                recordSet: [],
                errMsg: ''
            },
            roomLoading: false,
            loading: false,
            seatRows: [],
            imgWidth: '2000',
            imgHeight: '1000',
            dragMap: {},
            modifyType: '0',
            selectedSeat: null,
            addPos: { x: 0, y: 0 },
        }
    },
    mixins: [Reflux.listenTo(RoomImageStore, "onServiceComplete"), Reflux.listenTo(RoomStore, "onRoomComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'batchUpdate') {
            // 更新数据
            this.state.seatRows = this.preSeatMap(data.recordSet);
        }
        else {
            // 生成工位的坐标
            this.state.seatRows = this.preSeatMap(data.recordSet);
        }

        this.setState({
            loading: false,
            seatSet: data
        });
    },
    onRoomComplete: function (data) {
        if (data.operation === 'update') {
            this.setState({ roomLoading: false });
        }
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

        var joinMap = {};
        var seatRows = [];
        var room = Context.selectedRoom;
        var rowCount = parseInt(room.seatRows);
        var colCount = parseInt(room.seatCols);
        for (var ri = 0; ri < rowCount; ri++) {
            var seatRow = {};
            seatRow.key = '' + (ri + 1);
            seatRow.seats = [];
            seatRows.push(seatRow);

            for (var ci = 0; ci < colCount; ci++) {
                // 无效的节点
                var k2 = ri + '.' + ci;
                if (joinMap[k2] === 1) {
                    continue;
                }

                var seat = {};
                seat.key = '' + (ci + 1);
                seatRow.seats.push(seat);

                var pos = seatRow.key + '.' + seat.key;
                seat.node = seatMap[pos];
                if (seat.node === null || typeof (seat.node) === "undefined") {
                    seat.node = null;
                    seat.rowIndex = ri + 1;
                    seat.colIndex = ci + 1;
                }
                else {
                    seat.rowSpan = parseInt(seat.node.rowSpan);
                    seat.colSpan = parseInt(seat.node.colSpan);
                    // console.log('seat.colSpan='+seat.colSpan);
                    if (seat.rowSpan < 0) seat.rowSpan = 1;
                    if (seat.colSpan < 0) seat.colSpan = 1;
                    if (seat.rowSpan > 1 || seat.colSpan > 1) {
                        for (var ri2 = 0; ri2 < seat.rowSpan; ri2++) {
                            for (var ci2 = 0; ci2 < seat.colSpan; ci2++) {
                                if (ri2 !== 0 || ci2 !== 0) {
                                    var k = (ri + ri2) + '.' + (ci + ci2);
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

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        RoomImageActions.initHrSeat(this.state.room.uuid);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
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
    },

    handleOnChange: function (e) {
        var name = e.target.id;
        if (name.startsWith('img')) {
            this.state[name] = e.target.value;
        }
        else if (this.state.selectedSeat !== null){
            this.state.selectedSeat[name] = e.target.value;

            if (this.state.modifyType === '0' && (name === 'width' || name === 'height')) {
                // 批量修改
                this.batchUpdateRect(this.state.selectedSeat.group, name, e.target.value);
            }
        }

        this.setState({
            loading: this.state.loading
        });
    },
    batchUpdateRect: function (group, name, value) {
        //console.log('batchUpdateRect', group, name, value);
        var dragMap = this.state.dragMap;
        for (var name2 in dragMap) {
            var seat = dragMap[name2];
            if (seat.group === group) {
                seat[name] = value;
            }
        }
    },
    onChangeModifyType: function (e) {
        this.setState({ modifyType: e.target.value });
    },
    handleSave: function (event) {
        var mr = '' + this.state.imgWidth + ',' + this.state.imgHeight;
        var room = Context.selectedRoom;
        if (room.memo2 !== mr) {
            var rm = {};
            Utils.copyValue(room, rm);
            rm.memo2 = mr;
            this.setState({ roomLoading: true });
            RoomActions.updateHrRoom(rm);
        }

        var modifyList = [];
        var dragMap = this.state.dragMap;
        for (var name2 in dragMap) {
            var seat = dragMap[name2];

            var r = parseInt(seat.left) + parseInt(seat.width);
            var b = parseInt(seat.top) + parseInt(seat.height);

            var m2 = '' + seat.left + ',' + seat.top + ',' + r + ',' + b;
            if (m2 !== seat.node.memo2) {
                var nw = {};
                Utils.copyValue(seat.node, nw);
                nw.memo2 = m2;
                modifyList.push(nw);
            }
        }

        if (modifyList.length === 0) {
            return;
        }

        // 保存数据
        this.setState({ loading: true });
        RoomImageActions.batchUpdateHrSeat(modifyList);
    },
    onDblClickImage: function (event) {
        var r = event.target.getBoundingClientRect();
        var left = event.clientX - r.left;
        var top = event.clientY - r.top;
        this.addSeatBox(left, top);
    },
    onClickImage: function (event) {
        if (event.ctrlKey) {
            var r = event.target.getBoundingClientRect();
            var left = event.clientX - r.left;
            var top = event.clientY - r.top;
            this.addSeatBox(left, top);
        }
    },
    addSeatBox: function (x, y) {
        // console.log(' add', x, y);
        this.state.addPos = { x: x, y: y };
        this.refs.selectWindow.initPage(this.state.seatRows, this.state.dragMap);
        this.refs.selectWindow.toggle();
    },
    onAddSeat: function (seatList) {
        // console.log('seatList', seatList, this.state.addPos)
        if (seatList === null || seatList.length === 0) {
            return;
        }

        var top = this.state.addPos.y;
        var left = this.state.addPos.x;
        seatList.map((seat, i) => {
            seat.top = top;
            seat.left = left;
            left = left + seat.width + 6;
            this.state.dragMap[seat.id] = seat;
        });

        this.setState({
            loading: this.state.loading
        });
    },

    handleStart: function (seat, e, ui) {
        this.setState({ selectedSeat: seat });
        // console.log('handleStart', seat, e, ui)
    },
    handleDrag: function (seat, e, ui) {
        // console.log('handleDrag', seat, e, ui)
    },
    handleStop: function (seat, e, ui) {
        seat.top = ui.lastY;
        seat.left = ui.lastX;
        this.setState({ loading: this.state.loading });
        // console.log('handleStop', seat, e, ui)
    },
    render: function () {
        var room = Context.selectedRoom;
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
            var node = <Draggable position={pos} onStart={this.handleStart.bind(this, seat)} onDrag={this.handleDrag.bind(this, seat)} onStop={this.handleStop.bind(this, seat)}>
                <div className="box" key={seat.id} style={{ width: w, height: h }}>
                    <span style={{ padding: '3px 3px 3px 3px', backgroundColor:'#98FF95'}}>{seat.id}</span>
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
        var img = <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px' }}>
            <div onDoubleClick={this.onDblClickImage} onClick={this.onClickImage} style={{ width: imgWidth, height: imgHeight, backgroundRepeat: 'no-repeat', position: 'relative', backgroundImage: imageUrl }}>
                {seatList}
            </div>
        </div>;

        var loading = this.state.loading || this.state.roomLoading;
        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-wifi/retrieve', 'hr-wifi/remove']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon='save' onClick={this.handleSave} type="primary" loading={loading}>保存工位图</Button>
                        </div>
                        <div style={{ float: 'left', padding: '0 0 0 128px' }}>
                            <RadioGroup name="modifyType" id="modifyType" onChange={this.onChangeModifyType} value={this.state.modifyType}>
									<RadioButton value="0">批量</RadioButton>
									<RadioButton value="1">单个</RadioButton>
                            </RadioGroup>
                        </div>
                        <div style={{ float: 'left', padding: '0 0 0 8px', margin: '-3px 0 0 0' }}>
                            <div style={{ width: '70px', display: 'inline-block' }}>
                                <InputGroup compact style={{ width: '100%' }}>
                                    <Input style={{ width: '40%', textAlign: 'center' }} defaultValue="宽" readOnly={true} />
                                    <Input style={{ width: '60%', textAlign: 'center' }} type="text" name="width" id="width" value={seat.width} onChange={this.handleOnChange} />
                                </InputGroup>
                            </div>
                            <div style={{ width: '70px', display: 'inline-block', margin:'0 0 0 8px' }}>
                                <InputGroup compact style={{ width: '100%' }}>
                                    <Input style={{ width: '40%', textAlign: 'center' }} defaultValue="高" readOnly={true} />
                                    <Input style={{ width: '60%', textAlign: 'center' }} type="text" name="height" id="height" value={seat.height} onChange={this.handleOnChange} />
                                </InputGroup>
                            </div>
                            <div style={{ width: '70px', display: 'inline-block', margin: '0 0 0 8px' }}>
                                <InputGroup compact style={{ width: '100%' }}>
                                    <Input style={{ width: '40%', textAlign: 'center' }} defaultValue="左" readOnly={true} />
                                    <Input style={{ width: '60%', textAlign: 'center' }} type="text" name="left" id="left" value={seat.left} onChange={this.handleOnChange} />
                                </InputGroup>
                            </div>
                            <div style={{ width: '70px', display: 'inline-block', margin: '0 0 0 8px' }}>
                                <InputGroup compact style={{ width: '100%' }}>
                                    <Input style={{ width: '40%', textAlign: 'center' }} defaultValue="上" readOnly={true} />
                                    <Input style={{ width: '60%', textAlign: 'center' }} type="text" name="top" id="top" value={seat.top} onChange={this.handleOnChange} />
                                </InputGroup>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', margin: '-3px 0 0 0' }}>
                            <div style={{ width: '120px', display: 'inline-block' }}>
                                <InputGroup compact style={{ width: '100px' }}>
                                    <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="宽" readOnly={true} />
                                    <Input style={{ width: '65%', textAlign: 'center' }} type="text" name="imgWidth" id="imgWidth" value={this.state.imgWidth} onChange={this.handleOnChange} />
                                </InputGroup>
                            </div>
                            <div style={{ width: '100px', display: 'inline-block' }}>
                                <InputGroup compact style={{ width: '100%' }}>
                                    <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="高" readOnly={true} />
                                    <Input style={{ width: '65%', textAlign: 'center' }} type="text" name="imgHeight" id="imgHeight" value={this.state.imgHeight} onChange={this.handleOnChange} />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据...">{img}</Spin>
                        :
                        img
                }

                <SelectSeatPage ref="selectWindow" onSelectSeat={this.onAddSeat}/>
            </div>
        );
    }
});

module.exports = RoomImagePage;
