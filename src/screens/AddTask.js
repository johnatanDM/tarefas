import React, { useState } from 'react'
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableWithoutFeedback,
  TouchableOpacity, 
  Platform} from 'react-native'
import commonStyles from '../commonStyles'
import { TextInput } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'


const initialState = { desc: '', date: new Date(), showDatePicker: false}

export default props => {

  const [novaTarefa, setNovaTarefa] = useState(initialState)

  const getDatePicker = () => {
   let datePicker = <DateTimePicker 
      value={novaTarefa.date}
      onChange={(_,newDate) => setNovaTarefa({...novaTarefa, date: newDate, showDatePicker: false})}
      mode='date'
    />
    const dateString = moment(novaTarefa.date).format('ddd, D [de] MMMM [de] YYYY')
    if(Platform.OS === 'android') {
      datePicker = (
        <View style={styles.datePicker}>
          <TouchableOpacity onPress={() => setNovaTarefa({...novaTarefa, showDatePicker: true})}>
            <Text style={styles.date}>
              {dateString}
            </Text>
          </TouchableOpacity>
          {novaTarefa.showDatePicker && datePicker}
        </View>
      )
    }
    return datePicker
  }

  const save = () => {
    const newTask = {
      desc: novaTarefa.desc,
      date: novaTarefa.date,
    }

    props.onSave && props.onSave(newTask)
    setNovaTarefa({...initialState})
  }

  return (
    <Modal transparent={true} visible={props.isVisible}
      onRequestClose={props.onCancel}
      animationType='slide'>
      <TouchableWithoutFeedback 
      onPress={props.onCancel}>
        <View style={styles.overlay}></View>
      </TouchableWithoutFeedback>
      <View style={styles.container}> 
        <Text style={styles.header}>Nova Tarefa</Text>
        <TextInput style={styles.input}
          placeholder="O que temos pra fazer?"
          onChangeText={desc => setNovaTarefa({...novaTarefa, desc})}
          value={novaTarefa.desc}
        />
        {getDatePicker()}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={props.onCancel}>
            <Text style={styles.button}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={save}>
            <Text style={styles.button}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback 
      onPress={props.onCancel}>
        <View style={styles.overlay}></View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height:40,
    margin: 15,
    padding: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: commonStyles.colors.today,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
    marginRight: 30,
    color:commonStyles.colors.today
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
  },
  datePicker: {
    height:40,
    margin: 15,
    padding: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: commonStyles.colors.today,
    justifyContent: 'center',
  },
})