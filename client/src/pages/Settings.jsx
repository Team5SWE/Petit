import React, {Component} from 'react';
import {Navigate} from "react-router-dom";
import "../css/settings.css";

class Settings extends Component{

  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      address: "abc st, Atlanta",
      street: "",
      city: "",
      state: "",
      zip: "",
      description: "",
      authenticated: false,
      loaded: false,
      apiResponse: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchInputData = this.fetchInputData.bind(this);
  }

  componentDidMount(){
    this.callApi();
  }


  callApi(){

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
      this.fetchInputData(res);
    });

  }

  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  handleSubmit(){

    let data = {
      changes : {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        street: this.state.street,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        description: this.state.description
      },
      access: localStorage.getItem('access')
    }

    let apiUrl = 'http://127.0.0.1:8000/api/salon/'+this.state.apiResponse.business.id+'/'
    fetch(apiUrl, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      this.fetchInputData(res);
    });



  }

  fetchInputData(res){



    if(res.valid){
      let street = ''
      let city = ''
      let state = ''
      let zip = ''
      if(res.business.addresses.length >0){
        let address_components = res.business.addresses[0].split(',')
        if(address_components.length === 3){
          street = address_components[0]
          city = address_components[1]
          let state_zip = address_components[2].split(' ')
          state = state_zip[1]
          zip = state_zip[2]
        }
      }

      this.setState({
        ...this.state,
        name: res.business.name,
        email: res.business.email,
        description: res.business.description,
        phone: res.business.phone,
        street: street,
        city: city,
        state: state,
        zip: zip,
        apiResponse: res,
        authenticated: res.valid,
        loaded: true

      });

    } else {
      this.setState({
        ...this.state,
        authenticated: res.valid,
        loaded: true
      });

    }


  }


  render(){

    if(this.state.authenticated){

      return(

        <div>
            <h1 className="app-title">Business Profile</h1>
        <div class="topnav">
          <a href="./business">Go Back</a>
          <a href="./employees">Employees</a>
          <a href="./services">Services</a>
          <a href="/">Sign Out</a>
        </div>
        <br />
          <div class="main-container">

            <div class="general-info">

              <div class="contact-info">

                <div class="input-box">
                  Name:
                  <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                </div>

                <div class="input-box">
                  Email:
                  <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                </div>

                <div class="input-box">
                  Phone: <input
                  type="text"
                  name="phone"
                  value={this.state.phone}
                  onChange={this.handleChange}
                  />
                </div>

              </div>

              <div class="description-info">
                <div class="input-box">
                  Description:
                  <textarea
                  type="text"
                  name="description"
                  value={this.state.description}    // inject state correspond to input and so on
                  onChange={this.handleChange}
                  />
                </div>
              </div>




            </div>


            <div>
            Address:
            <input type="text" name="street" value={this.state.street} onChange={this.handleChange}/>
            <input type="text" name="city" value={this.state.city} onChange={this.handleChange}/>
            <input type="text" name="state" value={this.state.state} onChange={this.handleChange}/>
            <input type="text" name="zip" value={this.state.zip} onChange={this.handleChange}/>

            </div>

            <br />
            <button className="subbtn btn-floating" onClick={this.handleSubmit}>
              SUBMIT
            </button>
          </div>
        </div>

      );

    } else if(this.state.loaded){

      return(
        <Navigate to="/login" />
      );

    }



  }







}

export default Settings;
