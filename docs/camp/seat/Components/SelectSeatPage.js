import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Context = require('../../CampContext');
var InnSeatStore = require('../data/InnSeatStore.js');
var InnSeatActions = require('../action/InnSeatActions');
var InnRoomStore = require('../data/InnRoomStore.js');
var InnRoomActions = require('../action/InnRoomActions');

var SelectSeatPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            roomLoading: false,
            modal: false,
            seatRows: [],
            selectedMap: {},
        }
    },
    mixins: [Reflux.listenTo(InnSeatStore, "onServiceComplete"), Reflux.listenTo(InnRoomStore, "onRoomComplete")],
    onServiceComplete: function (data) {
        if(data.operation !== 'SelectSeatRetrieve'){
            return;
        }
        var seats = [];
        data.recordSet.map((node, i) => {
            if (node === null || node.seatType !== '1') {
                return;
            }

            var node2 = this.state.selectedMap[node.seatCode];
            if (node2 !== undefined) {
                return;
            }

            var o = {
                id: node.seatCode,
                uuid: node.uuid,
                width: 60,
                height: 40,
                node: node,
                group: data.roomUuid,
            };

            seats.push(o);
        });

        this.toggle();
        this.props.onSelectSeat(seats);
    },
    onRoomComplete: function (data) {
        if(data.operation !== 'SelectSeatRetrieve'){
            return;
        }
        if (data.errMsg === '' && data.innRoom !== null) {
            this.setState({
                roomLoading: false,
                loading: true,
            });

            InnSeatActions.initHrSeat(data.innRoom.uuid, 'SelectSeatRetrieve');
        }
        else {
            this.setState({
                roomLoading: false,
                loading: false,
            });
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },

    initPage: function (seatRows, selectedMap) {
        this.state.seatRows = seatRows;
        this.state.selectedMap = selectedMap;

        this.state.loading = false;
        this.state.roomLoading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },
    onClickSeat: function (row, seat, event) {
        if (this.props.onSelectSeat === undefined || this.props.onSelectSeat === null) {
            return;
        }

        if (seat.seatType === '3') {
            // 办公室
            var o = {
                id: seat.seatCode,
                uuid: seat.uuid,
                width: 80,
                height: 50,
                group: null,
            };

            this.toggle();
            this.props.onSelectSeat([o]);
            return;
        }

        if (seat.seatType === '1') {
            // 工位，整行增加
            var seats = [];
            row.seats.map((seat2, ci) => {
                var node = seat2.node;
                if (node === null || node.seatType !== '1') {
                    return;
                }

                var node2 = this.state.selectedMap[node.seatCode];
                if (node2 !== undefined) {
                    return;
                }

                var o = {
                    id: node.seatCode,
                    uuid: node.uuid,
                    width: 60,
                    height: 40,
                    node: node,
                    group: node.rowIndex,
                };

                seats.push(o);
            });

            this.toggle();
            this.props.onSelectSeat(seats);
            return;
        }

        this.setState({
            roomLoading: true,
            loading: false,
        });

        // console.log('seat', seat)
        InnRoomActions.initHrRoom(seat.uuid, 'SelectSeatRetrieve');
    },

    render: function () {
        var room = Context.selectedRoom;
        var colCount = parseInt(room.seatCols);

        var titles = [];
        titles.push(<td key='col.0' className='seat-index' style={{ borderTop: '1px solid #9B9B9B' }}></td>);
        for (var ci = 0; ci < colCount; ci++) {
            titles.push(<td key={'col.' + (ci + 1)} className='seat-title'>{ci + 1}</td>);
        }

        var table = <table style={{ marginLeft: '16px' }}><tbody>
            <tr key='row.0' style={{ height: '28px' }}>
                {titles}
            </tr>
            {
                this.state.seatRows.map((row, ri) => {
                    return <tr key={row.key} style={{ height: '32px' }}>
                        <td key='col.0' className='seat-index'>
                            {row.key}
                        </td>
                        {
                            row.seats.map((seat, ci) => {
                                var cell = null;
                                var dtStyle = { textAlign: 'center', cursor: 'default' };
                                if (seat.node !== null) {
                                    if (seat.node.seatType === "4" || seat.node.seatType === "2") {
                                        if (seat.rowSpan !== '1') {
                                            dtStyle['height'] = '100%';
                                        }

                                        cell =
                                            <div className="seat-selected" style={{ width: '100%', height: '100%', padding: '26px 0 0 0' }}>
                                                <div style={{ width: '100%', overflow: 'hidden', justifyContent: 'center', paddingTop: '8px' }}>
                                                    {seat.node.seatCode}
                                                </div>
                                            </div>
                                    }
                                    else {
                                        cell = seat.node.seatCode;
                                    }
                                }
                                else {
                                    cell = seat.rowIndex + '.' + seat.colIndex;
                                }

                                if (seat.node === null) {
                                    return (
                                        <td key={seat.key} className='seat-box' style={dtStyle}>
                                            {cell}
                                        </td>
                                    );
                                }

                                // 判断是否已经选中
                                var node = this.state.selectedMap[seat.node.seatCode];
                                if (node !== undefined) {
                                    dtStyle.background = '#51A2A2';
                                    return (
                                        <td key={seat.key} className='seat-box seat-selected' style={dtStyle} colSpan={seat.colSpan} rowSpan={seat.rowSpan}>
                                            {cell}
                                        </td>
                                    );
                                }

                                return (
                                    <td key={seat.key} className='seat-box seat-selected' style={dtStyle} colSpan={seat.colSpan} rowSpan={seat.rowSpan} onClick={this.onClickSeat.bind(this, row, seat.node)}>
                                        {cell}
                                    </td>
                                );
                            })
                        }
                    </tr>
                })
            }
        </tbody></table>;

        return (
            <Modal visible={this.state.modal} width='700px' title="修改工位图信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={null}
            >
                <div style={{width:'100%', height: '460px', overflow: 'auto', margin:'0 12px 12px 0'}}>
                    {table}
                </div>
            </Modal>
        );
    }
});

export default SelectSeatPage;
