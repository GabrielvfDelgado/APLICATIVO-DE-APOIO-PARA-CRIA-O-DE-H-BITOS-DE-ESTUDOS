import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Button, Icon } from '@rneui/base';
import { DatabaseConnection } from '../database/database_connetion';
import bronze from '../utils/img/medalha_bronze.png';
import prata from '../utils/img/medalha_prata.png';
import ouro from '../utils/img/medalha_ouro.png';

const db = DatabaseConnection.getConnection();

const perfomPorcent = (total, done) => {
  return done / total;
};

function pieChart(task) {
  return (
    <>
      <View>
        <PieChart
          data={[{ name: 'Faltante', valor: task.pomodoro_missing, color: '#82AAE3', legendFontColor: '#7F7F7F', legendFontSize: 15, }, { name: 'Concluído', valor: task.pomodoro_done, color: '#82CD47', legendFontColor: '#7F7F7F', legendFontSize: 15, },]}
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
            alignSelf: 'center'
          }}
          accessor="valor"
          backgroundColor="transparent"
          center={[75, 0]}
          hasLegend={false}
        />
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 20 }}>
        <View style={{ backgroundColor: '#82AAE3', width: 20, height: 20, borderRadius: 10, marginRight: 10 }} />
        <Text style={{ fontSize: 16 }}>{`${(task.pomodoro_missing / task.pomodoro_necessary * 100).toFixed(2)} %`} Faltante</Text>
        <View style={{ backgroundColor: '#82CD47', width: 20, height: 20, borderRadius: 10, marginLeft: 20, marginRight: 10 }} />
        <Text style={{ fontSize: 16, marginRight: 15 }}>{`${(task.pomodoro_done / task.pomodoro_necessary * 100).toFixed(2)} %`} Concluído</Text>
      </View>
    </>
  );
};

const deleteTaskDB = (props) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM table_task where task_id=?',
      [props.route.params.task_id],
      (tx, results) => {
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

export default props => {

  useEffect(() => {
    props.navigation.setOptions({
      title: props.route.params.task_name
    });
  }, []);


  function editTask() {
    Alert.alert(
      'Confirmação',
      'Deseja editar a tarefa?',
      [
        {
          text: 'Sim',
          onPress: () => props.navigation.navigate('EditScreen', props.route.params),
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
          onPress: () => deleteTaskDB(props),
        },
        {
          text: 'Não'
        },
      ],
      { cancelable: true }
    );
  }


  function defineMedalha(desempenho) {
    if (desempenho < 0.51) {
      return bronze;
    } else if (desempenho < 1) {
      return prata;
    } else {
      return ouro;
    }
  };

  const empenho = perfomPorcent(props.route.params.pomodoro_necessary, props.route.params.pomodoro_done);
  const medalhaIMG = defineMedalha(empenho);

  function desempenhoTask(desempenho) {
    if (desempenho < 0.51) {
      Alert.alert(
        'Medalha de bronze',
        'Continue se esforçando'
      );
    } else if (desempenho < 1) {
      Alert.alert(
        'Medalha de prata',
        'Você esta quase lá!'
      );
    } else {
      Alert.alert(
        'Medalha de ouro',
        'Parabéns, você conseguiu!'
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => desempenhoTask(empenho)}>
          <Image style={styles.image} source={medalhaIMG} />
        </TouchableOpacity>
        <View style={styles.textsContainer}>
          <Text style={styles.textConfig}>Duração: {props.route.params.task_duration}</Text>
          <View style={styles.linha} />
          <Text style={styles.textConfig}>Data de criação: {props.route.params.task_data}</Text>
          <View style={styles.linha} />
          <Text style={styles.textConfig}>Progresso:</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }} >{pieChart(props.route.params)}</View>
          <View style={styles.linha} />
          <View style={styles.buttonContainer}>
            <Button
              icon={<Icon name="edit" size={15} color="white" />}
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={styles.buttonTitle}
              buttonStyle={styles.editButton}
              containerStyle={styles.button}
              onPress={() => editTask()}
              title="Editar"
            />
            <Button
              icon={<Icon name="delete" size={15} color="white" />}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              titleStyle={styles.buttonTitle}
              buttonStyle={styles.deleteButton}
              containerStyle={styles.button}
              onPress={() => deleteTask()}
              title="Deletar"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textsContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  textConfig: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'left'
  },
  linha: {
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10
  },
  image: {
    width: 60,
    height: 60,
    alignSelf: 'flex-start',
    marginBottom: 70
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  button: {
    width: 100,
    marginHorizontal: 10
  },
  editButton: {
    backgroundColor: '#658864',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30,
  },
  deleteButton: {
    backgroundColor: 'rgba(199, 43, 98, 1)',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30,
  },
  buttonTitle: {
    fontWeight: '700'
  }
});