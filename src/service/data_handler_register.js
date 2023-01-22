function calcularPomodoros(horas) {
  const arr_timer = horas.split(":");
  const hours = parseInt(arr_timer[0]);
  const minutes = parseInt(arr_timer[1]);
  const amount_hours = (hours * 60) + minutes;
  const pom_necess = Math.round(amount_hours / 25);
  return pom_necess;
}


export { calcularPomodoros };