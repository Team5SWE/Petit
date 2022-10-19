import React, { Component } from "react";
import "../css/dropdown.css";
import appt from "../assets/apptimg.jpg";
import list from "../assets/apptlistimg.jpg";
import employee from "../assets/employeeimg.jpg";
import services from "../assets/servicesimg.jpg";
import settings from "../assets/settingsimg.png";
import { Link } from 'react-router-dom'


class SalonSite extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" }
  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/2/")
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }))
  }

  render() {

    console.log(this.state.apiResponse)

    return (
      <div>
        <h1>{this.state.apiResponse.name} Name</h1>
        <h4> {this.state.apiResponse.email} Email</h4>
        <p>{this.state.apiResponse.description} Description</p>


        <div class="topnav">
          <a class="active" href="/">Petit</a>
          <a href="./appointment">Appointment</a>
          <a href="./contact">Contact Us</a>
          <a href="/">Sign Out</a>
        </div>
        

        <div class="row">

          <div class="column cards">
            <div class="content">
              <img class="col-img" src={services} alt="services" />
              <Link to="/services"><button class="btn2" >Manage Services</button></Link>
            </div>
          </div>
          <div class="column cards">
            <div class="content">
              <img class="col-img" src={employee} alt="employees" />
              <Link to="/employees"><button class="btn2" >Manage Employees</button></Link>
            </div>
          </div>
          <div class="column cards">

            <div class="content">
              <img class="col-img" src={settings} alt="edit information" />
              <div class="dropdown">
            <button class="btn2">Edit Profile</button>
            <div class="dropdown-content">
              <a href="/employees">Employees</a>
              <a href="/services">Services</a>
              <a href="./Home">Sign Out</a>
            </div>
          </div>
            </div>
          </div>

          <div class="column cards">

            <div class="content">
              <img class="col-img" src={appt} alt="appt" />
              <Link to="/appointment"><button class="btn2" >Make Appointments</button></Link>
            </div>

          </div>
          <div class="column cards">

            <div class="content">
              <img class="col-img" src={list} alt="view all appointments" />
              <Link to="/schedule"><button class="btn2" >View Appointments</button></Link>
            </div>

          </div>
  

        </div>


      </div>



    )
  }

}

export default SalonSite;
