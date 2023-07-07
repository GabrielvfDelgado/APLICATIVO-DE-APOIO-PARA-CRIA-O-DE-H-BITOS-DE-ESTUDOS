import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { DatabaseConnection } from '../database/database_connetion';
import { ListItem, Button, Icon } from '@rneui/base';

const db = DatabaseConnection.getConnection();


export default props => {

  const isFocused = useIsFocused();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isFocused) {

      db.transaction((txn) => {
        // Verifica se a tabela já existe
        // txn.executeSql('DROP TABLE IF EXISTS table_task', []);
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_task2'",
          [],
          (tx, res) => {
            if (res.rows.length === 0) {
              // Cria a tabela se ela não existir
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_task2(' +
                'task_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
                'task_name VARCHAR(20),' +
                'task_data DATE,' +
                'task_duration TIME,' +
                'pomodoro_necessary INTEGER,' +
                'pomodoro_done INTEGER,' +
                'pomodoro_missing INTEGER,' +
                'concluded BOOLEAN)',
                []
              );
            }
          }
        );
      });

      // Consulta os dados da tabela
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM table_task2',
          [],
          (tx, results) => {
            const temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setItems(temp);
          }
        );
      });
      if (items.length == 0) {
        Alert.alert(
          'Atenção',
          'Clique no + para registrar tarefa'
        );
      }
    }
  }, [props, isFocused]);

  const deleteTaskDB = (props) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM table_task2 where task_id=?',
        [props.task_id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucesso',
              'Task Excluída com Sucesso!',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    db.transaction((tx) => {
                      tx.executeSql(
                        'SELECT * FROM table_task2',
                        [],
                        (tx, results) => {
                          const temp = [];
                          for (let i = 0; i < results.rows.length; ++i)
                            temp.push(results.rows.item(i));
                          setItems(temp);
                        }
                      );
                    });
                  }
                },
              ],
              { cancelable: false }
            );
          }
        }
      );
    });
  };

  function deleteTask(task) {
    Alert.alert(
      'Confirmação',
      'Deseja excluir a tarefa?',
      [
        {
          text: 'Sim',
          onPress: () => deleteTaskDB(task),
        },
        {
          text: 'Não'
        },
      ],
      { cancelable: true }
    );
  }

  function editTask(task) {
    Alert.alert(
      'Confirmação',
      'Deseja editar a tarefa?',
      [
        {
          text: 'Sim',
          onPress: () => props.navigation.navigate('EditScreen', task),
        },
        {
          text: 'Não'
        },
      ],
      { cancelable: true }
    );
  }


  function getActions(task) {
    return (
      <>
        <Button
          type="clear"
          icon={<Icon name='alarm' size={25} color="green" />}
          onPress={() => props.navigation.navigate('TimerScreen', task)}
        ></Button>
        <Button
          type="clear"
          icon={<Icon name='edit' size={25} color="#1A4167" />}
          onPress={() => editTask(task)}
        ></Button>
        <Button
          type="clear"
          icon={<Icon name='clear' size={25} color="red" />}
          onPress={() => deleteTask(task)}
        ></Button>
      </>
    );
  }

  function getTarefaItem({ item: task }) {
    return (
      <ListItem
        bottomDivider
        key={task.task_id}
        onPress={() => props.navigation.navigate('TaskScreen', task)}>
        <ListItem.Content>
          <ListItem.Title>{task.task_name}</ListItem.Title>
        </ListItem.Content>
        {getActions(task)}
      </ListItem>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={getTarefaItem}
      ></FlatList>
    </View >
  );
};