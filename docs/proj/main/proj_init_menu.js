import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
    children: React.PropTypes.node
};

var ProjInitPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '项目初始化',
                    to: '/proj/proj2/ProjQueryPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/proj/proj2/ProjQueryPage/" children={this.props.children} />
        );
    }
});

ProjInitPageIndex.propTypes = propTypes;
module.exports = ProjInitPageIndex;
