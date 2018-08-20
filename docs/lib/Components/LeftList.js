import React from 'react';
import { Icon, Spin } from 'antd';

const propTypes = {
    children: React.PropTypes.node,
    caption: React.PropTypes.string,
    toolbar: React.PropTypes.object,
    dataSource: React.PropTypes.array,
    rowKey: React.PropTypes.string,
    title: React.PropTypes.string,
    rowStyle: React.PropTypes.object,
    loading: React.PropTypes.bool,
    activeNode: React.PropTypes.string,
    render: React.PropTypes.func,
    onClick: React.PropTypes.func
};

var LeftList = React.createClass({
    getInitialState: function () {
        return {
            current: this.props.activeNode,
            onClick: this.props.onClick,
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.state.current = nextProps.activeNode;
    },

    handleClick: function (mod, key, e) {
        if (this.state.onClick !== null && typeof (this.state.onClick) !== 'undefined') {
            this.setState({ current: key });
            this.state.onClick(mod);
        }
    },

    crtNode: function (data, rowKey, rowText, rowStyle) {
        var key = (rowKey === null || typeof (rowKey) === 'undefined') ? data['uuid'] : data[rowKey];
        var cName = (key === this.state.current) ? "ant-menu-item-selected ant-menu-item" : "ant-menu-item-active ant-menu-item";

        return <li className={cName} id={key} key={key} onClick={this.handleClick.bind(this, data, key)} style={{ paddingLeft: '20px', height: '30px', lineHeight: '30px' }}><Icon type="play-circle-o" />{data[rowText]}</li>;
    },

    render: function () {
        const {
	        children,
            caption,
            toolbar,
            width,
            dataSource,
            rowKey,
            rowText,
            rowStyle,
            activeNode,
            render,
            onClick,
            loading,
            ...attributes,
	    } = this.props;

        if (dataSource === null || typeof (dataSource) === 'undefined') {
            var listBody =
                <div className='left-list' style={{ flex: '0 0 ' + width, width: width }}>
                    {toolbar}
                    <div>暂时无数据</div>
                </div>
            return (
                <div style={{ display: 'flex', height: '100%' }} {...attributes}>
                    {loading ? <Spin style={{ minHeight: '200px' }}>{listBody}</Spin> : listBody}
                    <div style={{ width: '100%' }}>
                        {this.props.children}
                    </div>
                </div>
            );
        }

        var listBody =
            <ul className="ant-menu ant-menu-inline ant-menu-light ant-menu-root">
                {
                    dataSource.map((data, i) => {
                        return this.crtNode(data, rowKey, rowText, rowStyle)
                    })
                }
            </ul>
        return (
            <div style={{ display: 'flex', height: '100%' }} {...attributes}>
                <div className='left-list' style={{ flex: '0 0 ' + width, width: width, overflowY: 'auto' }}>
                    {toolbar}
                    {
                        (caption === null || typeof (caption) === 'undefined') ? null : <div className="ant-menu-item-group-title">{caption}</div>
                    }
                    {loading ? <Spin style={{ minHeight: '200px' }}>{listBody}</Spin> : listBody}
                </div>
                <div style={{ width: '100%', height: '100%', overflowX: 'hidden' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

LeftList.propTypes = propTypes;
module.exports = LeftList;
