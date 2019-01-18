/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Icon, Form, DatePicker, Radio, Button } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';
import moment from 'moment';
const FormItem = Form.Item;
import { Pie } from '@/components/Charts';
const { RangePicker } = DatePicker;
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
const formItemLayout = {
  labelCol: {
    xs: { span: 0 },
    sm: { span: 0 },
    md: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
  },
};
@connect(({ iPaySchoolDetail, loading }) => ({
  iPaySchoolDetail,
  loading: loading.models.iPaySchoolDetail,
}))
@Form.create()
export default class TypeChartCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      time: [],
      loading: false,
    };
  }

  // 活动时间发生变化
  handleTimeChange = (date, dateString) => {
    this.setState({
      time: dateString,
    })
  }

  // 点击查询按钮
  handleSubmit = (e, type) => {
    const { time } = this.state;
    this.setState({loading: true, value: ''})
    let [
      apiUrl,
      schoolId
    ] = [
      type == 't_count'? 'getRechargeCountStatisticByDate' : (type == 't_money'? 'getRechargeAmountStatisticByDate' : 'growingRechargeUserStatisticByDate'),
      sessionStorage.getItem('schoolId')
    ];
    let _this = this;
    this.props.dispatch({
      type: `iPaySchoolDetail/${apiUrl}`,
      payload: {
        schoolId: schoolId,
        startDay: time[0],
        endDay: time[1],
      },
      callback() {
        _this.setState({loading: false})
      }
    })
  }

  // 点击重置按钮
  handleReset = (e, type) => {
    this.props.form.resetFields();
    this.setState({ value: ''});
    let [
      apiUrl,
      aWeek, 
      today,
      schoolId
    ] = [
      type == 't_count'? 'getRechargeCountStatisticByDate' : (type == 't_money'? 'getRechargeAmountStatisticByDate' : 'growingRechargeUserStatisticByDate'),
      moment().subtract(7, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
      sessionStorage.getItem('schoolId')
    ];
    this.props.dispatch({
      type: `iPaySchoolDetail/${apiUrl}`,
      payload: {
        schoolId: schoolId,
        startDay: aWeek,
        endDay: today,
      },
    })
  }

  // 快速查询按钮切换
  onRadioChange = (e) => {
    const { type } = this.props;
    this.setState({ value: e.target.value });
    let [
      apiUrl,
      aWeek, 
      today, 
      aMonth,
      schoolId
    ] = [
      type == 't_count'? 'getRechargeCountStatisticByDate' : (type == 't_money'? 'getRechargeAmountStatisticByDate' : 'growingRechargeUserStatisticByDate'),
      moment().subtract(7, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
      moment().subtract(30, 'days').format('YYYY-MM-DD'),
      sessionStorage.getItem('schoolId')
    ];
    
    this.props.dispatch({
      type: `iPaySchoolDetail/${apiUrl}`,
      payload: {
        schoolId: schoolId,
        startDay: e.target.value === 'a'? aWeek : aMonth,
        endDay: today,
      },
    })
  }

  render() {
    const { iPaySchoolDetail: { allData, totalCount, totalAmount, filledCountList, filledAmountList, userRatio, addUserList, totalUserCount }, type, styles } = this.props;
    const { getFieldDecorator } = this.props.form;
    let title =
      type === 't_count'
        ? '单日充钱笔数'
        : type === 't_money'
          ? '单日充钱金额'
          : type === 'proportion'
            ? '充值用户数占比'
            : '新增开通充值用户';
    let data =
      type === 't_count'
        ? filledCountList
        : type === 't_money'
          ? filledAmountList
          : addUserList;
    let number =
      type === 't_count'
        ? totalCount
        : type === 't_money'
          ? totalAmount
          : totalUserCount;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: type === 't_count'? ["当日充值笔数"] : (type === 't_money'? ["当日充值金额"] : ["当日新增用户数"]),
      // 展开字段集
      key: "date",
      // key字段
      value: "count" // value字段
    });
    const cols = {
      month: {
        range: [0, 1]
      }
    };
    return (
      <Card className={styles.type_card}>
        <div className={styles.type_card_top}>
          <div className={styles.top_left}>
            <div className={styles.type_card_title}>{title}</div>
            <div style={{lineHeight: '50px'}}>{type != 'new_add'? '更新与' : ''}2018-10-14  18：22：33</div>
          </div>
          {/* {type === 't_count' &&
            <div className={styles.top_right}>
              <div>充值成功：50 笔</div>
              <div>充值失败：6 笔</div>
            </div>
          } */}
        </div>
        {type !== 'proportion' &&
          <div style={{width: '100%'}}>
            <span style={{fontSize: 30, color: "red", fontWeight: 400, marginRight: 4}}>{number}</span> {type === 't_count'? ' 笔' :(type === 'new_add'? '人' : ' 元') }
          </div> 
        }
        {type !== 'proportion' &&
          <div>
            <Form style={{overflow: 'hidden', clear: 'both'}}>
              <Col span="6">
                <FormItem {...formItemLayout} label="">
                  {getFieldDecorator('timeWidth', {
                    rules: [{ required: true, message: '请选择活动时间段！' }],
                    onChange: this.handleTimeChange,
                  })(
                    <RangePicker style={{ width: 200 }} />
                  )}
                </FormItem>
              </Col>
              <Col style={{marginTop: 4}} offset='1' span='9'>
                <Button onClick={(e) => this.handleSubmit(e, type)} style={{marginRight: 20}} type='primary'>查询</Button>
                <Button onClick={(e) => this.handleReset(e, type)}>重置</Button>
              </Col>
              <Col style={{marginTop: 4, textAlign: 'right'}} span='8'>
                <Radio.Group onChange={this.onRadioChange} value={this.state.value} buttonStyle="solid">
                  <Radio.Button value="a">最近7天</Radio.Button>
                  <Radio.Button value="b">最近30天</Radio.Button>
                </Radio.Group>   
              </Col>
            </Form>
          </div>
        }
        <div>
        {type == 't_money' &&
          <Chart height={320} data={dv} scale={cols} forceFit>
            <Legend />
            <Axis name="日期" />
            <Axis name="count" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="日期*count" size={2} color={"date"} />
            <Geom
              type="point"
              position="日期*count"
              size={4}
              shape={"circle"}
              color={"date"}
            />
          </Chart>
        }
        {type == 't_count' &&
          <Chart height={320} data={dv} scale={cols} forceFit>
            <Legend />
            <Axis name="日期" />
            <Axis name="count" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="日期*count" size={2} color={"date"}/>
            <Geom
              type="point"
              position="日期*count"
              size={4}
              shape={"circle"}
              color={"date"}
            />
          </Chart>
        }
        {type == 'new_add' &&
          <Chart height={320} data={dv} scale={cols} forceFit>
            <Legend />
            <Axis name="日期" />
            <Axis name="count" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="日期*count" size={2} color={"date"}/>
            <Geom
              type="point"
              position="日期*count"
              size={4}
              shape={"circle"}
              color={"date"}
            />
          </Chart>
        }
        { type == 'proportion' &&
          <div style={{paddingTop: 72, paddingBottom: 62}}>
            <Pie
              hasLegend
              title="全校总人数"
              subTitle="全校总人数"
              total={() => (
                <span
                  dangerouslySetInnerHTML={{
                    __html: userRatio.reduce((pre, now) => now.y + pre, 0)
                  }}
                />
              )}
              data={userRatio}
              valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
              height={294}
            />
        </div>
        }
        </div>
      </Card>
    );
  }
}
