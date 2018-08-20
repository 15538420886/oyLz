import React from 'react';
import { browserHistory } from 'react-router'

var IndexPage = React.createClass({
	getInitialState: function () {
		return null;
	},

	render: function () {
		console.log(this.props.location);
		return (
			<div>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
});

module.exports = IndexPage;
