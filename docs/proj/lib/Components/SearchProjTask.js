import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Icon, Input, Spin} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchProjTaskStore = require('../data/SearchProjTaskStore');
var SearchProjTaskActions = require('../action/SearchProjTaskActions');
import SelectProjTask from './SelectProjTask';
var ProjContext = require('../../ProjContext');

const propTypes = {
  children: React.PropTypes.node,
  grpUuid: React.PropTypes.string,
  render: React.PropTypes.func,
  showError: React.PropTypes.func,
  onSelectProjTask: React.PropTypes.func,
};

var SearchProjTask = React.createClass({
    getInitialState: function () {
        var value = this.props.value;
        if (value === undefined) {
            value = '';
        }

		return {
			ProjTaskSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},

            filterValue: value,
            hint: '',
			grpUuid: this.props.grpUuid,
			showError: this.props.showError,
			onSelectProjTask: this.props.onSelectProjTask,
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(SearchProjTaskStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var sp = this.refs.SelectProjTaskPage;
        if( !sp.state.modal ){
    		var len = data.recordSet.length;
            if (len === 0) {
                var errMsg = (data.errMsg === '') ? '没有找到订单和任务' : data.errMsg;
                this.state.hint = errMsg;
                if(this.state.showError !== undefined){
		             this.state.showError(errMsg);
                 }
    		}
            else if(len === 1){
    			this.state.onSelectProjTask(data.recordSet[0]);
    		}
            else if(len > 1){
    			this.refs.SelectProjTaskPage.clear( data );
    			this.refs.SelectProjTaskPage.toggle();
    		}

            this.setState({
                loading: false,
                ProjTaskSet: data
            });
        }
    },

    componentDidMount: function () {
    },
    setValue: function (value) {
        this.setState({ filterValue: value });
    },
    handleOnChange: function (e) {
        this.setState({
            filterValue: e.target.value
        });
    },

	handleClick: function(mod, key, e) {
		if(this.state.onClick !== null && typeof(this.state.onClick) !== 'undefined'){
			this.setState({current: key});
			this.state.onClick( mod );
		}
	},

	onSearch:function(value){
		var filter={};
        filter.grpUuid = this.state.grpUuid;
        if (filter.grpUuid === undefined || filter.grpUuid === null || filter.grpUuid === '') {
            filter.corpUuid = window.loginData.compUser.corpUuid;
        }
			filter.ordName = value;
		
		 this.setState({
            filterValue: value,
            loading: true,
            hint: '',
        });

		SearchProjTaskActions.retrieveProjTaskPage(filter, 1, 10);
	},

	render : function() {
	    const {
			grpUuid,
			showError,
            onSelectProjTask,
            style,
            value,
	        ...attributes,
        } = this.props;

        var style2 = {};
        var style3 = style;
        if (this.state.hint !== '') {
            style3 = {};
            Utils.copyValue(style, style2);
            Utils.copyValue(style, style3);
            style2.paddingTop = '4px';
            style3.paddingBottom = '0';
        }

        var searchBox = null;
        if (this.state.loading) {
            searchBox = <div style={{ display: '-webkit-box' }}>
                <div style={{ height: '100%', overflowX: 'hidden' }}>
                    <Search placeholder="(订单名称查询)" value={this.state.filterValue} style={style3} {...attributes} onChange={this.handleOnChange} onSearch={this.onSearch} />
                </div>
                <div style={{ flex: '0 0 40px', width: '40px', paddingTop: '16px' }}>
                    <Spin style={{ width: '100%', height: '100%' }}></Spin>
                </div>
            </div>
        }
        else {
            searchBox = <Search placeholder="(订单名称查询)" value={this.state.filterValue} style={style3} {...attributes} onChange={this.handleOnChange} onSearch={this.onSearch} />
        }

        return (
            <div>
                {searchBox}
                {this.state.hint === '' ? null : <div style={style2} className="ant-form-explain"><span className="errorHint">{this.state.hint}</span></div>}
                <SelectProjTask ref="SelectProjTaskPage" onSelectProjTask={this.state.onSelectProjTask} />
            </div>
        );
	}
});

SearchProjTask.propTypes = propTypes;
module.exports = SearchProjTask;
