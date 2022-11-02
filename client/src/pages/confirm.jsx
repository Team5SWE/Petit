import React, { Component } from "react";
import { Link, useParams } from 'react-router-dom'
import "../css/confirm.css";
import confirmicon from "../assets/confirm.jpg";


class Cancel extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", token: "" };
  }

  componentDidMount(){

    this.callApi()

  }

  callApi(){

    const {id} = this.props.params;

    console.log(id)


  }


  render() {
    return (
      <div>

        <div class="topnav">
          <a class="active" href="/">Home</a>
          <a href="/about">About</a>
          <a href="/sign-up">List Your Business</a>
          <a href="/login">Owner Login</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div class="appoinmentbox">
        <img src={confirmicon}/>
        <h2>Your appointment is confirmed</h2>
        <p> View your appointment below</p>
        <hr></hr>
        <table>
            <tr>
                <td class="space"><h2>What:</h2> </td>
                <td> Hair appointment</td>
            </tr>
            <tr>
                <td><h2>When:</h2> </td>
                <td> Friday, October 14th 2022</td>
            </tr>
            <tr>
                <td><h2>Who:</h2> </td>
                <td> Tara (master stylist)</td>
            </tr>
            <tr>
                <td><h2>Where:</h2> </td>
                <td> Bela Hair</td>
            </tr>
        </table>
        <hr></hr>
        <p> This time no longer good? <a href="/cancel">Cancel</a></p>
    </div>

      </div>

    );
  }
}

export default (props) => ( <Cancel
        {...props}
        params={useParams()}
    />);
