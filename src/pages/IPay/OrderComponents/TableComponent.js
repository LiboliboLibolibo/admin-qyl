
/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Col, Button, Row } from 'antd';
@connect(({ iPayOrder, loading }) => ({
  iPayOrder,
  loading: loading.models.iPayOrder,
}))
export default class TableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 点击展示详情
  showDetail = (e, record) => {
    this.props.changeDetailComponent();
    this.props.dispatch({
      type: 'iPayOrder/updateState',
      payload: {
        detailRecord: record,
      },
    })
  }
  // 分页
  handleTableChange(page) {
    const { iPayOrder: { conditionParams } } = this.props;
    this.props.dispatch({
      type: 'iPayOrder/getOrderList',
      payload: {
        ...conditionParams,
        page: page.current,
        perPage: page.pageSize,
      },
    })
  }
  render() {
    const { iPayOrder: {data, pagination, loading }, styles } = this.props;

    const columns = [
      {
        title: '平台订单号',
        dataIndex: 'RECHARGE_ORDER_ID',
        key: 'RECHARGE_ORDER_ID',
        width: 120,
      },
      {
        title: '学校',
        dataIndex: 'STUDENT.CLASS.SCHOOL_NAME',
        key: 'STUDENT.CLASS.SCHOOL_NAME',
        width: 200,
      },
      {
        title: '年级',
        dataIndex: 'STUDENT.CLASS.GRA_NAME',
        key: 'STUDENT.CLASS.GRA_NAME',
        width: 80,
      },
      {
        title: '班级',
        dataIndex: 'STUDENT.CLASS.CLASS_NAME',
        key: 'STUDENT.CLASS.CLASS_NAME',
        width: 80,
      },
      {
        title: '姓名',
        dataIndex: 'STUDENT.STUDENT_NAME',
        key: 'STUDENT.STUDENT_NAME',
        width: 80,
        render: (text, record) => {
          return (<a onClick={(e) => this.showDetail(e, record)}>{text}</a>)
        }
      },
      {
        title: '卡号',
        dataIndex: 'STUDENT.CARDCODE',
        key: 'STUDENT.CARDCODE',
        width: 120,
      },
      {
        title: '学籍号',
        dataIndex: 'STUDENT.STUDENT_CODE',
        key: 'STUDENT.STUDENT_CODE',
        width: 120,
      },
      {
        title: '订单状态',
        dataIndex: 'STATUS_CN',
        key: 'STATUS_CN',
        width: 100,
      },
      {
        title: '交易金额（元）',
        dataIndex: 'AMOUNT',
        key: 'AMOUNT',
        width: 120,
        render: (text, record) => {
          return (<span>{text? text/100 : ''}</span>)
        }
      },
      {
        title: '创建时间',
        dataIndex: 'CREATE_TIME',
        key: 'CREATE_TIME',
        width: 200,
      },
      {
        title: '写卡时间',
        dataIndex: 'RechargeThirdInterface.TRADE_TIME',
        key: 'RechargeThirdInterface.TRADE_TIME',
        width: 200,
      },
      // {
      //   title: '备注',
      //   dataIndex: 'mark',
      //   key: 'mark',
      //   width: 180,
      // }
    ];

    return (
      <div>
        <Table
          rowKey={record => record.ID}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.handleTableChange.bind(this)}
          scroll={{ x: 1930 }}
          loading={loading}
          bordered
        />
    </div>
    );
  }
}
