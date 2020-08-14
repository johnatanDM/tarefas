import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome as Icon } from '@expo/vector-icons'
import moment from 'moment';
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

export default props => {
  const doneStyle = props.doneAt != null ? styles.tarefaConcluida : {}

  const date = props.doneAt || props.estimateAt
  const formattedDate = moment(props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM')

  const getRightContent = () => {
    return (
      <TouchableOpacity style={styles.right}
        onPress={() => props.onDelete && props.onDelete(props.id)}>
        <Icon name="trash" size={30} color='#fff' style={styles.excludeIcon}/>
      </TouchableOpacity>
    )
  }
  
  const getLeftContent = () => {
    return (
      <TouchableOpacity style={styles.left}>
        <Icon name="trash" size={20} color='#fff'/>
        <Text style={styles.excludeText}>Excluir</Text> 
      </TouchableOpacity>
    )
  }
  return(
    <Swipeable 
    renderRightActions={getRightContent}
    renderLeftActions={getLeftContent}
    onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => props.toggleTask(props.id)}>
          <View style={styles.checkContainer}>
            {getCheckView(props.doneAt)}
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={[styles.desc, doneStyle]}>{props.desc}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    </Swipeable>
  )
}

function getCheckView(doneAt) {
  if(doneAt != null) {
    return(
      <View style={styles.done}>
        <Icon name='check' size={20} color='#fff'/>
      </View>
    )
  } else {
    return(
      <View style={styles.pendding}></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pendding: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15,
  },
  tarefaConcluida: {
    textDecorationLine: 'line-through',
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 12,
  },
  right: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  excludeText: {
    fontFamily: commonStyles.fontFamily,
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  excludeIcon: {
    marginLeft: 10,
  }
})