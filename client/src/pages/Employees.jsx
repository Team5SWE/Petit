import React, { Component } from "react";
import "../css/aboutpage.css";
import male from "../assets/male.jpeg";
import female from "../assets/female.jpeg";
import EmployeeCard from "../components/employee-card/EmployeeCard.jsx";
import {Navigate} from "react-router-dom";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", authenticated: false, loaded: false, employees: [] };
  }


  componentDidMount(){
    this.callApi();
  }

  callApi(){

    // Call authentication endpoint with access token
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

      //Save api data into states
      this.setState({authenticated: res.valid, apiResponse: res, loaded: true, employees: []})

      //If authenticated, then fetch data from employees
      if(res.valid){

        fetch('http://127.0.0.1:8000/api/salon/'+res.business.id+'/employees/')
        .then(res => res.json())
        .then(res => {
          if(res.valid){
            this.setState({...this.state, employees: res.employees})
          }
        });

      }

    });


  }


  render() {
    if(this.state.authenticated){
      return (
        <div>
          <h1>{this.state.apiResponse.business.name} Employees Profiles</h1>

          <div class="topnav">
            <a class="active" href="/">Petit</a>
            <a href="./appointment">Appointment</a>
            <a href="./contact">Contact Us</a>
            <a href="./business">My Salon Profile</a>
            <a href="./services">Services</a>
            <a href="/">Sign Out</a>
          </div>

          <div className="employee-cards">
      {this.state.employees?.map(employee =>
        <EmployeeCard name={employee.name} phone={employee.phone}
        email={employee.email} key={employee.id}/>
      )}
        </div>

    </div>
    )
  } else if(this.state.loaded){

    return(
      <Navigate to="/login" />
    );

  }

  }
}

export default Employees;
