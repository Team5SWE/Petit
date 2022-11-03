import React, { Component } from "react";
import { Link, useParams } from 'react-router-dom'
import "../css/confirm.css";
import confirmicon from "../assets/confirm.jpg";
import {Navigate} from "react-router-dom";

class Cancel extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", appToken: '', valid: false, loaded: false, cancelled: false };
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(){

    this.callApi()

  }


  handleCancel(){

    let token = this.state.appToken

    if(token === '')
      return;

    let data = {
      token: token
    }

    fetch('http://127.0.0.1:8000/api/delete_appointment/',{
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, cancelled: true})
      }
    })

  }

  callApi(){

    const {id} = this.props.params;

    this.setState({...this.state, appToken: id})

    fetch("http://127.0.0.1:8000/api/appointment/"+id)
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, apiResponse: res, valid: true, loaded: true})
      } else {
        this.setState({...this.state, loaded: true})
      }
    })


  }


  render() {
    if(this.state.loaded && this.state.valid && !this.state.cancelled){
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
          <h2>Your appointment with {this.state.apiResponse.business} is confirmed</h2>
          <p> View your appointment below</p>
          <hr></hr>
          <table>
              <tr>
                  <td class="space"><h2>What:</h2> </td>
                  <td> {this.state.apiResponse.service}</td>
              </tr>
              <tr>
                  <td><h2>When:</h2> </td>
                  <td> {this.state.apiResponse.date} at {this.state.apiResponse.start}</td>
              </tr>
              <tr>
                  <td><h2>Who:</h2> </td>
                  <td> {this.state.apiResponse.provider} (master stylist)</td>
              </tr>
              <tr>
                  <td><h2>Where:</h2> </td>
                  <td> {this.state.apiResponse.address}</td>
              </tr>
          </table>
          <hr></hr>
          <p> This time no longer good?</p> <button onClick={this.handleCancel}>Cancel</button>
      </div>

        </div>

      );
    } else if(this.state.cancelled) {
      return(
        <Navigate to="/cancel"/>
      )
    }

  }
}

export default (props) => ( <Cancel
        {...props}
        params={useParams()}
    />);
