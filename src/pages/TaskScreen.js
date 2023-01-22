import React from 'react';
import { Text, View, StyleSheet, Dimensions, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Button, Icon } from '@rneui/base';
import { DatabaseConnection } from '../database/database_connetion';

const db = DatabaseConnection.getConnection();

function pieChart(task) {
  return (
    <>
      <Text style={styles.header}>{task.task_name}</Text>
      <PieChart
        data={[
          {
            name: 'Faltante',
            valor: task.pomodoro_missing,
            color: '#82AAE3',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Concluído',
            valor: task.pomodoro_done,
            color: '#82CD47',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginTop: 20,
        }}
        accessor="valor"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </>
  );
};


export default props => {

  const deleteTaskDB = () => {
    console.log(props.route.params.task_id);
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM table_task where task_id=?',
        [props.route.params.task_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucesso',
              'Task Excluída com Sucesso!',
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
  };

  function editTask() {
    Alert.alert(
      'Confirmação',
      'Deseja editar a tarefa?',
      [
        {
          text: 'Sim',
          onPress: () => props.navigation.navigate('RegisterTask', props.route.params),
        },
        {
          text: 'Não'
        },
      ],
      { cancelable: true }
    );
  }

  function deleteTask() {
    Alert.alert(
      'Confirmação',
      'Deseja excluir a tarefa?',
      [
        {
          text: 'Sim',
          onPress: () => deleteTaskDB(),
        },
        {
          text: 'Não'
        },
      ],
      { cancelable: true }
    );
  }
  return (
    <View style={styles.container}>
      {pieChart(props.route.params)}
      <View style={{ flexDirection: "row", marginTop: 50, }}>
        <Button
          icon={
            <Icon
              name="edit"
              size={15}
              color="white"
            />
          }
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#658864',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: 100,
            marginHorizontal: 10,
            marginVertical: 10,
          }}

          onPress={() => editTask()}
        />
        <Button
          icon={
            <Icon
              name="delete"
              size={15}
              color="white"
            />
          }
          iconRight
          iconContainerStyle={{ marginLeft: 100 }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: 'rgba(199, 43, 98, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: 100,
            marginHorizontal: 10,
            marginVertical: 10,
          }}

          onPress={() => deleteTask()}
        />
      </View>

    </View >
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 80,

  }
});