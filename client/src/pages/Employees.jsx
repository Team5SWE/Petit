import React, { Component } from "react";
import "../css/aboutpage.css";
import EmployeeCard from "../components/employee-card/EmployeeCard.jsx";
import CustomNav from "../components/navbar/customNav.jsx"
import {Navigate} from "react-router-dom";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
      authenticated: false,
      loaded: false,
      employees: [],
      changes: [],

      name: '',
      phone: '',
      email: ''
     };

    this.handleChange = this.handleChange.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
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

  deleteItem(id){

    console.log('Removing '+id)

    const list = [...this.state.employees]

    let employeeToDelete = list.find(item => item.id === id)

    let changeList= [...this.state.changes]

    if(employeeToDelete !== undefined && employeeToDelete.action === "add"){
      changeList = changeList.filter(item => item.id !== id)
    } else {
      employeeToDelete.action = "remove"
      changeList.push(employeeToDelete)
    }

    const updatedList = list.filter(item => item.id !== id);


    this.setState({...this.state, employees: updatedList, changes: changeList})

  }

  addItem(){

    if(this.state.name === '' || this.state.phone === '' || this.state.email === ''){
      console.log('Empty inputs. Ignoring')
      return;
    }


    const newEmployee = {
      id: 1 + Math.random(),
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email,
      action: 'add'
    };

    const list = [...this.state.employees]
    const changesList = [...this.state.changes]

    list.push(newEmployee);
    changesList.push(newEmployee);

    this.setState({
      ...this.state,
      employees: list,
      changes: changesList,
      name: '',
      phone: '',
      email: ''
    });

    console.log('ADded')

  }





  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }


  render() {
    if(this.state.authenticated){
      return (
        <div>

          <CustomNav/>

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
        email={employee.email} removeAction={() => this.deleteItem(employee.id)} key={employee.id}
        />
      )}
        </div>



        <div>

          <div class="input-box">
            Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
          </div>

          <div class="input-box">
            Email:
            <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
          </div>

          <div class="input-box">
            Phone:
            <input type="text" name="phone" value={this.state.phone} onChange={this.handleChange}/>
          </div>

          <button className="subbtn btn-floating" onClick={this.addItem}>
            ADD
          </button>

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
