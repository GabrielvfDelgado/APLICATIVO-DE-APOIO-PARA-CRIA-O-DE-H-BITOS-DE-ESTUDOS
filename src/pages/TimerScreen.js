import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import { DatabaseConnection } from '../database/database_connetion';
import Mybutton from './components/Mybutton';

const db = DatabaseConnection.getConnection();

export default props => {
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60 * 1000);
  const [breakTime, setBreakTime] = useState(5 * 60 * 1000);
  const [currentTime, setCurrentTime] = useState(pomodoroTime);
  const [BreakCurrentTime, setBreakCurrentTime] = useState(breakTime);
  const [currentMode, setCurrentMode] = useState(0);
  const [pomodoroDone, setPomodoroDone] = useState(props.route.params.pomodoro_done);
  const [pomodoroMissing, setPomodoroMissing] = useState(props.route.params.pomodoro_missing);
  console.log("pomodoro done:" + pomodoroDone);

  useEffect(() => {
    props.navigation.setOptions({
      title: `Pomodoro (${props.route.params.task_name})`
    });

    if (pomodoroDone === props.route.params.pomodoro_necessary) {
      Alert.alert(
        'Parabéns voce concluiu a tarefa.',
        'Eu sempre acreditei em você!',
        [
          {
            text: 'Ok',
            onPress: () => props.navigation.navigate('HomeScreen'),
          }
        ],
        { cancelable: true }
      );
    }
  }, [pomodoroDone]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      const startTime = Date.now();
      const endTime = startTime + currentTime;
      intervalId = setInterval(() => {
        const remainingTime = Math.max(endTime - Date.now(), 0);
        setCurrentTime(remainingTime);
      }, 1000);
    }

    if (currentTime === 0) {
      if (currentMode === 0) {
        console.log('teste');
        updatedDB();
      }
      setCurrentMode((currentMode + 1) % 2);
      setCurrentTime(currentMode === 0 ? BreakCurrentTime : pomodoroTime);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, currentTime, BreakCurrentTime, pomodoroTime, currentMode]);

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const formatTime = (timeInMilliseconds) => {
    let minutes = Math.floor(timeInMilliseconds / 60000);
    let seconds = ((timeInMilliseconds % 60000) / 1000).toFixed(0);

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updatedDB = () => {
    let newPomodoroDone = pomodoroDone + 1;
    let newPomodoroMissing = pomodoroMissing - 1;
    setPomodoroDone(newPomodoroDone);
    setPomodoroMissing(newPomodoroMissing);
    console.log(newPomodoroDone);
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE table_task2 set pomodoro_done=?, pomodoro_missing=? where task_id=?',
        [newPomodoroDone, newPomodoroMissing, props.route.params.task_id]
      );
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.image} source={require("../utils/img/pomodoro_icon.png")} />
      </View>
      <View style={{
        backgroundColor: 'white',
        marginBottom: 20,
        padding: 50,
      }}>
        <Text style={styles.session}>{currentMode === 0 ? 'Trabalho' : 'Descanso'}</Text>
        <Text style={styles.timer}>
          {formatTime(currentTime)}
        </Text>
      </View>
      <View style={styles.btnContainer}>
        <Mybutton title={isRunning ? 'Pausar' : 'Começar'} customClick={() => handleStartStop()} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  session: {
    fontSize: 35,
    textAlign: 'center',
    color: '#4A5568',
    color: '#1A4167',
    fontWeight: 'bold'
  },
  image: {
    marginBottom: 0,
    marginTop: 30,
    marginLeft: 12,
    width: 150,
    height: 150,
  },
  timer: {
    fontSize: 90,
    color: '#1A4167',
    fontWeight: 'bold'
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});