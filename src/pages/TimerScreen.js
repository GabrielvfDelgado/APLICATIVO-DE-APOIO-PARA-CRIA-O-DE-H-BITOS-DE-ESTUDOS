import * as React from 'react';
import { Text, View, StyleSheet, Vibration, Image, SafeAreaView } from 'react-native';
import { DatabaseConnection } from '../database/database_connetion';
import Mybutton from './components/Mybutton';

const db = DatabaseConnection.getConnection();

const INITIAL_WORK_MIN = '25';
const INITIAL_BREAK_MIN = '05';
const INITIAL_SEC = '00';
const WORK_LABEL = 'Pomodoro';
const BREAK_LABEL = 'Descansar';
const START_LABEL = 'Começar';
const STOP_LABEL = 'Parar';

let interval = 0;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minutes: INITIAL_WORK_MIN,
      seconds: INITIAL_SEC,
      session: WORK_LABEL,
      buttonLabel: START_LABEL,
      workInputValue: INITIAL_WORK_MIN,
      breakInputValue: INITIAL_BREAK_MIN,
    };

    this.secondsRemaining;
    this.isRunning = false;
    this.pomodoro_mis = this.props.route.params.pomodoro_missing;
  }


  startStopTimer = () => {
    if (this.isRunning) {
      return this.pauseTimer();
    }

    this.setState(() => ({
      buttonLabel: STOP_LABEL,
    }));

    if (!this.secondsRemaining) {
      this.secondsRemaining = this.state.minutes
        ? this.state.minutes * 60
        : INITIAL_WORK_MIN * 60;
    }

    this.isRunning = true;

    this.setupInteval();
  };

  setupInteval = () => {
    clearInterval(interval);

    interval = setInterval(() => this.onTick(), 1000);
  };

  updatedPomodoro = () => {
    let pomodoro_done = this.props.route.params.pomodoro_done + 1;
    let pomodoro_missing = this.props.route.params.pomodoro_missing - 1;
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE table_task set pomodoro_done=?, pomodoro_missing=? where task_id=?',
        [pomodoro_done, pomodoro_missing, this.props.route.params.task_id]
      );
    });
  };

  onTick = () => {
    let minutes = Math.floor(this.secondsRemaining / 60);
    let seconds = this.secondsRemaining - minutes * 60;

    minutes = this.normalizeDigits(minutes);
    seconds = this.normalizeDigits(seconds);

    this.setState(previousState => ({
      minutes: minutes,
      seconds: seconds,
    }));

    this.secondsRemaining--;

    if (minutes == 0 && seconds == 0) {

      Vibration.vibrate(3 * 1000);

      if (this.state.session == WORK_LABEL) {
        console.log(this.pomodoro_mis);
        if (!this.props.route.params.pomodoro_missing == 0) {
          this.pomodoro_mis = this.pomodoro_mis - 1;
          this.updatedPomodoro();
        }
        this.startBreak();
      } else {
        this.startWork();
      }
    }
  };

  pauseTimer = () => {
    clearInterval(interval);

    this.isRunning = false;

    this.setState(previousState => ({
      buttonLabel: START_LABEL,
    }));
  };

  startWork = () => {
    const that = this;

    this.setState(previousState => ({
      minutes: that.normalizeDigits(this.state.workInputValue),
      seconds: INITIAL_SEC,
      session: WORK_LABEL,
      buttonLabel: STOP_LABEL,
    }));

    this.secondsRemaining = this.state.workInputValue * 60;

    this.setupInteval();
  };

  startBreak = () => {
    const that = this;

    this.setState(previousState => ({
      minutes: that.normalizeDigits(this.state.breakInputValue),
      seconds: INITIAL_SEC,
      session: BREAK_LABEL,
      buttonLabel: STOP_LABEL,
    }));

    this.secondsRemaining = this.state.breakInputValue * 60;

    this.setupInteval();
  };

  resetTimer = () => {
    const that = this;

    this.isRunning = false;
    this.secondsRemaining = 0;

    clearInterval(interval);

    this.setState(previousState => ({
      session: WORK_LABEL,
      buttonLabel: START_LABEL,
      seconds: INITIAL_SEC,
      minutes: that.normalizeDigits(previousState.workInputValue),
    }));
  };

  normalizeDigits = value => {
    if (value.toString().length < 2) {
      return '0' + value;
    }

    return value;
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View>
            <Image style={styles.image} source={require("../utils/img/pomodoro_icon.png")} />
          </View>
          <View style={{
            backgroundColor: 'white',
            marginBottom: 20,
            padding: 50,
          }}>
            <Text style={styles.session}>{this.state.session}</Text>
            <Text style={styles.timer}>
              {this.state.minutes}:{this.state.seconds}
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <Mybutton title={this.state.buttonLabel} customClick={() => this.startStopTimer()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

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