/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch  } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Progress, Badge, message } from 'antd';
const stateArr = ['待发布','发布未开始','进行中','已结束','已撤销'];
@connect(({ paymentParticulars, loading }) => ({
  paymentParticulars,
  loading: loading.models.paymentParticulars,
}))
export default class HolisticTableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 催缴当前缴费活动
  hadleNotice = (e, record) => {
    this.props.dispatch({
      type: 'paymentParticulars/notice',
      payload: {
        itemId: record.itemId,
      },
      callback(type, ret) {
        if (type === 'success') {
          message.success('催缴成功！')
        } else {
          message.success('催缴失败！')
        }
      }
    });
  }

  render() {
    const { paymentParticulars: { pagination, data=[] }, styles } = this.props;
    let detailParams = JSON.parse(sessionStorage.getItem('detailParams')); 
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
        title: '状态',
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
        title: '缴费进度',
        dataIndex: 'progress',
        key: 'progress',
        width: 300,
        render: (text, record) => {
          return (
            <span>  
              {record && record.payCount && record.totalCount?
                <Progress percent={parseInt(Number(record.payCount)/Number(record.totalCount)*100)} status="active" /> :
                <Progress percent={0} status="active" />
              }
            </span>
          )
        }
      },
      {
        title: '缴费人数',
        dataIndex: 'count',
        key: 'count',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              <div><Badge status='processing' />应缴：{record && record.totalCount? record.totalCount : '0'} 人 </div>
              <div><Badge status='success' />实缴：{record && record.payCount? record.payCount : '0'} 人 </div>
              <div><Badge status='error' />未缴：{record && record.notPayCount? record.notPayCount : '0'} 人 </div>
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        width: 200,
        render: (text, record, index) => {
          return(
            <span>
              <a onClick={(e) => this.hadleNotice(e, record)} disabled={record && record.itemStatus == 2? false : true} href='javascript:;'>一键催缴</a>  
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
          dataSource={!_.isEmpty(detailParams)? [detailParams] : []}
          pagination={false}
          bordered
        />
      </div>
    );
  }
}
