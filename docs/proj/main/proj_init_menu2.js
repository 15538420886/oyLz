import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
    children: React.PropTypes.node
};

var ProjInnPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '批量导入组员',
                    to: '/proj/proj2/BatchInputPage/'
                },
                {
                    name: '返回',
                    to: ProjContext.goBackUrl,
                    icon: 'rollback'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/proj/proj2/BatchInputPage/" children={this.props.children} />
        );
    }
});

ProjInnPageIndex.propTypes = propTypes;
module.exports = ProjInnPageIndex;
