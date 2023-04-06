const inputFields = document.querySelectorAll(`input[type=number]`);
const isCompoundingField = document.getElementById("is_compounding");
const submitButton = document.querySelector(`button[type=submit]`);
inputFields.forEach((inputField) =>
  inputField.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      submitButton.click();
    }
  })
);
submitButton.addEventListener("click", handleSubmit);

function handleSubmit() {
  const [capital, bet_percentage, win_rate, bets_per_trial, number_of_trials] =
    Array.from(inputFields.values()).map((data) => parseFloat(data.value));
  const is_compoudning = isCompoundingField.checked;
  scatter = createHCScatterData(
    number_of_trials,
    win_rate,
    capital,
    bet_percentage,
    bets_per_trial,
    is_compoudning
  );
  updateHC(scatter, bets_per_trial);
}

function createHCScatterData(
  number_of_trials,
  win_rate,
  capital,
  bet_percentage,
  bets_per_trial,
  is_compoudning
) {
  const total_length = number_of_trials * (bets_per_trial + 1);
  const points_array = new Array(total_length);
  for (let trial = 0; trial < number_of_trials; trial++) {
    trial_data = createSingleTrial(
      win_rate,
      capital,
      bet_percentage,
      bets_per_trial,
      is_compoudning
    );
    trial_data.forEach((current_element, index) => {
      let point = [index, current_element];
      points_array[trial * (bets_per_trial + 1) + index] = point;
    });
  }
  return points_array;
}

function createHCLineSeriesData(
  number_of_trials,
  win_rate,
  capital,
  bet_percentage,
  bets_per_trial,
  is_compoudning
) {
  return Array.from({ length: number_of_trials }, (_, index) => {
    const trial_number = index + 1;
    return {
      name: `Trial ${trial_number}`,
      data: createSingleTrial(
        win_rate,
        capital,
        bet_percentage,
        bets_per_trial,
        is_compoudning
      ),
    };
  });
}

function createSingleTrial(
  win_rate,
  capital,
  bet_percentage,
  bets_per_trial,
  is_compoudning
) {
  const flipped_coins = Array.from({ length: bets_per_trial }, () =>
    Math.random()
  );
  let current_money = capital;
  const cumulative_money = [current_money];
  flipped_coins.forEach((current_flip) => {
    if (current_money <= 0) {
      cumulative_money.push(0);
      return;
    }
    bet_amount = is_compoudning
      ? current_money * bet_percentage
      : capital * bet_percentage;

    if (current_flip < win_rate) {
      // won
      current_money += bet_amount;
    } else {
      // lost
      current_money -= bet_amount;
    }
    cumulative_money.push(current_money);
  });
  return cumulative_money;
}

function updateHC(data, maxX) {
  if (!Highcharts.Series.prototype.renderCanvas) {
    throw "Module not loaded";
  }

  const colors = Highcharts.getOptions().colors.map((color) =>
    Highcharts.color(color).setOpacity(0.5).get()
  );

  Highcharts.chart("graph", {
    chart: {
      zoomType: "xy",
      height: "100%",
    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true,
    },
    xAxis: {
      min: 0,
      max: maxX,
      gridLineWidth: 1,
      title: {
        text: "Number of Bets",
      },
    },
    yAxis: [
      {
        labels: {
          formatter: function () {
            if (this.value >= 0) {
              return "$" + this.value;
            } else {
              return "-$" + this.value * -1;
            }
          },
        },
        minPadding: 0,
        maxPadding: 0.05,
        title: {
          text: "Payout ($)",
        },
      },
      {
        labels: {
          formatter: function () {
            if (this.value >= 0) {
              return "$" + this.value;
            } else {
              return "-$" + this.value * -1;
            }
          },
        },
        linkedTo: 0,
        opposite: true,
        title: {
          text: null,
        },
      },
    ],
    title: {
      text: null,
    },
    legend: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    colors,
    //series: data,
    series: [
      {
        type: "scatter",
        color: "rgba(0,0,0,0.2)",
        data: data,
        marker: {
          radius: 2,
          symbol: "square",
        },
        tooltip: {
          followPointer: false,
          pointFormat: "[{point.x:.1f}, {point.y:.1f}]",
        },
      },
    ],
  });
}

handleSubmit();
