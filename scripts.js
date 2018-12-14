const textFields = document.querySelectorAll(`input[type=text]`);
let graphData = [];
textFields.forEach((textField, index) => {
  textField.addEventListener('change', () =>
    handleChange(myGraph, textField, index)
  );
  graphData.push(textField.value);
});
let ctx = document.getElementById('myChart').getContext('2d');
let data = {
  labels: [
    'Win Rate',
    'Win Amount',
    'Lose Amount',
    'Number of Bets per Trial',
    'Number of Trials'
  ],
  datasets: [
    {
      data: graphData,
      label: 'Data',
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 3,
      fill: true
    }
  ]
};
const options = {
  legend: {
    display: false
  },
  responsive: true,
  maintainAspectRatio: true
};
let myGraph = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: options
});

function handleChange(graph, textField, index) {
  updateData(graph, index, textField.value);
  updateGraph(graph);
}

function updateData(graph, index, data) {
  graph.data.datasets[0].data[index] = data;
}

function updateGraph(graph) {
  graph.update();
}
