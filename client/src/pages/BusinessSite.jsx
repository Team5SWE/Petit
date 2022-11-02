import React, { Component } from "react";
import {Navigate} from "react-router-dom";
import "../css/dropdown.css";
import appt from "../assets/apptimg.jpg";
import list from "../assets/apptlistimg.jpg";
import employee from "../assets/employeeimg.jpg";
import services from "../assets/servicesimg.jpg";
import settings from "../assets/settingsimg.png";
import { Link } from 'react-router-dom'


class BusinessSite extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "", authenticated: false, loaded: false }
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {

    let storedData = {
      access: localStorage.getItem('access')
    }

    fetch('http://127.0.0.1:8000/api/auth/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(storedData)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({authenticated: res.valid, apiResponse: res, loaded: true})
    })


  }

  handleLogout(){

    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    this.setState({...this.state, authenticated: false})

  }

  render() {

    if(this.state.authenticated){

      return (
        <div>
          <h1>{this.state.apiResponse.business.name}</h1>
          <h4> {this.state.apiResponse.business.email}</h4>
          <p class="phone">Phone: {this.state.apiResponse.business.phone} </p>
          {this.state.apiResponse.business.addresses.map(address =>
            <p class="phone">{address.toString}</p>
          )}

          <p>{this.state.apiResponse.business.description}</p>


          <div class="topnav">
            <a class="active" href="/">Petit</a>
            <a href="./appointment">Appointment</a>
            <a href="./services">Services</a>
            <a href="./employees">Employees</a>
            <a href="./contact">Contact Us</a>
            <a href="/" onClick={this.handleLogout}>Sign Out</a>
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
                <Link to="/settings"><button class="btn2" >Edit Profile</button></Link>
                {/* <div class="dropdown">
              <button class="btn2">Edit Profile</button>
              <div class="dropdown-content">
                <a href="/employees">Employees</a>
                <a href="/services">Services</a>
                <a href="./Home">Sign Out</a>
              </div>
            </div> */}
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

    } else if(this.state.loaded) {

      return(
        <Navigate to="/login" />
      )

    }

  }

}

export default BusinessSite;
