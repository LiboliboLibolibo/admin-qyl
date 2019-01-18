/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Card, Button, Row, Col, Table, Tooltip, Popconfirm, message } from 'antd';
@connect(({ appVersion, loading }) => ({
  appVersion,
  loading: loading.models.appVersion,
}))

export default class TableComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 删除一条版本记录
  handleDelete = (e, record) => {
    let _this = this;
    this.props.dispatch({
      type: 'appVersion/deleteVers',
      payload: {
        id: record.ID,
      },
      callback(type, ret) {
        if (type === 'success') {
          message.success('删除成功！')
          _this.props.dispatch({
            type: 'appVersion/qylAppVers',
            payload: {
              page: 1,
              perPage: 10,  
            },
          })
        } else {
          message.success('删除失败！')
        }
      }
    })
  }
  // 分页
  handleTableChange(page) {
    this.props.dispatch({
      type: 'appVersion/qylAppVers',
      payload: {
        page: page.current,
        perPage: page.pageSize,
      },
    });
  }
  render() {
    const { appVersion: { pagination, loading, data }, styles } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        width: 80,
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        },
      },
      {
        title: 'app类型',
        dataIndex: 'PLATFORM_TYPE',
        key: 'PLATFORM_TYPE',
        width: 120,
        render: (text) => {
          return <span style={{color: text == 1?  '#32CD32' : '#A0522D' }}>{text == 0? 'Android' : 'IOS'}</span>;
        },
      },
      {
        title: '版本号',
        dataIndex: 'VER',
        key: 'VER',
        width: 100,
      },
      {
        title: '强制升级',
        dataIndex: 'IS_MUST_UPDATE',
        key: 'IS_MUST_UPDATE',
        width: 100,
        render: (text) => {
          return <span>{text == 1? '是' : '否'}</span>;
        },
      },
      {
        title: '发布时间',
        dataIndex: 'CREATE_TIME',
        key: 'CREATE_TIME',
        width: 160,
      },
      {
        title: '说明',
        dataIndex: 'VER_DESC',
        key: 'VER_DESC',
        width: 260,
        render: (text) => {
          return (
            <Tooltip title={text}>
            <span>{text&&text.length>20? text.substring(0,20)+'...' : text}</span>
          </Tooltip>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        width: 100,
        render: (text, record, index) => {
          return (
            <span>
              <Popconfirm title="确定删除当前版本记录?" onConfirm={e => this.handleDelete(e, record)} okText="是" cancelText="否">
                <a style={{color: 'red'}} href="javascript:void(0)">
                  删除
                </a>
              </Popconfirm>
              
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <h2>往期版本列表</h2>
        <Table
          rowKey={record => record.ID}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.handleTableChange.bind(this)}
          loading={loading}
          bordered
        />
      </div>
    );
  }
}
