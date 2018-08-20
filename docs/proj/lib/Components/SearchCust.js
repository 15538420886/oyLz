import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Icon, Input, Spin} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchCustStore = require('../data/SearchCustStore');
var SearchCustActions = require('../action/SearchCustActions');
import SelectCust from './SelectCust';

const propTypes = {
  children: React.PropTypes.node,
  corpUuid: React.PropTypes.string,
  render: React.PropTypes.func,
  showError: React.PropTypes.func,
  onSelectCust: React.PropTypes.func,
};

var SearchCust = React.createClass({
	getInitialState : function(){
		return {
			CustSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},

            filterValue: '',
            hint: '',
			corpUuid: window.loginData.compUser.corpUuid,
			showError: this.props.showError,
			onSelectCust: this.props.onSelectCust,
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(SearchCustStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var sp = this.refs.SelectCustPage;
        if( !sp.state.modal ){
    		var len = data.recordSet.length;
            if (len === 0) {
                var errMsg = (data.errMsg === '') ? '没有找到公司' : data.errMsg;
                this.state.hint = errMsg;
                if(this.state.showError !== undefined){
		             this.state.showError(errMsg);
                 }
    		}
            else if(len === 1){
    			this.state.onSelectCust(data.recordSet[0]);
    		}
            else if(len > 1){
    			this.refs.SelectCustPage.clear( data );
    			this.refs.SelectCustPage.toggle();
    		}

            this.setState({
                loading: false,
                CustSet: data
            });
        }
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
        if (Common.isIncNumber(value)){
			filter.custCode = value;
		}else{
			filter.custName = value;
		}

		 this.setState({
            filterValue: value,
            loading: true,
            hint: '',
        });

		SearchCustActions.retrieveProjCustPage(filter);
	},

	render : function() {
	    const {
			corpUuid,
			showError,
            onSelectCust,
            style,
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
                    <Search placeholder="(客户编号/名称查询)" defaultValue={this.state.filterValue} style={style3} {...attributes} onSearch={this.onSearch} />
                </div>
                <div style={{ flex: '0 0 40px', width: '40px', paddingTop: '16px' }}>
                    <Spin style={{ width: '100%', height: '100%' }}></Spin>
                </div>
            </div>
        }
        else {
            searchBox = <Search placeholder="(客户编号/名称查询)" defaultValue={this.state.filterValue} style={style3} {...attributes} onSearch={this.onSearch} />
        }

        return (
            <div>
                {searchBox}
                {this.state.hint === '' ? null : <div style={style2} className="ant-form-explain"><span className="errorHint">{this.state.hint}</span></div>}
                <SelectCust ref="SelectCustPage" onSelectCust={this.state.onSelectCust} />
            </div>
        );
	}
});

SearchCust.propTypes = propTypes;
module.exports = SearchCust;
