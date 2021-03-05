import React, { Component } from "react";
import "../../css/orderDetails.css";
import QRCode from "qrcode.react";
import Map from "./Map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

class OrderDetails extends Component {
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
    // return [{
    //   coordinates: { lat: -27.4698, lng: 153.0251 },
    //   name: 'dummy name'
    //  },
    //  {
    //   coordinates: { lat: -27.4682, lng: 153.0245 },
    //   name: 'dummy name'
    //  }
    // ];
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

  formatDate = timestamp => {
    return new Date(timestamp).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
  };

  render() {
    let orderValidTimestamp = this.props.txTimestamp * 1000 + 7200000;
    const formattedDate = this.formatDate(orderValidTimestamp);
    const qrCodeTxt = "investbybit:deposit:" + this.props.txId;
    // console.log('qr code text '+qrCodeTxt);
    return (
      //   let orderValidTimestamp = Number(this.props.txTimestamp) + 7200000;
      <div className="row justify-content-center align-items-center p-2">
        <div className="orderDetailsTextContainer col-10 m-2">
          <h4>THANK YOU FOR YOUR ORDER {this.props.txId}</h4>
          <div className="orderDetailsText">
            <p>
              We will hold your order until <em>{formattedDate}</em> (2 hours
              from now)
            </p>
            <p>
              A copy of this order code and instructions have been sent to
              <em> {this.props.email}</em>
            </p>
            <p>
              Once payment has been made, we will send{" "}
              <em>{this.props.amountBTC} Bitcoin </em>
              to the following Bitcoin address:
              <br />
              <em>{this.props.walletAddr}</em>
            </p>
          </div>
        </div>
        <div className="orderDetailsQRCodeContainer col-10">
          <div className="row justify-content-center align-items-start qrCodeRow">
            <div className="qrCodeWrapper col-5">
              <div>Your order code</div>
              <div className="qrCodeContainer">
                <QRCode className="qrCode" value={qrCodeTxt} size={250} />
              </div>
            </div>

            <div className="mapWrapper col-7">
              <div className="mapContainer">
                <div className="mapText">Locate the newsagent in your area</div>
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
              <div className="locationSearchContainer row justify-content-center align-items-center m-0 p-0">
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
          <div className="orderDetailsTextContainer mt-4">
            <p className="orderDetailsText zeroMargin m-2">
              Please bring this order code to the closest InvestByBit.com
              enabled newsagent.
              <br />
              If the QR code does not scan, please input the following code:{" "}
              <em>
                <b>{this.props.txId}</b>
              </em>
            </p>
          </div>

          <div className="orderSummaryContainer mt-4">
            <div className="row">
              <div className="col-12 text-left">
                <h2 className="orderSummaryTxt">Order Summary :</h2>
              </div>
            </div>
            <div className="row">
              <div className="summaryCol col-9 text-left">
                Amount in Bitcoin ({this.props.amountBTC} bitcoin)
              </div>
              <div className="col-2 text-right">
                ${(this.props.amountAUD / 1.05).toFixed(2)}
              </div>
            </div>
            <div className="row">
              <div className="summaryCol col-9 text-left">Commission (5%)</div>
              <div className="col-2 text-right">
                ${((this.props.amountAUD / 1.05) * 0.05).toFixed(2)}
              </div>
            </div>
            <div className="row">
              <div className="summaryCol col-9 text-left">Total :</div>
              <div className="col-2 text-right">${this.props.amountAUD}</div>
            </div>
          </div>
        </div>
        {/* <div className="nextBtnContainer col-4 btn btn-fill text-center" onClick={this.props.onOrderNext}>          
            Next          
        </div> */}
      </div>
    );
  }
}
export default OrderDetails;
