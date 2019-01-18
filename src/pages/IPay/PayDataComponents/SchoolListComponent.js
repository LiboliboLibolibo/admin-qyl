/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Route, Switch } from 'dva/router';
import { Pagination } from 'antd';
import _ from 'lodash';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import moment from 'moment';
@connect(({ iPayData, loading }) => ({
  iPayData,
  loading: loading.models.iPayData,
}))

export default class SchoolListComponent extends Component {

  showTotal = () => {
    const { iPayData: { Pagination } } = this.props;
    return `共 ${Pagination.total} 条`;
  }

  // 分页
  handleTableChange(page) {
    const { iPayData: { conditionParams } } = this.props;
    this.props.dispatch({
      type: 'iPayData/totalCountGroupBySchool',
      payload: {
        ...conditionParams,
        page: page,
        perPage: 10,
      },
    })
  }

  // 点击查看详情
  handleLinkToDetail = (e, schoolId) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '../i-pay/i-pay-school-detail',
        query: {
          schoolId: schoolId,
        },
      })
    );
  }

  render() {
    const { iPayData: { dataList=[], pagination }, styles } = this.props;
    let now = moment().format('YYYY-MM-DD HH:mm:ss')
    let isDataEmpty = _.isEmpty(dataList)? true : false;
    return (
      <div className={styles.school_list_box}>
        { !isDataEmpty && 
          dataList.map (D => {
            return (
              <div className={styles.school_item}>
                <div className={styles.item_name}>{D.SCHOOL_NAME}</div>
                <div className={styles.item_time}>截止{ now }</div>
                <div className={styles.item_total_money}>
                  <div>{D.TOTAL_AMOUNT}元</div>
                  <div>
                    <p>充值人数：{D.USER_COUNT}人</p>
                    <p>充值笔数：{D.COUNT}笔</p>
                  </div>
                </div>
                <div className={styles.item_yes_money}>
                  <span style={{float: 'left'}}> 
                  <NumberInfo
                    // subTitle={<span>Visits this week</span>}
                    style={{fontSize: 14, color: '#000'}}
                    total={`昨天充值金额： ${numeral(12321).format('0,0')}`}
                    status="up"
                    subTotal={17.1}
                    theme={'light'}
                  />
                  </span>
                  <span style={{float: 'right'}}><a onClick={(e) => this.handleLinkToDetail(e, D.SCHOOL_ID)} href="javascript:;">查看详情</a></span>
                </div> 
              </div>
            )
          })
        }
        { !isDataEmpty && 
          <div style={{width: '100%', textAlign: 'center'}}>
            <Pagination 
              {...pagination}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
        }
        { isDataEmpty && 
          <div style={{width: '100%', lineHeight: '300px', background: '#f2f2f2', textAlign: 'center'}}>
            <h2>暂无数据</h2>
          </div>
        }
      </div>
    );
  }
}