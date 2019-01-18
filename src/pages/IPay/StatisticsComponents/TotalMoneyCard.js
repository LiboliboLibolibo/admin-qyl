/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col } from 'antd';
import { WaterWave } from '@/components/Charts';
import _ from 'lodash';
@connect(({ iPayStatistics, loading }) => ({
  iPayStatistics,
  loading: loading.models.iPayStatistics,
}))
export default class TotalMoneyCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  componentDidMount() {
    this.timer = setInterval(()=>this.tick(),1000)
  }

  componentWillUnmount() {
    let timer
    clearInterval(timer)
  }

  tick() {
    this.setState({
      date : new Date()
    })
  }


  render() {
    const { iPayStatistics: { allData }, styles } = this.props;
    const allMoney =_.get(allData, 'data.countAndAmount.allDays.amount') || 0;
    let myDate = new Date();
    let year = myDate.getFullYear();
    let month = myDate.getMonth();
    let date = myDate.getDate();
    let nowDate = `${year}-${month}-${date}`
    let totalMoney = '￥' + String(allMoney).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (
      <Card className={styles.content_middle_card}>
        <div className={styles.middle_card_title}>全省一卡通充值总额</div>
        <div className={styles.middle_card_content}>
        <WaterWave
          height={320}
          title= { totalMoney }
          percent={40}
        />
        </div>
        <div className={styles.clock}>
          <p className="clock_num">{nowDate} {' '} {this.state.date.toLocaleTimeString()}</p>
        </div>
      </Card>
    );
  }
}
