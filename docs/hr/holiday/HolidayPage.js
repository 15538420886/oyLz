'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

import ServiceMsg from '../../lib/Components/ServiceMsg';
import ModalForm from '../../lib/Components/ModalForm';
import CodeMap from '../lib/CodeMap';
import CreateHolidayPage from './Components/CreateHolidayPage';
import {Button, Table, Icon, Modal, Spin, Input, layout, Form, Radio} from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var HolidayStore = require('./data/HolidayStore.js');
var HolidayActions = require('./action/HolidayActions');

var year = new Date().getFullYear();
var PersonSalaryLogPage = React.createClass({
    getInitialState : function() {
        return {
            holidaySet:{
                recordSet:[],
                operation: '',
			    errMsg: ''
            },
            year:year,
            last:year-1,
            next:year+1,
            viewYear:year,
            date:[31,28,31,30,31,30,31,31,30,31,30,31],
            loading: false,
            holidayMap: {},
            tables:[],
        }
    },

    mixins: [Reflux.listenTo(HolidayStore, "onServiceComplete"), ModalForm('holiday')],
	onServiceComplete: function(data) {
        var date = this.state.date;
        var year = this.state.viewYear;
        date[1] = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)? 29 : 28;

        var holidayMap = {};
        if (data.recordSet.length != 0) {
            data.recordSet.map((nd, i) => {
                holidayMap[nd.date] = nd.flag;
            });
        }
        else {
            var month = 1;
            date.map((days, i) => {
                let week = this.weekFunc(year, month, 1) === 0 ? 7:this.weekFunc(year, month, 1);
                let row = Math.ceil( (days + week-1) / 7 );
                for(var ri=0 ; ri < row ; ri++){
                    for(let i = 6 ; i < 8 ; i++){
                        let day = ri * 7 + i - week + 1;
                        if (day > 0 && day < days + 1) {
                            let date = "" + (month>9 ? month : "0" + month) + (day > 9 ? day:"0"+day);
                            holidayMap[date] = '1';
                        }
                    };
                    //Common.getLunar
                    for(let i = 1 ; i < 8 ; i++){
                        let day = ri * 7 + i - week + 1;
                        let date = "" + (month>9 ? month : "0" + month) + (day > 9 ? day:"0"+day);
                        let lunar = Common.getLunar(year, month, day);
                        let qingming = this.qingming(year);

                        if( lunar == "0101" || lunar == "0102" || lunar == "0505" || lunar == "0815" 
                        || date == "1001" || date == "1002" || date == "1003" || date == "0501" || date == "0101" 
                        || date == qingming){

                            holidayMap[date] = '2';
                        }
                        if(lunar == "0101"){
                            let chuxi = '';
                            let nDate = parseInt(date);
                            let m = Math.floor(nDate / 100);
                            let d = nDate % 100 ;
                            if(nDate % 100 == 1){
                                if(m == 1){
                                    chuxi = '';
                                }else{
                                    chuxi = (m - 1) > 9 ? (m - 1) : "0" + ( m - 1 ) + this.state.date[m - 2];
                                }
                            }else{
                                chuxi = (nDate - 1) > 1000 ? "" + (nDate - 1) : "0" + (nDate - 1);
                            }
                            holidayMap[chuxi] = '2';
                        }
                    }
                };

                month++;
            });
        }

        this.createTable(date, holidayMap);
        this.setState({
            loading: false,
            date: date,
            holidayMap: holidayMap
        });
    },
    componentDidMount : function(e){   
        this.setState({
            loading: true,
            viewYear: year,    
        });
        HolidayActions.initHoliday( year);
    },
    onChangeView: function(e) {
        var year = e.target.value;
        this.state.viewYear = year;
        this.setState({
			loading: true
		});
		HolidayActions.initHoliday( year );
	},
    handleOpenWindow : function(holiday, event)
    {
        if(holiday != null){
            this.refs.createWindow.initPage(holiday);
            this.refs.createWindow.toggle();
        }
    },
    createTable: function (date, holidayMap) {
        var tables = [];
        //生成表格
        var month = 1;
        var year = this.state.viewYear;
        date.map((days, i) => {
            let week = this.weekFunc(year, month, 1) === 0 ? 7:this.weekFunc(year, month, 1);
            let row = Math.ceil( (days + week-1) / 7 );
            var list = [];
            for(var ri=0 ; ri < row ; ri++){
                var cells = [];
                for(let i = 1 ; i < 8 ; i++){
                    let td = ''
                    let day= ri*7+i-week+1 ;
                    if(day>days || day<1){
                        td = <td ></td>;
                    }
                    else {
                        // 生成天数，确定颜色
                        var color = '';
                        var border = '';
                        let date = "" + (month > 9 ? month : "0" + month) + (day > 9 ? day : "0" + day);
                        var flag = holidayMap[date];
                        if (flag === '1') {
                            color = 'red';
                        }
                        else if (flag === '2') {
                            color = 'red';
                            border = '3px solid rgb(255, 187, 0)';                            
                        }

                        td = <td key={date}
                                style={{ textAlign: 'center', color: color ,border : border, cursor: 'pointer' }}
                                onClick={this.handleOpenWindow.bind(this, date)}>
                                {day}
                            </td>;
                    }
                    
                    cells.push(td);
                };

                list.push(<tr key={ri} style={{height: '32px',borderBottom:'1px solid #ccc'}}>
                            {cells}
                        </tr>)
            }

            tables.push(<div style={{margin:'0 20px 0 0',float:'left',height: '260px'}}><table><tbody>
                <tr>
                    <td colSpan="7" style={{width: '40px',minWidth: '40px',textAlign: 'left'}}>{month}月</td>
                </tr>
                <tr key='row.0' style={{height: '28px',borderBottom:'1px solid #ccc'}}>
                    <td key='1' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>一</td>
                    <td key='2' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>二</td>
                    <td key='3' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>三</td>
                    <td key='4' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>四</td>
                    <td key='5' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>五</td>
                    <td key='6' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>六</td>
                    <td key='7' style={{width: '40px',minWidth: '40px',textAlign: 'center',background: '#DBEDFF'}}>日</td>
                </tr>
                {list}
            </tbody></table></div>);
            month++;
        });
        this.setState({tables: tables});
    },

    //计算周几函数
    weekFunc: function(y, m, d){
        let year = y % 100;
        let century = Math.ceil(y/100) - 1;
        let month = m ;
        if(m < 3){
            month = month+12;
            year = (y-1) % 100;
            century = Math.ceil((y-1)/100) - 1;
        }
        let week = (year + Math.floor(year / 4) 
                    + Math.floor(century / 4) 
                    - 2 * century 
                    + Math.floor(26 * (month + 1) / 10) 
                    + d - 1) % 7;
        if(week < 0){
            week = week + 7;
        }
        return week;    
    },
    qingming:function qingming(y) {
        var c = 0;
        if(y > 1999 && y < 2100){
            c = 4.81 ;
        }
        var d = Math.floor( y % 100 * 0.2422 + c) -  Math.floor( y % 100 / 4);
        return c === 0 ? "" : "040" + d ;
    },

    render : function() {
        var holidayMap = this.state.holidayMap;
        var tables = this.state.tables;
        var year = this.state.viewYear;

        return (
            <div className='grid-page' style={{width:'100%', padding: '24px 0 0 24px',overflowY:'scroll'}}>
                <ServiceMsg ref='mxgBox' svcList={['holiday/retrieve']}/>
                <div style={{marginBottom:'24px'}} >
                     <RadioGroup value={this.state.viewYear} onChange={this.onChangeView}>
                        <RadioButton value={this.state.last}>{this.state.last}</RadioButton>
                        <RadioButton value={this.state.year}>{this.state.year}</RadioButton>
                        <RadioButton value={this.state.next}>{this.state.next}</RadioButton>
                    </RadioGroup>
                </div>
                <div style={{width:'100%'}}>
                    {year === '' ? '' : tables}
                </div>

                <CreateHolidayPage ref="createWindow" holidayMap={holidayMap} onChange={this.onChange} year={year} />
            </div>
        );
    }
});

module.exports = PersonSalaryLogPage;
