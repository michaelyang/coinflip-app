const inputFields = document.querySelectorAll(`input[type=number]`);
const submitButton = document.querySelector(`button[type=submit]`);
submitButton.addEventListener("click", handleSubmit);
let graphData = [];
let context = document.getElementById("graph").getContext("2d");
let data = {
  datasets: [
    {
      label: "Data",
      data: graphData
    }
  ]
};

const options = {
  legend: {
    display: false
  },
  responsive: true,
  maintainAspectRatio: true,
  tooltips: { enabled: false },
  hover: { mode: null }
};

let graph = new Chart(context, {
  type: "scatter",
  data: data,
  options: options
});

function handleSubmit() {
  const [
    winRate,
    winAmount,
    loseAmount,
    betPerTrial,
    numberOfTrials
  ] = Array.from(inputFields.values()).map(data => parseFloat(data.value));
  let data = [].concat.apply(
    [],
    Array.from({ length: numberOfTrials }, () =>
      createData(winRate, winAmount, loseAmount, betPerTrial)
    )
  );
  updateData(data);
  updateGraph(graph);
}

function createData(winRate, winAmount, loseAmount, betPerTrial) {
  let generatedData = Array.from({ length: betPerTrial }, () => Math.random());
  let cumulativeData = generatedData.reduce(
    (prev, curr, i) => [
      ...prev,
      {
        x: i + 1,
        y:
          (curr < winRate ? winAmount : -1 * loseAmount) +
          (prev[i - 1] ? prev[i - 1].y : 0)
      }
    ],
    []
  );
  return cumulativeData;
}
function updateData(data) {
  graph.data.datasets[0].data = data;
}

function updateGraph(graph) {
  graph.update();
}
