import React, { Component } from "react";
import "../../css/MobileVerifier.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faWindowClose } from "@fortawesome/free-solid-svg-icons";

class MobileVerifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
      submitClass: "disabledSubmit"
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  validatePin = pin => {
    const data = {
      id: this.props.txId,
      twofa: pin,
      timestamp: this.props.txTimestamp
    };

    return fetch(
      "https://blue-shyft.firebaseapp.com/api/sandbox/verifyCustomer",
      {
        //return fetch('http://localhost:8080/verifyCustomer', {
        method: "POST",
        // cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      }
    )
      .then(response => {
        if (response.status !== 200) {
          window.alert(
            "Pin can't be verified. Response status: ",
            response.status
          );
          return;
        }
        return response.json();
      })
      .then(responseJson => responseJson)
      .catch(error => {
        console.log(error);
        window.alert("Pin can't be verified", error);
      });
  };

  onSubmit(event) {
    if (this.state.submitClass !== "") {
      event.preventDefault();
      return;
    }

    this.props.onSubmit(event);
    //    window.location.replace('http://localhost:3000/kyc');
  }

  handleChange = async event => {
    if (event.target.value && event.target.value.length > 4) {
      return;
    }
    this.setState({ pin: event.target.value });
    if (event.target.value && event.target.value.length > 3) {
      const isPinValid = await this.validatePin(event.target.value);
      // this.setState({ submitClass: '' }); // remove this once validate pin is working
      if (
        isPinValid &&
        isPinValid.res &&
        isPinValid.res.success &&
        isPinValid.res.mobileVerify
      ) {
        this.props.updateKycStatus(isPinValid.res.kycStatus);
        this.setState({ submitClass: "" });
      } else {
        console.log("Pin can't be verified");
        this.setState({ submitClass: "disabledSubmit" });
        window.alert("Pin can't be verified");
      }
    } else {
      this.setState({ submitClass: "disabledSubmit" });
    }
  };
  // const isPinValid = this.validatePin();
  // if (isPinValid) {
  //     this.setState({ submitClass: '' });
  // } else {
  //     this.setState({ submitClass: 'disabledSubmit' });
  // }

  render() {
    return (
      // <div id="DIV_1">
      //     <div id="DIV_2">
      <div className="p-1">
        <div className="col-12">
          <div className="row justify-content-center align-items-start">
            <div className="col-1">
              <FontAwesomeIcon
                icon={faMobileAlt}
                size="2x"
                className="mobileIcon"
              />
            </div>
            <div className="col-10 flex-grow-1 text-center">
              <h5>Mobile Phone Verification</h5>
            </div>
            <div className="col-1">
              <button
                className='closeBtn'
                type="button"                
                onClick={this.props.handleClose}
              >
                <FontAwesomeIcon icon={faWindowClose} className="crossIcon" />
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 mt-3">
          <p className='submitDlgTxt'>
            You will receive an automated sms shortly with your verification
            code to <strong>{this.props.mobileInput}</strong>
          </p>
        </div>
      
        <div className="form col-12">
          <input
            className="form-control text-center"
            placeholder="Enter Verification Code"
            value={this.state.pin}
            onChange={this.handleChange}
          />
        </div>        

        <div className="col-12 text-right">
          <div
            className={"nextBtnContainer col-4 btn btn-fill text-center " + this.state.submitClass}
            onClick={this.onSubmit}
          >
            Submit Pin
          </div>
        </div>
      </div>

      // <div id="DIV_3">
      //   <form method="POST" action="https://investbybit.com.au/buy" id="FORM_4">
      //     <input
      //       name="_token"
      //       type="hidden"
      //       value="TvOCloJ6zDRbDFKvU9PnbrcKT1WvtM3KdlxpNA6l"
      //       id="INPUT_5"
      //     />
      //     <div id="DIV_6">
      //       <button
      //         type="button"
      //         id="BUTTON_7"
      //         onClick={this.props.handleClose}
      //       >
      //         <FontAwesomeIcon icon={faWindowClose} className="crossIcon" />
      //       </button>
      //       <h4 id="H4_10">
      //         <FontAwesomeIcon
      //           icon={faMobileAlt}
      //           size="2x"
      //           className="mobileIcon"
      //         />{" "}
      //         Mobile Phone Verification
      //       </h4>
      //     </div>
      //     <div id="DIV_12">
      //       <p id="P_13">
      //         <i id="I_14" /> Sending verification code...
      //       </p>
      //       <p id="P_15">
      //         Your verification code has been sent to{" "}
      //         <strong id="STRONG_16">{this.props.mobileInput}</strong> via SMS
      //       </p>
      //       <p id="P_17">
      //         You will receive an automated sms shortly with your verification
      //         code to <strong id="STRONG_18">{this.props.mobileInput}</strong>
      //       </p>
      //       <input name="_orderType" type="hidden" value="buy" id="INPUT_19" />
      //       <div id="DIV_20">
      //         <label for="Verification Code" id="LABEL_21">
      //           Verification Code
      //         </label>
      //         <input
      //           id="INPUT_22"
      //           placeholder="Enter Verification Code"
      //           value={this.state.pin}
      //           onChange={this.handleChange}
      //         />
      //         <span id="SPAN_23" />
      //       </div>
      //     </div>
      //     {/* <div id="DIV_24" onClick={this.onSubmit}>
      //       <a className={this.state.submitClass} id="A_25" type="button">
      //         Submit Pin <span id="SPAN_26">›</span>
      //       </a>
      //       <span id="SPAN_27" />{" "}
      //       <span id="SPAN_28">
      //         <small id="SMALL_29">
      //           Please wait<i id="I_30" />
      //         </small>
      //       </span>{" "}
      //       <span id="SPAN_31">(success)</span>
      //     </div> */}
      //     <div
      //           className="nextBtnContainer col-4 btn btn-fill text-center"
      //           onClick={this.onSubmit}
      //         >
      //           Submit Pin
      //         </div>
      //   </form>
      // </div>
      //     </div>
      // </div>
    );
  }
}

export default MobileVerifier;
