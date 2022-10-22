import React, { Component } from "react";
import "../css/aboutpage.css";
import male from "../assets/male.jpeg";
import female from "../assets/female.jpeg";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }


  render() {
    return (
    <div>
    <h1>{this.state.apiResponse.name} Employees Profiles</h1>

    <div class="topnav">
          <a class="active" href="/">Petit</a>
          <a href="./appointment">Appointment</a>
          <a href="./contact">Contact Us</a>
          <a href="./business">My Salon Profile</a>
          <a href="./services">Services</a>
          <a href="/">Sign Out</a>
        </div>
    
    <div className="row">
  <div className="column">
    <div className="card">
      <img src={male} alt="Employee 1" />
      <div className="container">
        <h3>Employee 1</h3>
        <p className="title">Master Stylist</p>
        <p>Phone Number</p>
        <p>Email</p>
        <p>
          <button className="button">Working Hours</button>
        </p>
      </div>
    </div>
  </div>
  
  <div class="column">
    <div class="card">
      <img src={female} alt="Employee 2"/>
      <div class="container">
        <h3>Employee 2</h3>
        <p class="title">Junior Stylist</p>
        <p>Phone Number</p>
        <p>Email</p>
        <p><button class="button">Working Hours</button></p>
      </div>
    </div>
  </div>


  </div>
  </div>
    );
  }
}

export default Employees;