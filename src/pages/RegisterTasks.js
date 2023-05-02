import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View, Image, Alert } from 'react-native';
import { calcularPomodoros } from '../service/data_handler_register';
import { DatabaseConnection } from '../database/database_connetion';
import imageForm from "../utils/img/logo_icon.png";
import Mybutton from './components/Mybutton';

const db = DatabaseConnection.getConnection();

const validateTime = (time) => {
  const re = /^((?!0+:00)\d{1,}:[0-5][0-9])$/;
  return re.test(time);
};


const validate = (nome, duracao) => {
  if (!nome || !duracao) {
    Alert.alert(
      'Atenção',
      'Preencha todos os campos'
    );
    return false;
  } else if (!validateTime(duracao)) {
    Alert.alert(
      'Atenção',
      'Preencha a duração corretamente'
    );
    return false;
  }
  else {
    return true;
  }
};

const register_task = (nome, duracao, db, props) => {
  const pomodoro_necessary = calcularPomodoros(duracao);
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO table_task2 (' +
      'task_name,' +
      'task_duration,' +
      'task_data,' +
      'pomodoro_necessary,' +
      'pomodoro_done,' +
      'pomodoro_missing,' +
      'concluded)' +
      'VALUES (?,?,?,?,?,?,?)',
      [nome, duracao, dataFormatada, pomodoro_necessary, 0, pomodoro_necessary, false],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Sucesso',
            'Tarefa registrada com sucesso!',
            [
              {
                text: 'Ok',
                onPress: () => props.navigation.navigate('HomeScreen'),
              },
            ],
            { cancelable: false });
        } else alert('Erro ao tentar Registrar o Usuário !!!');
      }
    );
  });

};

export default props => {
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');
  const duracaoRef = useRef(null);

  const handleNomeSubmit = () => {
    duracaoRef.current.focus();
  };

  const handleDuracaoSubmit = () => {
    if (!validate(nome, duracao)) {
      return;
    } else {
      register_task(nome, duracao, db, props);
    }
  };

  const formatDuracao = (value) => {
    let formattedValue = value.replace(/\D/g, '');
    formattedValue = formattedValue.slice(0, 4);
    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.slice(0, 2)}:${formattedValue.slice(2)}`;
    }
    return formattedValue;
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
            placeholder="Digite o nome"
            placeholderTextColor="#a0a0a0"
            value={nome}
            onChangeText={setNome}
            onSubmitEditing={handleNomeSubmit}
          />
          <TextInput
            ref={duracaoRef}
            style={styles.input}
            placeholder="Duração da tarefa (HH:MM)"
            placeholderTextColor="#a0a0a0"
            value={duracao}
            onChangeText={(value) => setDuracao(formatDuracao(value))}
            onSubmitEditing={handleDuracaoSubmit}
            keyboardType="numeric"
          />
          <Mybutton title="Salvar" customClick={() => handleDuracaoSubmit()} />
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