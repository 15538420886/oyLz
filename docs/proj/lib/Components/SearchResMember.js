import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Icon, Input, Spin} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchResMemberStore = require('../data/SearchResMemberStore');
var SearchResMemberActions = require('../action/SearchResMemberActions');
import SelectResMember from './SelectResMember';

const propTypes = {
  children: React.PropTypes.node,
  poolUuid: React.PropTypes.string,
  render: React.PropTypes.func,
  showError: React.PropTypes.func,
  onSelectMember: React.PropTypes.func,
};

var SearchResMember = React.createClass({
    getInitialState: function () {
        var value = this.props.value;
        if (value === undefined) {
            value = '';
        }

		return {
			resMemberSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},

            filterValue: value,
            hint: '',
            poolUuid: this.props.poolUuid,
            projUuid: this.props.projUuid,
			showError: this.props.showError,
			onSelectMember: this.props.onSelectMember,
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(SearchResMemberStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var sp = this.refs.SelectResMemberPage;
        if( !sp.state.modal ){
    		var len = data.recordSet.length;
            if (len === 0) {
                var errMsg = (data.errMsg === '') ? '没有找到资源池人员' : data.errMsg;
                this.state.hint = errMsg;
                if(this.state.showError !== undefined){
		             this.state.showError(errMsg);
                 }
    		}
            else if(len === 1){
    			this.state.onSelectMember(data.recordSet[0]);
    		}
            else if(len > 1){
    			this.refs.SelectResMemberPage.clear( data );
    			this.refs.SelectResMemberPage.toggle();
    		}

            this.setState({
                loading: false,
                resMemberSet: data
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
        var filter = {};
        filter.projUuid = this.state.projUuid;
        filter.poolUuid = this.state.poolUuid;
        if (filter.poolUuid === undefined || filter.poolUuid === null || filter.poolUuid === '') {
            filter.corpUuid = window.loginData.compUser.corpUuid;
        }
        
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

		SearchResMemberActions.retrieveResMemberPage(filter, 1, 10);
	},

	render : function() {
	    const {
            poolUuid,
            projUuid,
			showError,
            onSelectMember,
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
                <SelectResMember ref="SelectResMemberPage" onSelectMember={this.state.onSelectMember} />
            </div>
        );
	}
});

SearchResMember.propTypes = propTypes;
module.exports = SearchResMember;
