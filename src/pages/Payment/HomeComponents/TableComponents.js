/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Table } from 'antd';
import DelayModal from './DelayModal';
import RevokeModal from './RevokeModal';
const stateArr = ['待发布','发布未开始','进行中','已结束','已撤销'];
@connect(({ paymentHome, loading }) => ({
  paymentHome,
  loading: loading.models.paymentHome,
}))
export default class TableComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 展示延期弹出框
  handleShowDelayModal = (e, record) => {
    this.props.dispatch({
      type: 'paymentHome/updateState',
      payload: {
        showDelayModal: true,
        delayRecord: record,
      },
    }); 
  }

  // 展示撤销弹出框
  handleShowRevokeModal = (e, record) => {
    this.props.dispatch({
      type: 'paymentHome/updateState',
      payload: {
        showRevokeModal: true,
        revokeRecord: record,
      },
    }); 
  }

  // 点击查看详情调到详情界面
  handleLinkDetail = (e, record) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '../payment/payment-particulars',
        query: {
          detailParams: {
            ...record,
          }
        },
      })
    );
  }

  // 分页
  handleTableChange(page) {
    const { paymentHome: { conditionParams, schoolId } } = this.props;
    this.props.dispatch({
      type: 'paymentHome/items',
      payload: {
        ...conditionParams,
        schoolId: schoolId,
        current: page.current,
        size: page.pageSize,
      },
    }); 
    this.props.dispatch({
      type: 'paymentHome/updateState',
      payload: {
        conditionParams:{
          current: page.current,
          size: page.pageSize,
          ...conditionParams,          
        }
      },
    }); 
  }
  render() {
    const { paymentHome: { pagination, loading, data = [] }, styles } = this.props;

    const columns = [
      {
        title: '缴费项目',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 200,
      },
      {
        title: '起止时间',
        dataIndex: 'time',
        key: 'time',
        width: 200,
        render: (text,record) => {
          return (<span>
            {record && record.startTime? record.startTime : ''}至{record && record.endTime? record.endTime : ''}
          </span>)
        }
      },
      {
        title: '缴费状态',
        dataIndex: 'itemStatus',
        key: 'itemStatus',
        width: 120,
        render: (text) => {
          return (<span>
            {stateArr[text]}
          </span>)
        }
      },
      {
        title: '每人应缴(元)',
        dataIndex: 'itemMoney',
        key: 'itemMoney',
        width: 140,
      },
      {
        title: '应缴人数(人)',
        dataIndex: 'totalCount',
        key: 'totalCount',
        width: 140,
      },
      {
        title: '应缴总额(元)',
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        width: 140,
      },
      {
        title: '实缴人数(人)',
        dataIndex: 'payCount',
        key: 'payCount',
        width: 140,
      },
      {
        title: '未缴人数(人)',
        dataIndex: 'notPayCount',
        key: 'notPayCount',
        width: 140,
      },
      {
        title: '实收总额(元)',
        dataIndex: 'payMoney',
        key: 'payMoney',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        width: 200,
        render: (text, record, index) => {
          return(
            <span>
              <a onClick={(e) => this.handleLinkDetail(e, record)} href='javascript:;'>查看详情</a>
              {record && record.payCount && record.itemStatus && record.itemStatus <= 1  && record.payCount == 0 &&
                <span>
                  {' '} | {' '}<a onClick={(e) => this.handleShowRevokeModal(e, record)} style={{color: 'red'}} href='javascript:;'>撤销</a>
                </span>
              } 
              { record && record.itemStatus && record.itemStatus <= 2 &&
                <span>
                  {' '} | {' '}<a onClick={(e) => this.handleShowDelayModal(e, record)} style={{ color: '#886600' }} href='javascript:;'>延期</a>
                </span>
              }     
            </span>            
          )
        }
      },
    ];

    return (
      <div>
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.handleTableChange.bind(this)}
          loading={loading}
          bordered
        />
        <DelayModal styles={styles}/>
        <RevokeModal styles={styles}/>
      </div>
    );
  }
}
