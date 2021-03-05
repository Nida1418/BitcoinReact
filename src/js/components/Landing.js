import React, { Component } from "react";
import "../../css/Landing.css";
import logo from "../../images/binance_logo.png";
import Map from "./Map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      lat: -27.4698,
      lng: 153.0251,
      searchLocationInput: ""
    };
  }

  componentDidMount() {
    const locations = this.loadLocations();
  }

  loadLocations = async () => {
    const data = await fetch(
      "https://blue-shyft.firebaseapp.com/api/sandbox/merchantLocations"
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.res && responseJson.res.success) {
          return JSON.parse(responseJson.res.data);
        }
        console.log(
          "Can't load map locations for following data: ",
          responseJson
        );
      })
      .then(data => {
        if (data && data.locations && data.locations.length > 0) {
          let result = [];
          let key = 0;
          for (let location of data.locations) {
            if (location.validatedAddress) {
              result.push({
                coordinates: {
                  lat: location.validatedAddress.latitude,
                  lng: location.validatedAddress.longitude
                },
                name: location.shopName,
                id: key++
              });
            }
          }
          return result;
        }
      })
      .catch(error => {
        console.log("Can't load map locations: ", error);
      });

    this.setState({
      markers: data,
      postcode: ""
    });
  };

  handleLocationSearchChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleLocationSearch = () => {
    let self = this;
    let geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      {
        address: this.state.searchLocationInput,
        componentRestrictions: { country: "AU" }
      },
      function(results, status) {
        if (status == "OK") {
          self.setState({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          console.log(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      }
    );
  };

  render() {
    return (
      <div className="appContainer container-fluid d-flex flex-column">
        <div className="header landingHeader row justify-content-center align-items-center">
          <div
            className="logoContainer col-4 p-0"
            onClick={this.props.handleLogoClick}
          >
            <img src={logo} className="logo" />
          </div>
          <div className="col-8 pull-right text-right p-0">
            <span className="btcToAud p-1">1 BTC = ${this.props.btcToAud}</span>
            <span
              className="buyBtnContainer btn btn-fill text-center"
              onClick={this.props.handleBuyBitcoin}
            >
              Buy Bitcoin
            </span>
          </div>
        </div>
        <div className="content row justify-content-center flex-grow-1">
          <div className="landingTop col-12 text-center p-0">
            <div className="topBackgroundcontainer">
              <div className="topBackground d-flex align-items-start flex-column justify-content-center h-100">
                <div className="topBackgroundTxt text-left">
                  Easiest Way to Buy Bitcoin with Cash
                </div>
                <div className="topBackgroundTxt topBackgroundTxt2 text-left">
                  in Australia
                </div>
                <div
                  className="buyBtnContainer btn btn-fill text-center"
                  onClick={this.props.handleBuyBitcoin}
                >
                  Buy Bitcoin
                </div>
              </div>
            </div>
            <div className="landingSteps col-7">
              <div className="row stepsContainer justify-content-between p-2 h-100">
                <div className="p-1 col-3">
                  <div className="landingStep step1">
                    <div className="stepNum pt-2 pl-2">Step 1</div>
                    <div className="stepDesc pl-2">Create</div>
                    <div className="stepDesc pl-2">an Order</div>
                  </div>
                </div>
                <div className="p-1 col-3">
                  <div className="landingStep step2">
                    <div className="verifyStepContentContainer">
                      <div className="stepNum pt-2 pl-2">Step 2</div>
                      <div className="stepDesc pl-2">Verify</div>
                      <div className="stepDesc pl-2">Your Details</div>
                      <div className="verifyStepBackground" />
                    </div>
                  </div>
                </div>
                <div className="p-1 col-3">
                  <div className="landingStep step3">
                    <div className="stepContentContainer">
                      <div className="stepNum pt-2 pl-2">Step 3</div>
                      <div className="stepDesc pl-2">Deposit</div>
                      <div className="stepDesc pl-2">Cash</div>
                      <div className="stepBackground" />
                    </div>
                  </div>
                </div>
                <div className="p-1 col-3">
                  <div className="landingStep step4">
                    <div className="stepContentContainer">
                      <div className="stepNum pt-2 pl-2">Step 4</div>
                      <div className="stepDesc pl-2">Receive</div>
                      <div className="stepDesc pl-2">Bitcoin</div>
                      <div className="stepBackground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="halfShadow col-7" />
          </div>
          <div className="landingContent col-12 text-center p-0">
            <div className="landingLinksRow row justify-content-center align-items-center">
              <div className="landingLinks col-12 pb-2">
                <div className="row justify-content-center align-items-center">
                  <div className="linkCol col-2 text-left" />
                  <div className="linkCol col-4 text-left">
                    <span className="bullets" />
                    <a href="/">AUD Cash Deposit Guide</a>
                  </div>
                  <div className="linkCol col-2 text-left" />
                  <div className="linkCol col-4 text-left">
                    <span className="bullets" />
                    <a href="/">Wallet Security Tips</a>
                  </div>
                </div>
                <div className="row justify-content-center align-items-center">
                  <div className="linkCol col-2 text-left" />
                  <div className="linkCol col-4 text-left">
                    <span className="bullets" />
                    <a href="/">KYC Verification Guidelines</a>
                  </div>
                  <div className="linkCol col-2 text-left" />
                  <div className="linkCol col-4 text-left">
                    <span className="bullets" />
                    <a href="/">Where to Trade Crypto</a>
                  </div>
                </div>
                <div className="row justify-content-center align-items-center">
                  <div className="linkCol col-2 text-left" />
                  <div className="linkCol col-4 text-left">
                    <span className="bullets" />
                    <a href="/">Newsagent Locations</a>
                  </div>
                  <div className="linkCol col-2 text-left" />
                  <div className="linkCol col-4 text-left">
                    <span className="bullets" />
                    <a href="/">Where to Spend Crypto</a>
                  </div>
                </div>
                <div className="linkColViewMore linkCol col-12 text-right mt-4 p-3">
                  <a className="viewMore" href="/">
                    View More Guides {">>"}
                  </a>
                </div>
              </div>
            </div>
            <div className="row justify-content-center align-items-center mt-5">
              <h4 className="buyBtcText col-10">
                Buy Bitcoin with Cash at 1300+ Newsagents Across Australia
              </h4>
            </div>
            <div className="row justify-content-center align-items-center">
              <div className="binanceTxt col-8">
                Powered by Binance.com, the world’s most trusted and leading
                cryptocurrency exchange, Binance X helps you to securely
                purchase Bitcoin (BTC) with cash in Australian Dollars (AUD)
                from a wide network of newsagents across Australia.
              </div>
            </div>
            <div className="mapHeadingContainer row justify-content-center align-items-center">
              <h4 className="mapHeading col-12">
                Find Your Nearest Deposit Location
              </h4>
            </div>
            <div className="row justify-content-center align-items-center">
              <div className="landingMap col-10 p-0">
                <Map
                  markers={this.state.markers}
                  lat={this.state.lat}
                  lng={this.state.lng}
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDew0PvMMFi1HWdQypW3WnUOXtTl2SM3_M&v=3.exp&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={
                    <div style={{ width: `100%`, height: `250px` }} />
                  }
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </div>
            </div>
            <div className="row justify-content-center align-items-center mt-1">
              <div className="col-10 p-0">
                <div className="landingLocationSearch locationSearchContainer row justify-content-center align-items-center m-auto p-0">
                  <input
                    name="searchLocationInput"
                    type="text"
                    placeholder="Enter Address, Suburb and/or Postcode"
                    className="locationSearchInput flex-grow-1 col"
                    value={this.state.searchLocationInput}
                    onChange={this.handleLocationSearchChange}
                  />
                  <span
                    className="locateBtn btn step col-3"
                    onClick={this.handleLocationSearch}
                  >
                    Locate
                    {/* <FontAwesomeIcon
                      icon={faLocationArrow}
                      size="2x"
                      className="locationArrowIcon"
                    /> */}
                  </span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center align-items-center mt-5">
              <h4 className="btcToAudContent col-8">
                1 BTC = ${this.props.btcToAud}
              </h4>
            </div>
            <div className="row justify-content-center align-items-center">
              <div className="feeAndCommission">
                <p>Including 5% commission</p>
              </div>
            </div>
            <div className="row justify-content-center align-items-center">
              <div
                className="buyBtcBtnContent buyBtnContainer btn btn-fill text-center"
                onClick={this.props.handleBuyBitcoin}
              >
                Buy Bitcoin
              </div>
            </div>
          </div>
        </div>

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
                cryptocurrency exchange. Our mission is to help grow and develop
                the
              </div>
              <div>
                Bitcoin ecosystem by making things simple, safe, and reliable
                for users 
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
      </div>
    );
  }
}
