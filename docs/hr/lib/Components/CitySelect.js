import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Select, Spin } from 'antd';
const Option = Select.Option;

var TripCityStore = require('../../trip_city/data/TripCityStore.js');
var TripCityActions = require('../../trip_city/action/TripCityActions');

var CitySelect = React.createClass({
    getInitialState : function() {
        return {
            tripCitySet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            loading: false
        }
    },

	mixins: [Reflux.listenTo(TripCityStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.tripCitySet = data;
	      this.setState({loading: false});
	  }
	},

  componentDidMount : function(){
      this.state.tripCitySet = {
          recordSet: [],
          operation : '',
          errMsg : ''
      };

		this.setState({loading: true});
      var corp = window.loginData.compUser;
      var corpUuid=(corp === null) ? '' : corp.corpUuid;
      TripCityActions.initHrTripCity(corpUuid);
  },

  render : function(){
		var recordSet = this.state.tripCitySet.recordSet;
		var box = 
	      <Select {...this.props}>
	        {
	          recordSet.map((env, i) => {
	              return <Option key={env.uuid} value={env.uuid}>{env.cityType}</Option>
	          })
	        }
	      </Select>

    return this.state.loading ? <Spin>{box}</Spin> : box;
  }

})

export default CitySelect;
