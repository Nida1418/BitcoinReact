import React, { Component } from "react";
import logo from "../images/binance_logo.png";
import "../css/App.css";
import VerifyDetails from "./components/VerifyDetails";
import OrderDetails from "./components/OrderDetails";
import ReceiveBitcoin from "./components/ReceiveBitcoin";
import Home from "./components/Home";
import Landing from "./components/Landing";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txid: "",
      btcToAud: "",
      txTimestamp: "",
      currentStep: 0,
      kycStatus: false,
      steps: [
        {
          id: 1,
          text: "Step 1: Create Order",
          isActive: true,
          isDone: false
        },
        {
          id: 2,
          text: "Step 2: Verify Details",
          isActive: false,
          isDone: false
        },
        {
          id: 3,
          text: "Step 3: Complete Transaction",
          isActive: false,
          isDone: false
        },
        {
          id: 4,
          text: "Receive Bitcoin",
          isActive: false,
          isDone: false
        }
      ]
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onVerify = this.onVerify.bind(this);
    this.onOrderNext = this.onOrderNext.bind(this);
    this.handleLogoClick = this.handleLogoClick.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  updateSteps = (nextCurrentStep, data) => {
    const newSteps = this.state.steps.slice();
    for (let i = 0; i < newSteps.length; i++) {
      if (newSteps[i].id < nextCurrentStep) {
        newSteps[i].isDone = true;
        newSteps[i].isActive = false;
      } else if (newSteps[i].id == nextCurrentStep) {
        newSteps[i].isDone = false;
        newSteps[i].isActive = true;
      } else {
        newSteps[i].isDone = false;
        newSteps[i].isActive = false;
      }
    }
    this.setState({ currentStep: nextCurrentStep, steps: newSteps, ...data });
  };

  componentWillMount() {
    fetch("https://blue-shyft.firebaseapp.com/api/sandbox/openTransaction", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(json =>
        this.setState({
          txid: json.id,
          btcToAud: (json.BTCAUD + json.BTCAUD * 0.05).toFixed(2),
          txTimestamp: json.timestamp
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  onSubmit(data) {
    if (this.state.kycStatus) {
      this.updateSteps(3, data);
    } else {
      this.updateSteps(2, data);
    }
  }

  onVerify = response => {
    if (response.error) {
      if (response.error === "verification_in_progress") {
        console.log(response.error_description);
      }
      console.error(`error: ${response.error}`);
      console.log(response.error_description);
      return;
    }

    const data = {
      id: this.state.txid,
      digitalID: response.code,
      timestamp: this.state.txTimestamp
    };

    fetch("https://blue-shyft.firebaseapp.com/api/sandbox/validateKYC", {
      method: "POST",
      // cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(response => {
        if (response.status !== 200) {
          console.log("unable to update KYC ");
          return;
        }
        return response.json();
      })
      .then(responseJson => console.log(responseJson))
      .catch(error => {
        console.log(error);
        console.log("unable to update KYC");
      });

    this.updateSteps(3);
  };

  onOrderNext(event) {
    event.preventDefault();
    this.updateSteps(4);
  }

  onBack(event) {
    event.preventDefault();
    this.updateSteps(3);
  }

  handleLogoClick = event => {
    window.location.reload();
  };

  updateKycStatus = status => {
    this.setState({ kycStatus: status });
  };

  handleBuyBitcoin = () => {
    this.setState({
      currentStep: 1
    });
  };

  render() {
    if (this.state.currentStep === 0) {
      return (
        <Landing
          handleBuyBitcoin={this.handleBuyBitcoin}
          btcToAud={this.state.btcToAud}
          handleLogoClick={this.handleLogoClick}
        />
      );
    } else {
      return (
        <div className="appContainer container-fluid d-flex flex-column">
          <div className="header row justify-content-center">
            <div
              className="logoContainer col-sm p-0"
              onClick={this.handleLogoClick}
            >
              <img src={logo} className="logoImg" />
            </div>
          </div>
          <div className="content row justify-content-center flex-grow-1">
            <div className="flowMargin" />
            <nav className="nav nav-pills nav-justified steps col-12">
              <div
                id="step1"
                className={
                  "nav-item nav-link step " +
                  (this.state.steps[0].isDone ? "done" : "") +
                  (this.state.steps[0].isActive ? "active" : "")
                }
              >
                {this.state.steps[0].text}
              </div>
              <div
                id="step2"
                className={
                  "nav-item nav-link step " +
                  (this.state.steps[1].isDone ? "done" : "") +
                  (this.state.steps[1].isActive ? "active" : "")
                }
              >
                {this.state.steps[1].text}
              </div>
              <div
                id="step3"
                className={
                  "nav-item nav-link step " +
                  (this.state.steps[2].isDone ? "done" : "") +
                  (this.state.steps[2].isActive ? "active" : "")
                }
              >
                {this.state.steps[2].text}
              </div>
              {/* <div
              id="step4"
              className={
                "nav-item nav-link step " +
                (this.state.steps[3].isDone ? "done" : "") +
                (this.state.steps[3].isActive ? "active" : "")
              }              
            >
              {this.state.steps[3].text}
            </div> */}
            </nav>
            {this.state.currentStep === 1 && (
              <Home
                onSubmit={this.onSubmit}
                btcToAud={this.state.btcToAud}
                updateKycStatus={this.updateKycStatus}
                txId={this.state.txid}
                txTimestamp={this.state.txTimestamp}
              />
            )}

            {this.state.currentStep === 2 && (
              <VerifyDetails onVerify={this.onVerify} />
            )}

            {this.state.currentStep === 3 && (
              <OrderDetails
                onOrderNext={this.onOrderNext}
                txId={this.state.txid}
                txTimestamp={this.state.txTimestamp}
                email={this.state.email}
                walletAddr={this.state.walletAddr}
                amountBTC={this.state.amountBTC}
                amountAUD={this.state.amountAUD}
              />
            )}

            {this.state.currentStep === 4 && (
              <ReceiveBitcoin
                onBack={this.onBack}
                walletAddr={this.state.walletAddr}
                amountBTC={this.state.amountBTC}
              />
            )}
          </div>
          {this.state.currentStep !== 3 && (
            <div className="footer row justify-content-center">
              <div className="copyright col-12">
                © 2019 InvestbyBit Pty. Ltd. All Rights Reserved
              </div>
            </div>
          )}
          {this.state.currentStep === 3 && (
            <div className="landingFooter row justify-content-center align-items-center mt-5">
              <div className="col-3">
                <img src={logo} className="footerLogo" />
              </div>
              <div className="binanceInfoContainer col-6 flex-grow-1 mb-5">
                <h5 className="aboutUs mt-4">About Us</h5>
                <div className="binanceXinfo mt-4">
                  <div>
                    Binance X is an independently operated subsidiary of the
                    Binance.com
                  </div>
                  <div>
                    cryptocurrency exchange. Our mission is to help grow and
                    develop the
                  </div>
                  <div>
                    Bitcoin ecosystem by making things simple, safe, and
                    reliable for users
                  </div>
                  <div>
                    to learn and adopt cryptocurrency in their daily lives
                  </div>
                </div>
                <div className="landingCopyright mt-4">
                  © 2019 InvestbyBit Pty. Ltd. All Rights Reserved
                </div>
                <div className="termsAndConditions mt-2">
                  Terms & Conditions. Privacy Policy.
                </div>
              </div>
              <div className="footerFiller col-3" />
            </div>
          )}
        </div>
      );
    }
  }
}

export default App;
