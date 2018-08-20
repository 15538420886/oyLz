import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Icon, Input, Spin} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchOutStaffStore = require('../data/SearchOutStaffStore');
var SearchOutStaffActions = require('../action/SearchOutStaffActions');
import SelectOutStaff from './SelectOutStaff';

const propTypes = {
  children: React.PropTypes.node,
  outUuid: React.PropTypes.string,
  render: React.PropTypes.func,
  showError: React.PropTypes.func,
  onSelectStaff: React.PropTypes.func,
};

var SearchOutStaff = React.createClass({
    getInitialState: function () {
        var value = this.props.value;
        if (value === undefined) {
            value = '';
        }

		return {
			outStaffSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},

            filterValue: value,
            hint: '',
			corpUuid: window.loginData.compUser.corpUuid,
            outUuid: this.props.outUuid,
			showError: this.props.showError,
			onSelectStaff: this.props.onSelectStaff,
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(SearchOutStaffStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var sp = this.refs.SelectOutStaffPage;
        if( !sp.state.modal ){
    		var len = data.recordSet.length;
            if (len === 0) {
                var errMsg = (data.errMsg === '') ? '没有找到外协人员' : data.errMsg;
                this.state.hint = errMsg;
                if(this.state.showError !== undefined){
		             this.state.showError(errMsg);
                 }
    		}
            else if(len === 1){
    			this.state.onSelectStaff(data.recordSet[0]);
    		}
            else if(len > 1){
    			this.refs.SelectOutStaffPage.clear( data );
    			this.refs.SelectOutStaffPage.toggle();
    		}

            this.setState({
                loading: false,
                outStaffSet: data
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
		filter.corpUuid = this.state.corpUuid;
		filter.outUuid = this.state.outUuid;
        if (Common.isIncNumber(value)){
			filter.staffCode = value;
		}else{
			filter.perName = value;
		}

		 this.setState({
            filterValue: value,
            loading: true,
            hint: '',
        });

		SearchOutStaffActions.retrieveOutStaffPage(filter, 1, 10);
	},

	render : function() {
	    const {
            outUuid,
			showError,
            onSelectStaff,
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
                    <Search placeholder="(姓名/员工编号查询)" value={this.state.filterValue} style={style3} {...attributes} onChange={this.handleOnChange} onSearch={this.onSearch} />
                </div>
                <div style={{ flex: '0 0 40px', width: '40px', paddingTop: '16px' }}>
                    <Spin style={{ width: '100%', height: '100%' }}></Spin>
                </div>
            </div>
        }
        else {
            searchBox = <Search placeholder="(姓名/员工编号查询)" value={this.state.filterValue} style={style3} {...attributes} onChange={this.handleOnChange} onSearch={this.onSearch} />
        }

        return (
            <div>
                {searchBox}
                {this.state.hint === '' ? null : <div style={style2} className="ant-form-explain"><span className="errorHint">{this.state.hint}</span></div>}
                <SelectOutStaff ref="SelectOutStaffPage" onSelectStaff={this.state.onSelectStaff} />
            </div>
        );
	}
});

SearchOutStaff.propTypes = propTypes;
module.exports = SearchOutStaff;