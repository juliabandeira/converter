import React from "react";
import { json, checkStatus } from "./utils";
import $ from "jquery";
import "react-dropdown/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

class Convert extends React.Component {
  constructor(props) {
    super(props);
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
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.fetchCurrencies = this.fetchCurrencies.bind(this);
    this.changeFromCurrency = this.changeFromCurrency.bind(this);
    this.changeToCurrency = this.changeToCurrency.bind(this);
    this.swapCurrencies = this.swapCurrencies.bind(this);
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

    $(".result").attr("style", "display:block");

    this.setState({ results: [] });
  }

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
    } = this.state;

    return (
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
        <div className="result" style={{ display: "none" }}>
          <p>
            {currentAmount} {currentFromCurrency} =
          </p>
          <p>
            {Object.values(results)} {currentToCurrency}
          </p>
        </div>
      </div>
    );
  }
}

export default Convert;
