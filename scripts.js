const inputFields = document.querySelectorAll(`input[type=number]`);
const submitButton = document.querySelector(`button[type=submit]`);
inputFields.forEach(inputField =>
  inputField.addEventListener("keydown", e => {
    if (e.keyCode === 13) {
      submitButton.click();
    }
  })
);
submitButton.addEventListener("click", handleSubmit);
/*
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
*/

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
      createHCData(winRate, winAmount, loseAmount, betPerTrial)
    )
  );
  updateHC(data, betPerTrial);
  //updateData(data);
  //updateGraph(graph);
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
  console.log(data);
  return cumulativeData;
}

function createHCData(winRate, winAmount, loseAmount, betPerTrial) {
  let generatedData = Array.from({ length: betPerTrial }, () => Math.random());
  let cumulativeData = generatedData.reduce(
    (prev, curr, i) => [
      ...prev,
      [
        i + 1,
        (curr < winRate ? winAmount : -1 * loseAmount) +
          (prev[i - 1] ? prev[i - 1][1] : 0)
      ]
    ],
    []
  );
  return cumulativeData;
}

function updateHC(data, maxX) {
  if (!Highcharts.Series.prototype.renderCanvas) {
    throw "Module not loaded";
  }

  Highcharts.chart("graph", {
    chart: {
      zoomType: "xy",
      height: "100%"
    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true
    },
    xAxis: {
      min: 0,
      max: maxX,
      gridLineWidth: 1,
      title: {
        text: "Number of Bets"
      }
    },
    yAxis: {
      minPadding: 0,
      maxPadding: 0.05,
      title: {
        text: "Payout ($)"
      }
    },
    title: {
      text: null
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: "scatter",
        color: "rgba(152,0,67,0.2)",
        data: data,
        marker: {
          radius: 1
        },
        tooltip: {
          followPointer: false,
          pointFormat: "[{point.x:.1f}, {point.y:.1f}]"
        }
      }
    ]
  });
}

function updateData(data) {
  graph.data.datasets[0].data = data;
}

function updateGraph(graph) {
  graph.update();
}
handleSubmit();
