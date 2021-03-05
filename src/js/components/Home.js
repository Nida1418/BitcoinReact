import React, { Component } from "react";
import Modal from "react-modal";
import MobileVerifier from "./MobileVerifier";
import { Loader } from "react-loaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faBtc } from "@fortawesome/free-brands-svg-icons";
import "../../css/Home.css";
import {
  requiredValidator,
  integerValidator,
  numberValidator,
  emailValidator,
  phoneValidator,
  bitcoinAddressValidator,
  amountAudMinValidator,
  amountAudValidator,
  checkedValidator
} from "../util/validators";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      tcCheckbox: false,
      tcCheckboxWallet: false,
      audInput: "",
      btcInput: "",
      emailInput: "",
      walletAddressInput: "",
      mobileInput: "",
      isValid: true
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAudChange = this.handleAudChange.bind(this);
    this.handleBtcChange = this.handleBtcChange.bind(this);

    this.customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "0"
      }
    };

    this.fieldValidations = {
      audInput: [
        amountAudValidator,
        numberValidator,
        amountAudMinValidator,
        requiredValidator
      ],
      emailInput: [emailValidator, requiredValidator],
      walletAddressInput: [bitcoinAddressValidator, requiredValidator],
      mobileInput: [phoneValidator, requiredValidator],
      tcCheckbox: [checkedValidator],
      tcCheckboxWallet: [checkedValidator]
    };

    this.errors = {};
  }

  handleChange = event => {
    this.errors[event.target.name] = "";
    this.fieldValidations[event.target.name].forEach(function(validation) {
      const data = validation(event.target.value);
      if (!data.result) {
        this.errors[event.target.name] = data.message;
        return;
      }
    }, this);

    if (this.errors[event.target.name]) {
      this.setState({ isValid: false });
    }

    this.setState({ [event.target.name]: event.target.value });
  };

  handleMobileChange = event => {
    if (event.target.value.length < 8) {
      event.target.value = "(+61) 04";
    }
    this.errors[event.target.name] = "";
    const valueToValidate = '+614' + event.target.value.slice(8);
    if (event.target.value.length > 8) {
      this.fieldValidations[event.target.name].forEach(function(validation) {
        const data = validation(valueToValidate);
        if (!data.result) {
          this.errors[event.target.name] = data.message;
          return;
        }
      }, this);
    }

    if (this.errors[event.target.name]) {
      this.setState({ isValid: false });
    }

    this.setState({ [event.target.name]: event.target.value });
  };

  handleMobileFocus = (event) => {
    if (event.target.value === '') {
      this.setState({ [event.target.name]: '(+61) 04' });
    }
  }

  handleMobileBlur = (event) => {
    if (event.target.value.length === 8) {
      this.setState({ [event.target.name]: '' });
    }
  }

  handleAudChange(event, btcValue) {
    if (event.target.value && !numberValidator(event.target.value).result) {
      return;
    }

    this.errors[event.target.name] = "";
    this.fieldValidations[event.target.name].forEach(function(validation) {
      const data = validation(event.target.value);
      if (!data.result) {
        this.errors[event.target.name] = data.message;
        return;
      }
    }, this);

    if (event.target.value > 1000 && Number(event.target.value) % 5 !== 0) {
      event.target.value = Math.floor((Number(event.target.value) + 5) / 5) * 5;
    }

    if (btcValue === undefined || event.target.value > 1000) {
      btcValue = (event.target.value / this.props.btcToAud).toFixed(8);
      // btcValue =(Math.round(20 *(event.target.value / this.props.btcToAud))/20).toFixed(10);
      // btcValue = event.target.value / this.props.btcToAud;
    }

    if (this.errors[event.target.name]) {
      this.setState({
        isValid: false,
        [event.target.name]: Math.ceil(event.target.value),
        btcInput: btcValue
      });
    } else {
      this.setState({
        [event.target.name]: Math.ceil(event.target.value),
        btcInput: btcValue
      });
    }
  }

  handleBtcChange(event) {
    if (event.target.value && !numberValidator(event.target.value).result) {
      return;
    }
    event.target.name = "audInput";
    let btcValue = event.target.value;
    if (Math.floor(btcValue) !== 0) {
      btcValue = btcValue.replace(/^0+/, "");
    }
    event.target.value = event.target.value * this.props.btcToAud;
    this.handleAudChange(event, btcValue);
  }

  handleCheckboxClick = event => {
    this.errors[event.target.name] = "";
    this.fieldValidations[event.target.name].forEach(function(validation) {
      const data = validation(event.target.checked);
      if (!data.result) {
        this.errors[event.target.name] = data.message;
        return;
      }
    }, this);

    if (this.errors[event.target.name]) {
      this.setState({
        isValid: false,
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({ [event.target.name]: event.target.checked });
    }
  };

  processValidations() {
    this.errors = [];
    for (const fieldName in this.fieldValidations) {
      const element = document.getElementsByName(fieldName)[0];
      let value;
      if (element.type === "checkbox") {
        value = element.checked;
      } else {
        value = element.value;
        if (fieldName === 'mobileInput') {
          value = '+614' + element.value.slice(8);
        }
      }

      this.fieldValidations[fieldName].forEach(function(validation) {
        const data = validation(value);
        if (!data.result) {
          this.errors[fieldName] = data.message;
        }
      }, this);
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const data = {
      id: this.props.txId,
      phone: '+614' + this.state.mobileInput.slice(8),
      email: this.state.emailInput,
      method: "SMS",
      walletAddr: this.state.walletAddressInput,
      amountAUD: this.state.audInput.toString(),
      amountBTC: this.state.btcInput.toString(),
      timestamp: this.props.txTimestamp
    };
    this.props.onSubmit(data);
  };

  handleCheck() {
    this.setState({ checked: !this.state.checked });
  }

  registerTransaction = () => {
    const data = {
      id: this.props.txId,
      phone: '+614' + this.state.mobileInput.slice(8),
      email: this.state.emailInput,
      method: "SMS",
      walletAddr: this.state.walletAddressInput,
      amountAUD: this.state.audInput.toString(),
      timestamp: this.props.txTimestamp
    };

    return fetch(
      "https://blue-shyft.firebaseapp.com/api/sandbox/registerTransaction",
      {
        //return fetch('http://localhost:8080/registerOrder', {
        method: "POST",
        //   cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
          // "Accept": "application/json",
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => {
        if (response.status !== 200) {
          window.alert(
            "Order can't be completed. Please reload the page and try again."
          );
          return;
        }
        return response.json();
      })
      .then(responseJson => responseJson)
      .catch(error => {
        console.log(error);
        window.alert("Order can't be completed", error);
      });
  };

  handleRegisterTransaction = async requestParams => {
    this.processValidations();
    if (this.errors && Object.keys(this.errors).length !== 0) {
      this.setState({ isValid: false });
      return;
    }
    if (this.errors && Object.keys(this.errors).length !== 0) {
      this.setState({ isValid: false });
      return;
    }
    const result = await this.registerTransaction();
    if (result && result.res && result.res.success) {
      this.openModal();
    } else {
      console.log("Order can't be completed");
    }
  };

  render() {
    let error;
    if (!this.isValid && JSON.stringify({}) !== JSON.stringify(this.errors)) {
      for (let key in this.errors) {
        if (this.errors[key] !== "") {
          error = this.errors[key];
          break;
        }
      }
    }

    return (
      <BlockUi
        tag="div"
        blocking={!this.props.txId}
        className="container blocker"
        loader={<Loader active type="ball-spin-fade-loader" color="#f0b90b" />}
      >
        <div className="container homeContainer">
          <div className="row justify-content-center align-items-center">
            <div className="ratesContainer col-12">
              <div className="rates">
                <span>1 bitcoin = $ </span>
                <span className="currentRate"> {this.props.btcToAud} </span>
                <span> AUD</span>
              </div>
              <div className="feeAndCommission">
                <p>Including 5% commission</p>
              </div>
            </div>

            <div className="form">
              <div className="errorMsgContainer">
                {!this.isValid &&
                  JSON.stringify({}) !== JSON.stringify(this.errors) && (
                    //   <div className="row justify-content-center align-items-center validationMsgContainer">
                    <div className="validationMsg text-left">{error}</div>
                    //   </div>
                  )}
              </div>
              <div className="audToBtcInputContainer form-group form-inline justify-content-between">
                {/* <div className="form-group form-inline"> */}
                {/* <div className="form-control"> */}
                {/* <i className="fa fa-dollar-sign dollarIcon form-inline" /> */}
                <input
                  className={
                    "audInput form-control form-inline text-center" +
                    (this.errors["audInput"] ? " is-invalid" : "")
                  }
                  placeholder="AUD"
                  name="audInput"
                  type="text"
                  value={this.state.audInput}
                  onChange={this.handleAudChange}
                  autocomplete="off"
                />
                {/* </div> */}

                {/* <div className="form-control"> */}
                {/* <i className="fab fa-btc btcIcon form-inline" /> */}
                <input
                  className={
                    "btcInput form-control form-inline text-center" +
                    (this.errors["btcInput"] ? " is-invalid" : "")
                  }
                  placeholder="BTC"
                  name="btcInput"
                  type="text"
                  value={this.state.btcInput}
                  onChange={this.handleBtcChange}
                  autocomplete="off"
                />
                {/* </div> */}
                {/* </div> */}
                {/* {!this.isValid && this.errors["audInput"] && (
                  //   <div className="row justify-content-center align-items-center validationMsgContainer">
                  <div className="validationMsg text-left">
                    {this.errors["audInput"]}
                  </div>
                  //   </div>
                )}
                {!this.isValid && this.errors["btcInput"] && (
                  //   <div className="row justify-content-center align-items-center validationMsgContainer">
                  <div className="validationMsg text-left">
                    {this.errors["btcInput"]}
                  </div>
                  //   </div>
                )} */}
              </div>

              {/* <div className="userDetailsContainer"> */}
              <div className="xyz">
                <input
                  className={
                    "emailInput form-control" +
                    (this.errors["emailInput"] ? " is-invalid" : "")
                  }
                  placeholder="Email Address"
                  name="emailInput"
                  type="text"
                  value={this.state.emailInput}
                  onChange={this.handleChange}
                  autocomplete="nope"
                />
                {/* {!this.isValid && this.errors["emailInput"] && (
                  <div className="validationMsg text-left">
                    {this.errors["emailInput"]}
                  </div>
                )} */}
              </div>

              <div className="xyz">
                <input
                  className={
                    "walletAddressInput form-control" +
                    (this.errors["walletAddressInput"] ? " is-invalid" : "")
                  }
                  placeholder="Bitcoin Wallet Address"
                  name="walletAddressInput"
                  type="text"
                  value={this.state.walletAddressInput}
                  onChange={this.handleChange}
                  autocomplete="nope"
                />
                {/* {!this.isValid && this.errors["walletAddressInput"] && (
                  <div className="validationMsg text-left">
                    {this.errors["walletAddressInput"]}
                  </div>
                )} */}
              </div>

              <div className="xyz">
                <input
                  className={
                    "mobileInput form-control" +
                    (this.errors["mobileInput"] ? " is-invalid" : "")
                  }
                  placeholder="Mobile Phone"
                  name="mobileInput"
                  type="text"
                  value={this.state.mobileInput}
                  onChange={this.handleMobileChange}
                  onFocus={this.handleMobileFocus}
                  onBlur={this.handleMobileBlur}
                  autocomplete="nope"
                />
                {/* {!this.isValid && this.errors["mobileInput"] && (
                  <div className="validationMsg text-left">
                    {this.errors["mobileInput"]}
                  </div>
                )} */}
              </div>

              <div className="xyz text-left p-0">
                <div className="abc">
                  {/* {!this.isValid && this.errors["tcCheckbox"] && (
                    <div className="validationMsg text-left">
                      {this.errors["tcCheckbox"]}
                    </div>
                  )} */}
                  <div className="tcCheckboxContainer">
                    <input
                      className={
                        "tcCheckbox form-control" +
                        (this.errors["tcCheckbox"] ? " is-invalid" : "")
                      }
                      name="tcCheckbox"
                      type="checkbox"
                      defaultChecked={this.state.tcCheckbox}
                      onChange={this.handleCheckboxClick}
                    />
                    <p className="tcText">
                      I accept the InvestByBit <em>Terms & Conditions</em>
                    </p>
                  </div>

                  <div className="tcCheckboxContainer">
                    <input
                      className={
                        "tcCheckbox form-control" +
                        (this.errors["tcCheckboxWallet"] ? " is-invalid" : "")
                      }
                      name="tcCheckboxWallet"
                      type="checkbox"
                      defaultChecked={this.state.tcCheckboxWallet}
                      onChange={this.handleCheckboxClick}
                    />
                    <p className="tcText">
                      I confirm that my receiving bitcoin wallet address is
                      correct
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="nextBtnContainer col-4 btn btn-fill text-center"
                onClick={this.handleRegisterTransaction}
              >
                Next
              </div>

              <div className="col-8">
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  style={this.customStyles}
                >
                  <MobileVerifier
                    handleClose={this.closeModal}
                    onSubmit={this.handleSubmit}
                    txId={this.props.txId}
                    txTimestamp={this.props.txTimestamp}
                    mobileInput={'+614' + this.state.mobileInput.slice(8)}
                    updateKycStatus={this.props.updateKycStatus}
                  />
                </Modal>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </BlockUi>
    );
  }
}

export default Home;
