import React from "react";
import { json, checkStatus } from "./utils";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

class Rates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rateEntries: [],
      rateBase: "EUR",
      currencies: [],
    };

    this.fetchCurrencies = this.fetchCurrencies.bind(this);
    this.fetchRates = this.fetchRates.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
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

  fetchRates() {
    const { rateBase } = this.state;

    fetch(`https://api.frankfurter.app/latest?from=${rateBase}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({
          rateEntries: Object.entries(data.rates),
        });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  componentDidMount() {
    this.fetchRates();

    this.fetchCurrencies();

    $(document).on("click", function (e) {
      if (!$(e.target).is("li")) {
        if ($(".scrollable-menu").attr("style", "display:block")) {
          $(".scrollable-menu").attr("style", "display:none");
        }
      }
    });
  }

  toggleCurrency() {
    $(".scrollable-menu").toggle();
  }

  changeCurrency(e) {
    let element;
    e.target.tagName === "LI"
      ? (element = e.target)
      : (element = e.target.parentElement);

    this.setState({ rateBase: element.getAttribute("data-value") });
    $(".rate-current").html($(element).html());
    $(".scrollable-menu").toggle();
  }

  render() {
    const { rateBase, currencies, rateEntries } = this.state;

    return (
      <div className="centre-container rates">
        <div className="rates-options">
          <ul>
            <li onClick={this.toggleCurrency} className="rate-current">
              <img
                src={`https://www.countryflagicons.com/FLAT/64/${rateBase.slice(
                  0,
                  -1
                )}.png`}
                alt=""
              />
              {rateBase}
              <FontAwesomeIcon
                icon={faChevronDown}
                size="2xs"
                className="rate-icon"
              />
            </li>
            <li
              className="scrollable-menu rate-select"
              style={{ display: "none" }}
            >
              <ul>
                {currencies.map((currency, index) => {
                  return (
                    <li
                      onClick={this.changeCurrency}
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
              </ul>
            </li>
          </ul>
          <p>1</p>
          <button onClick={this.fetchRates} type="button">
            change
          </button>
        </div>

        <div className="rates-container">
          <div className="rates-data">
            {rateEntries.map((entry, i) => {
              return (
                <div>
                  <p>
                    {" "}
                    <img
                      src={`https://www.countryflagicons.com/FLAT/64/${entry[0].slice(
                        0,
                        -1
                      )}.png`}
                      alt=""
                    />{" "}
                    {entry[0]}
                  </p>
                  <p>{entry[1]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Rates;
