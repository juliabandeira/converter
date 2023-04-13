import React from "react";
import { json, checkStatus } from "./utils";
import $ from "jquery";
import Chart from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

class Convert extends React.Component {
  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);

    this.state = {
      currencies: [],
      fromCurrency: "USD",
      toCurrency: "EUR",
      currentFromCurrency: "",
      currentToCurrency: "",
      currentAmount: 10,
      amount: 10,
      results: [],
      error: "",
      showComponent: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.fetchCurrencies = this.fetchCurrencies.bind(this);
    this.changeFromCurrency = this.changeFromCurrency.bind(this);
    this.changeToCurrency = this.changeToCurrency.bind(this);
    this.swapCurrencies = this.swapCurrencies.bind(this);
    this.chartRef = React.createRef();
    this.displayComponent = this.displayComponent.bind(this);
  }

  displayComponent() {
    this.setState({ showComponent: true });
  }

  componentDidMount() {
    this.fetchCurrencies();
  }

  fetchCurrencies() {
    fetch(`https://api.frankfurter.app/currencies`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        console.log(data);
        this.setState({ currencies: Object.keys(data) });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  changeAmount(e) {
    this.setState({ amount: e.target.value });
  }

  changeFromCurrency(e) {
    this.setState({ fromCurrency: e.target.value });
  }

  changeToCurrency(e) {
    this.setState({ toCurrency: e.target.value });
  }

  swapCurrencies() {
    let { fromCurrency, toCurrency } = this.state;

    this.setState({ fromCurrency: toCurrency, toCurrency: fromCurrency });
  }

  handleSubmit() {
    let { amount, fromCurrency, toCurrency } = this.state;
    this.setState({
      currentFromCurrency: fromCurrency,
      currentToCurrency: toCurrency,
      currentAmount: amount,
    });

    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({ results: data.rates });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });

    this.setState({ results: [] });
    this.getHistoricalRates(fromCurrency, toCurrency);
    this.displayComponent();
  }

  getHistoricalRates = (fromCurrency, toCurrency) => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    fetch(
      `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map(
          (rate) => rate[toCurrency]
        );
        const chartLabel = `${fromCurrency} to ${toCurrency} Chart`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch((error) => console.error(error.message));
  };

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");
    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  };

  render() {
    const {
      currencies,
      amount,
      results,
      currentFromCurrency,
      currentToCurrency,
      fromCurrency,
      toCurrency,
      currentAmount,
      showComponent,
    } = this.state;

    return (
      <React.Fragment>
        <div className="centre-container">
          <div className="content-container">
            <div>
              <label className="currency">
                Amount
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={this.changeAmount}
                />
              </label>
            </div>
            <div className="currency-container">
              <label className="currency">
                From:
                <select value={fromCurrency} onChange={this.changeFromCurrency}>
                  <option value={fromCurrency}>{fromCurrency}</option>
                  {currencies.map((currency, index) => {
                    return <option value={currency}>{currency}</option>;
                  })}
                </select>
              </label>
              <div className="icon" onClick={this.swapCurrencies}>
                <FontAwesomeIcon icon={faArrowRightArrowLeft} />
              </div>
              <label className="currency">
                To:
                <select value={toCurrency} onChange={this.changeToCurrency}>
                  <option value={toCurrency}>{toCurrency}</option>
                  {currencies.map((currency, index) => {
                    return (
                      <option value={currency}>
                        {" "}
                        <img
                          src={`https://www.countryflagicons.com/FLAT/64/${currency.slice(
                            0,
                            -1
                          )}.png`}
                          alt=""
                        />{" "}
                        {currency}
                      </option>
                    );
                  })}
                </select>
              </label>
              <button
                type="button"
                onClick={this.handleSubmit}
                className="button"
              >
                ok
              </button>
            </div>
          </div>
          {showComponent && (
            <div className="result">
              <p>
                {currentAmount} {currentFromCurrency} =
              </p>
              <p>
                {Object.values(results)} {currentToCurrency}
              </p>
            </div>
          )}
        </div>
        {showComponent && (
          <div className="canvas">
            {" "}
            <canvas ref={this.chartRef} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Convert;
