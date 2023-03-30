import React from "react";
import { json, checkStatus } from "./utils";
import $ from "jquery";
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
      currentAmount: 0,
      amount: 10,
      results: [],
      error: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.fetchCurrencies = this.fetchCurrencies.bind(this);
    this.changeFromCurrency = this.changeFromCurrency.bind(this);
    this.changeToCurrency = this.changeToCurrency.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
    this.selectCurrency = this.selectCurrency.bind(this);
    this.swapCurrencies = this.swapCurrencies.bind(this);
  }

  toggleCurrency(e) {
    $(e.target).closest("ul").children("li:not(.init)").toggle();
  }

  selectCurrency(e) {
    this.setState({ fromCurrency: e.target.getAttribute("data-value") });
    $(e.target).closest("ul").children(".init").html($(e.target).html());
    $(e.target).closest("ul").children("li:not(.init)").toggle();
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
    let element;
    e.target.tagName === "LI"
      ? (element = e.target)
      : (element = e.target.parentElement);

    this.setState({ fromCurrency: element.getAttribute("data-value") });
    $(element).closest("ul").children(".init").html($(element).html());
    $(element).closest("ul").children("li:not(.init)").toggle();
  }

  changeToCurrency(e) {
    let element;
    e.target.tagName === "LI"
      ? (element = e.target)
      : (element = e.target.parentElement);

    this.setState({ toCurrency: element.getAttribute("data-value") });
    $(element).closest("ul").children(".init").html($(element).html());
    $(element).closest("ul").children("li:not(.init)").toggle();
  }

  swapCurrencies() {
    let { fromCurrency, toCurrency } = this.state;
    let from = $(".from-currency").html();
    let to = $(".to-currency").html();

    this.setState({ fromCurrency: toCurrency, toCurrency: fromCurrency });
    $(".from-currency").html(to);
    $(".to-currency").html(from);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ results: [] });

    let { amount, fromCurrency, toCurrency } = this.state;

    this.setState({ currentAmount: amount });
    this.setState({ currentFromCurrency: fromCurrency });
    this.setState({ currentToCurrency: toCurrency });

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
  }

  render() {
    const {
      currencies,
      amount,
      results,
      currentFromCurrency,
      currentToCurrency,
      currentAmount,
    } = this.state;

    return (
      <div className="centre-container">
        <div className="content-container">
          <div>
            <p className="label">Amount</p>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={this.changeAmount}
            />
          </div>
          <div className="currency-container">
            <div>
              <p className="label">From</p>
              <ul className="currency-options">
                <li
                  className="init from-currency"
                  onClick={this.toggleCurrency}
                >
                  <img
                    src="https://www.countryflagicons.com/FLAT/64/US.png"
                    alt=""
                  />
                  USD
                </li>
                <li className="scrollable-menu" style={{ display: "none" }}>
                  {currencies.map((currency, index) => {
                    return (
                      <li
                        onClick={this.changeFromCurrency}
                        key={index}
                        data-value={currency}
                      >
                        <img
                          src={`https://www.countryflagicons.com/FLAT/64/${currency.slice(
                            0,
                            -1
                          )}.png`}
                          alt=""
                          data-value={currency}
                        />
                        {currency}
                      </li>
                    );
                  })}
                </li>
              </ul>
            </div>
            <div className="icon" onClick={this.swapCurrencies}>
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
            </div>
            <div>
              <p className="label">To</p>
              <ul className="currency-options">
                <li className="init to-currency" onClick={this.toggleCurrency}>
                  <img
                    src="https://www.countryflagicons.com/FLAT/64/EU.png"
                    alt=""
                  />
                  EUR
                </li>
                <li className="scrollable-menu" style={{ display: "none" }}>
                  {currencies.map((currency, index) => {
                    return (
                      <li
                        onClick={this.changeToCurrency}
                        key={index}
                        data-value={currency}
                      >
                        <img
                          src={`https://www.countryflagicons.com/FLAT/64/${currency.slice(
                            0,
                            -1
                          )}.png`}
                          alt=""
                        />
                        {currency}
                      </li>
                    );
                  })}
                </li>
              </ul>
            </div>
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
