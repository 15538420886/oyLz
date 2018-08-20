import React from 'react';

import { Radio, Spin } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import CodeMap from '../../hr/lib/CodeMap';

var SelectDate = React.createClass({
    getInitialState: function () {
        return {
            selectedDate: '',
            today: '',
            last1: '',
            last2: '',
            last3: '',
            next1: '',
            next2: '',
            next3: '',
        }
    },

    mixins: [CodeMap()],
    componentDidMount: function () {
        this.initPage(this.props.value)
    },
    componentWillReceiveProps:function(nextProps){
        this.initPage(nextProps.value)
    },

    initPage: function (value) {
        var oldValue = '' + value;
        if (value === undefined || this.state.selectedDate === oldValue || value === '') {
            return;
        }

        value = '' + value;
        var pos = value.indexOf('-');
        if (pos > 0) {
            value = value.split('-').join(',');
        }
        else {
            var year = value.substr(0, 4);
            var month = value.substr(4, 2);
            value = year + ',' + month
        }

        var date = new Date(value);
        var today = date.getFullYear() * 100 + (date.getMonth() + 1);
        today = '' + today;
        if (this.state.last3 >= today || this.state.next3 <= today || this.state.selectedDate === '') {
            this.times(date, 1);
            this.times(date, 2);
            this.times(date, 3);
            this.times2(date, 1);
            this.times2(date, 2);
            this.times2(date, 3);

            this.setState({
                today: today,
                last1: date.last1,
                last2: date.last2,
                last3: date.last3,
                next1: date.next1,
                next2: date.next2,
                next3: date.next3,
            });
        }

        this.state.selectedDate = oldValue;
    },

    times: function (date, i) {
        var lastTime = 'lastTime' + i;
        var last = 'last' + i;
        var y = 'y' + i;
        var m = 'm' + i;
        date[y] = date.getFullYear();
        date[m] = date.getMonth() - (i-1);
        if(date[m]<1) {
            date[m] = 13-i;
            date[y] = date.getFullYear()-1;
        }
        
        date[last] = date[y] + (date[m] >= 10 ? ''+date[m] : ('0' + date[m]));
    },
    times2: function (date, i) {
        var nextTime = 'nextTime' + i;
        var next = 'next' + i;
        var y = 'y' + 0 + i;
        var m = 'm' + 0 + i;
        date[y] = date.getFullYear();
        date[m] = date.getMonth() + (i+1);
        if(date[m]>12) {
            date[m] = '1';
            date[y] = date.getFullYear()+1;

        }
        date[next] = date[y] + (date[m] >= 10 ? '' +date[m] : ('0' + date[m]));
    },
    render: function () {
        return (
            <RadioGroup {...this.props}>
                <RadioButton value={this.state.last3}>{('' + this.state.last3).substring(4, 8)}</RadioButton>
                <RadioButton value={this.state.last2}>{('' + this.state.last2).substring(4, 8)}</RadioButton>
                <RadioButton value={this.state.last1}>{('' + this.state.last1).substring(4, 8)}</RadioButton>
                <RadioButton value={this.state.today}>{('' + this.state.today).substring(4, 8)}</RadioButton>
                <RadioButton value={this.state.next1}>{('' + this.state.next1).substring(4, 8)}</RadioButton>
                <RadioButton value={this.state.next2}>{('' + this.state.next2).substring(4, 8)}</RadioButton>
                <RadioButton value={this.state.next3}>{('' + this.state.next3).substring(4, 8)}</RadioButton>
            </RadioGroup>
        );
    }
});

module.exports = SelectDate;

