import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/base';
import { calcularPomodoros } from '../service/data_handler_register';
import { DatabaseConnection } from '../database/database_connetion';

const db = DatabaseConnection.getConnection();

export default props => {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');

  const register_task = () => {
    console.log('primeiro log register: ' + taskName, taskTime);

    if (!taskName) {
      alert('Por favor preencha o nome!');
      return;
    }
    if (!taskTime) {
      alert('Por favor preencha o tempo da tarefa');
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
              'Usuário Registrado com Sucesso !!!',
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

  return (
    <View style={style.form}>
      <Text>Nome da tarefa:</Text>
      <TextInput
        style={style.input}
        onChangeText={taskName => setTaskName(taskName)}
        placeholder='Informe o Nome'
      />
      <Text>Tempo da tarefa</Text>
      <TextInput
        style={style.input}
        onChangeText={taskTime => setTaskTime(taskTime)}
        placeholder='Informe o tempo'
      />
      <Button
        title="Salvar"
        onPress={register_task}
      />
    </View>

  );
};

const style = StyleSheet.create({
  form: {
    padding: 12
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10
  }
});