import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { DatabaseConnection } from '../database/database_connetion';
import { ListItem, Button, Icon } from '@rneui/base';

const db = DatabaseConnection.getConnection();

export default props => {

  const isFocused = useIsFocused();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isFocused) {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_task'",
          [],
          function (tx, res) {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS table_task', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_task(task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_name VARCHAR(20), task_duration VARCHAR(8), pomodoro_necessary INT(10), pomodoro_done INT(10), pomodoro_missing INT(10), concluded boolean)',
                []
              );
            }
          }
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM table_task',
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
  }, [props, isFocused]);

  function getActions(task) {
    return (
      <>
        <Button
          type="clear"
          icon={<Icon name='alarm' size={25} color="orange" />}
          onPress={() => props.navigation.navigate('TimerScreen', task)}
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