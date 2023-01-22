import React, { useState } from 'react';
import { Image, SafeAreaView, View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { calcularPomodoros } from '../service/data_handler_register';
import { DatabaseConnection } from '../database/database_connetion';

import Mybutton from './components/Mybutton';
import Mytextinput from './components/Mytextinput';

const db = DatabaseConnection.getConnection();

export default props => {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');

  const register_task = () => {

    if (!taskName) {
      alert('Por favor preencha o nome!');
      return;
    }
    if (!taskTime) {
      alert('Por favor preencha o tempo da tarefa');
      return;
    }

    const validateTime = (time) => {
      const re = /^((?!0+:00)\d{1,}:[0-5][0-9])$/;
      return re.test(time);
    };

    if (!validateTime(taskTime)) {
      alert('Valor inserido no tempo da tarefa invalido. Inserir no seguinte modelo HH:MM');
      return;
    }

    const pomodoro_necessary = calcularPomodoros(taskTime);

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_task (task_name, task_duration, pomodoro_necessary, pomodoro_done, pomodoro_missing, concluded) VALUES (?,?,?,?,?,?)',
        [taskName, taskTime, pomodoro_necessary, 0, pomodoro_necessary, false],
        (tx, results) => {
          console.log('segundo log register: ' + results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucesso',
              'Tarefa Registrada com Sucesso!',
              [
                {
                  text: 'Ok',
                  onPress: () => props.navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Erro ao tentar Registrar o Usuário !!!');
        }
      );
    });

  };

  const update_task = () => {
    if (!taskName) {
      alert('Por favor preencha o nome!');
      return;
    }
    if (!taskTime) {
      console.log('sem tempo');
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE table_task set task_name=? where task_id=?',
          [taskName, props.route.params.task_id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Sucesso',
                'Task atualizada com sucesso!!',
                [
                  {
                    text: 'Ok',
                    onPress: () => props.navigation.navigate('HomeScreen'),
                  },
                ],
                { cancelable: false }
              );
            }
          }
        );
      });
    }
    else {
      const pomodoro_necessary = calcularPomodoros(taskTime);
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE table_task set task_name=?, task_duration=?, pomodoro_necessary=?, pomodoro_done=?, pomodoro_missing=?, concluded=? where task_id=?',
          [taskName, taskTime, pomodoro_necessary, 0, pomodoro_necessary, false, props.route.params.task_id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Sucesso',
                'Task atualizada com sucesso!!',
                [
                  {
                    text: 'Ok',
                    onPress: () => props.navigation.navigate('HomeScreen'),
                  },
                ],
                { cancelable: false }
              );
            }
          }
        );
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <Image style={styles.image} source={require("../utils/img/logo_icon.png")} />
            <Mytextinput
              onChangeText={taskName => setTaskName(taskName)}
              placeholder='Informe o nome:' />
            <Mytextinput
              onChangeText={taskTime => setTaskTime(taskTime)}
              placeholder='Informe o tempo:' />
            <Mybutton title="Salvar" customClick={props.route.params ? update_task : register_task} />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  image: {
    marginBottom: 40,
    marginTop: 100,
    marginLeft: 85,
    width: 150,
    height: 150,
  }

});