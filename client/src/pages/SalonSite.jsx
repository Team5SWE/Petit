import React, { Component } from "react";
import male from "../assets/male.jpeg";
import female from "../assets/female.jpeg";
import "../css/Contact.css";
import { Link} from 'react-router-dom'
import "../css/dropdown.css";
import EmployeeCard from "../components/employee-card/EmployeeCard.jsx";


class SalonSite extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" }


  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/1/")
      .then(res => res.json())
      .then(res => {

        this.setState({ apiResponse: res })

        console.log(res)

      })

  }

  render() {


    return (
      <div>
        <h1>{this.state.apiResponse.name}</h1>
        <p class="phone">Email: {this.state.apiResponse.email}<br />Address: {this.state.apiResponse.addresses}<br />Phone: {this.state.apiResponse.phone} </p>
        <p>{this.state.apiResponse.description}</p>


        <div class="topnav">
          <a class="active" href="/">Petit</a>
          <a href="./appointment">Appointment</a>
          <a href="#Services">Services</a>
          <a href="#Employees">Employees</a>
        </div>

        <div id="Appointment">
          <br />
          <h3><Link to="/appointment"><button class="btn2">Make an Appointment</button></Link></h3>
          <br />
        </div>

        <div id="Services">
          <h2>Our Services</h2>
          <p>List of Services
            <ul>
              {this.state.apiResponse.services?.map( service =>
                <li>{service.name}</li>
              )}
            </ul>
          </p>
        </div>

        <div id="Employees">
          <h2>Our Team</h2>
          <div className="row">
            <div className="column">
              <div className="card">
                <img src={male} alt="Employee 1" />
                <div className="container">
                  <h3>Employee 1</h3>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="card">
                <img src={female} alt="Employee 2" />
                <div class="container">
                  <h3>Employee 2</h3>
                </div>
              </div>
            </div>


          </div>
        </div>




      </div>


    )
  }

}

export default SalonSite;
