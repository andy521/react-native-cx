import React, { Component, PropTypes } from 'react'
import PureListView from '../components/PureListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as dataActions from '../reducers/data'
import TopicsCarousel from './TopicsCarousel'
import {subscribe, unsubscribe} from '../reducers/schedule'
import Topic from './Topic'
import {genSubscribedData} from '../helper/dataHelper'
import SubscribeButton from '../components/SubscribeButton'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'

class MySchedules extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    load: PropTypes.func.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    loadFailed: PropTypes.func.isRequired,
    days: PropTypes.array.isRequired,
    topics: PropTypes.object,
    emptyOperation: PropTypes.func
  };

  render () {
    return (
      <View style={styles.container}>
        <View style={[styles.center, {backgroundColor: '#1e4b9a', height: 250, paddingTop: 25}]}>
          <Image source={require('../assets/gmtc.png')} style={{padding: 10, height: 60, width: 200}} />
          <Text style={{color: 'white', fontSize: 29, marginTop: 15}}>全球移动技术大会</Text>
          <Text style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, marginTop: 3}}>2016年6月24日－25日</Text>
          <View style={styles.title}>
            <Text style={{color: 'white', fontSize: 16}}>我 的 订 阅</Text>
          </View>
        </View>
        <PureListView data={this.props.topics}
          enableEmptySections
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderRow}
          renderEmptyView={this.renderEmptyView}/>
      </View>
    )
  }

  renderEmptyView = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('../assets/no-topics-added.png')} />
        <Text style={styles.message}>您订阅的主题将会{'\n'}展现于此</Text>
        <SubscribeButton style={{width: 220, marginTop: 15}} onPress={this.props.emptyOperation}/>
      </View>
    )
  }

  renderRow = (item, index, renderSeparator) => {
    return (
      <TouchableOpacity onPress={() => this.goToCarousel(item)}>
        <Topic topic={item} isSubscribed/>
      </TouchableOpacity>
    )
  }

  goToCarousel = (item) => {
    this.props.navigator.push({
      component: TopicsCarousel,
      day: this.props.days[item.room.day_id - 1],
      topic: item
    })
  }

  renderSectionHeader = (sectionData, time) => {
    const dayName = ['第一天', '第二天']
    if (sectionData.length === 0) {
      return null
    }
    return (
      <View key={time} style={{backgroundColor: '#eeeeee'}}>
        <Text style={[{margin: 6, marginLeft: 8}, styles.font]}>{dayName[time - 1]}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  font: {
    fontSize: 12.5,
    color: '#555555'
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'},
  message: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: '#7a8698'
  }
})

const mapStateToProps = state => ({
  loading: state.data.loading,
  error: state.data.error,
  days: state.data.days,
  topics: genSubscribedData(state.data.days, state.schedule.subscription)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({...dataActions, unsubscribe}, dispatch)

module.exports = connect(mapStateToProps, mapDispatchToProps)(MySchedules)
