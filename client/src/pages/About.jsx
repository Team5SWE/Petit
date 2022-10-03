import React, { Component } from "react";
import "../css/Contact.css";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render() {
    return (
      <div>

        <div class="header">
          <h1>About Us</h1>
        </div>


        <div class="topnav">
          <a href="/">Home</a>
          <a href="/sign-up">List Your Business</a>
          <a href="/login">Owner Login</a>
          <a href="/contact">Contact Us</a>
        </div>
        <p>Peteit is online platform for different salons to list their salons, so their customers can book Appointments</p>
        

        </div>

    );
  }
}

export default About;
