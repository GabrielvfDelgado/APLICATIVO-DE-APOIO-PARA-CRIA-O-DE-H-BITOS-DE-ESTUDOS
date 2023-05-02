import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, Alert } from 'react-native';
import Mybutton from './components/Mybutton';
import imageForm from "../utils/img/Edit.png";
import { DatabaseConnection } from '../database/database_connetion';

const db = DatabaseConnection.getConnection();

const update_task = (props, name) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE table_task2 set task_name=? where task_id=?',
      [name, props.route.params.task_id],
      (tx, results) => {
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
};

export default props => {
  const [name, setName] = useState('');

  useEffect(() => {
    props.navigation.setOptions({
      title: `Editando (${props.route.params.task_name})`
    });
  }, []);

  const handleSave = () => {
    if (!name) {
      Alert.alert(
        'Atenção',
        'Preencha o campo nome'
      );
      return;
    } else {
      update_task(props, name);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer}></View>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={imageForm} />
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite o novo nome"
            onChangeText={(text) => setName(text)}
            onSubmitEditing={handleSave}
          />
          <Mybutton title="Salvar" customClick={() => handleSave()} />
        </View>
      </View>
      <View style={styles.spacer}></View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
  content: {
    flex: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20
  },
  form: {
    width: '90%',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 0.2,
    borderColor: '#808080',
    borderRadius: 8,
    marginBottom: 16,
  },
});