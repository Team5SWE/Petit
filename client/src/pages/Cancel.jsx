import React, { Component } from "react";
import { Link } from 'react-router-dom'
import "../css/confirm.css";
import cancelicon from "../assets/booking-cancel-icon.jpg";


class Cancel extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
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
        <img src={cancelicon}/>
        <h2>Your appointment is <br></br> Canceled!</h2>
        <p> Sucessfully!</p>
        <hr></hr>
        <p> Find a new an appointment? <a class="active" href="/">Click Here</a></p>
    </div>

      </div>

    );
  }
}

export default Cancel;