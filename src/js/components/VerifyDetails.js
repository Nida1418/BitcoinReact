import React, { Component } from "react";
import "../../css/VerifyDetails.css";

class VerifyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const onverifyFn = this.props.onVerify;
    window.digitalIdAsyncInit = function() {
      window.digitalId.init({
        clientId: "ctid1jQlgSMxWPbrvFankolC2Y",
        onComplete: onverifyFn
      });
    };

    const digitalIdScript = document.createElement("script");
    digitalIdScript.id = "digitalIdScript";
    digitalIdScript.async = true;
    digitalIdScript.defer = true;
    digitalIdScript.src = "https://digitalid-sandbox.com/sdk/app.js";
    document.head.appendChild(digitalIdScript);
  }

  componentWillUnmount() {
    const digitalIdScript = document.getElementById("digitalIdScript");
    if (digitalIdScript) {
      digitalIdScript.parentNode.removeChild(digitalIdScript);
    }
  }

  render() {
    return (
      <div className="row justify-content-center align-items-center">
        <div className="verifyDetails col-10 text-left m-2">
          <p className="heading">Why is this step neccessary?</p>
          <p className="contentVerify">
            As part of a new Anti-Money Laundering and Counter-Terrorism
            Financing (AML/CTF) regulation implemented from April 1, 2018, all
            customers digital currencies like Bitcoin in Australia are required
            to complete a one-time identify verification with their digital
            currency provider.
          </p>

          <p className="heading">What information is required?</p>
          <p className="contentVerify">
            To complete the identify verification process, you will need to
            submit up to 1-2 government issued ID document numbers (Passport,
            drivers licence or medicare), as well as your residential address.
          </p>
          <p className="contentVerify">
            Your information will only be used for verification purposes and is
            only shared with our identify verification provider (Australia
            Post's Digital ID™)
          </p>
          <p className="heading">
            What happens after I click 'Verify with Digital ID™' button?
          </p>
          <p className="contentVerify">
            You will be temporarily redirected to the Digital ID™ verification
            page. Simply follow the instructions to complete the verification
            process.
          </p>
          <p className="contentVerify">
            At the final step of the verification process, you will be asked to
            review and confirm your details. Simply click <i>Allow</i> , and you
            will be redirected back to the InvestByBit.com order confirmation
            page.
          </p>          
        </div>

        <div id="digitalid-verify"  className='col-12'/>
        {/* <div className='verifyButton' ><a className='nextBtn' type="button" onClick={this.props.onVerify}>Verify with Digital ID</a></div> */}
      </div>
    );
  }
}

export default VerifyDetails;
