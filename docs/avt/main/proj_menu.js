import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var ProjPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '项目信息',
                    to: '/avt/proj/ProjInfoPage/'
                },
                {
                    name: '临时项目',
                    to: '/avt/proj/ProjTempPage/'
                },
                {
                    name: '组员维护',
                    to: '/avt/proj/ResGroupManPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/avt/proj/ProjInfoPage/" children={this.props.children} />
        );
    }
});

ProjPageIndex.propTypes = propTypes;
module.exports = ProjPageIndex;
