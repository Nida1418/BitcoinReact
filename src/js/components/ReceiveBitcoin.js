import React, { Component } from 'react';
import '../../css/ReceiveBitcoin.css';
import '../../css/orderDetails.css';
import '../../css/VerifyDetails.css';

class ReceiveBitcoin extends Component {

    constructor(props) {
        super(props);

    }



    render() {

        return (
            <div className='orderDetailsContainer'>
                <div className='orderDetailsTextContainer'>
                    <p className='orderDetailsText'>Once payment has been made, we will send <em>{this.props.amountBTC} Bitcoin </em>to the following Bitcoin address:<br /><em>{this.props.walletAddr}</em> </p>
                    <p className='orderDetailsText'><em>An email confirmation will be send to you once we have received your payment.</em><br />You can view your transaction via a block explorer with the blockchain transaction ID that is provided in the confirmation email.</p>
                    <div className='userDetailsContainer'>
                        <input className="transactionID" placeholder="Input Transaction ID Here" name="inputTransaction" type="text" /><br />
                    </div>
                    <div className='userDetailsContainer'>
                        <div className='nextStepBtn verifyButton viewOnExplorerButton' ><a className='nextBtn' type="button">View on Block Explorer</a></div>
                        </div>
                      <div className='userDetailsContainer'>
                        <div className='nextStepBtn backButton' ><a className='nextBtn' type="button" onClick={this.props.onBack}>Back</a></div>
                    
                    </div>
                </div>
            </div>

        )
    }
}
export default ReceiveBitcoin;
