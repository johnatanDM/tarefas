import React, {useState, useEffect} from 'react'
import { 
  View, 
  Text , 
  ImageBackground, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import { FontAwesome as Icon } from '@expo/vector-icons'
import {useFonts, Lato_100Thin, Lato_300Light } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo';

import todayImage from '../../assets/images/today.jpg'
import commonStyles from '../commonStyles'

import moment from 'moment'
import 'moment/locale/pt-br'
import Task from '../components/Task'
import AddTask from './AddTask'

const tarefasIniciais = {
  showDoneTasks: true,
  showAddTask: false,
  visibleTasks: [],
  tasks: [],
}


export default () => {
  let [fontsLoaded] = useFonts({Lato_100Thin, Lato_300Light})
  const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
  
  const [tarefas, setTarefas] = useState(tarefasIniciais)
  
  const toggleFilter = () => {
    setTarefas({...tarefas, showDoneTasks:  !tarefas.showDoneTasks})
  }

  const filterTasks = () => {
    let visibleTasks = null
    if(tarefas.showDoneTasks) {
      visibleTasks = [...tarefas.tasks]
    } else {
      const pending = task => task.doneAt === null
      visibleTasks = tarefas.tasks.filter(pending)
    }
    setTarefas({...tarefas, visibleTasks })
  }




  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('taskState', jsonValue)
    } catch (e) {
      console.warn(e)
    }
  }

  const getStoreData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('taskState')
      jsonValue != null ? JSON.parse(jsonValue) : tarefasIniciais
    } catch(e) {
      console.warn(e)
  }
}





  const toggleTask = taskId => {
    const tasks = [...tarefas.tasks]
    tasks.forEach(task => {
      if(task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date()
      }
    })
    setTarefas({ ...tarefas, tasks })
  }
  
  useEffect(() => {
    const saved = getStoreData()
    setTarefas(saved)
  }, [])

  useEffect(() => {
    filterTasks()
    storeData(tarefas)
  }, [tarefas.showDoneTasks, tarefas.tasks])


  const addTask = newTask => {
    if(!newTask.desc || !newTask.desc.trim()){
      Alert.alert('Dados Inválidos', 'Descrição não informada!')
      return
    }
    const tasks = [...tarefas.tasks]
    tasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null,
    })

    setTarefas({...tarefas, tasks, showAddTask: false})
  }

  const deleteTask = id => {
    const tasks = tarefas.tasks.filter(task => task.id !== id)
    setTarefas({...tarefas, tasks})
  }

  if (!fontsLoaded) {
      return <AppLoading />
    } else { 
      return(
          <View style={styles.container}>
            <AddTask isVisible={tarefas.showAddTask} 
              onCancel={() => setTarefas({...tarefas, showAddTask: false})}
              onSave={addTask}
            />
            <ImageBackground source={todayImage}
                style={styles.background}>
                <View style={styles.iconBar}>
                  <TouchableOpacity onPress={toggleFilter}> 
                    <Icon name={tarefas.showDoneTasks ? 'eye' : 'eye-slash'}
                      size={20} color={commonStyles.colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>Hoje</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.taskList}>
                <FlatList data={tarefas.visibleTasks}
                  keyExtractor={item => `${item.id}`}
                  renderItem={({item}) => <Task {...item} 
                  toggleTask={toggleTask}
                  onDelete={deleteTask}
                  />}
                /> 
            </View>
            <TouchableOpacity style={styles.addButon} 
              onPress={() => setTarefas({...tarefas, showAddTask:true})}
              activeOpacity={0.7}>
              <Icon name="plus" size={20} 
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
          </View>
      )

  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    taskList:{
        flex: 7
    },
    titleBar:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 50,
        color: commonStyles.colors.secondary,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.secondary,
        marginLeft: 20,
        marginBottom: 30,
    },
    iconBar: {
      flexDirection: 'row',
      marginHorizontal: 20,
      justifyContent: 'flex-end',
      marginTop: 25
    },
    addButon: {
      position: 'absolute',
      right: 30,
      bottom: 30,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: commonStyles.colors.today,
      alignItems: 'center',
      justifyContent: 'center',
    }
})