import React, {Component} from "react";
import {Navigate} from "react-router-dom";

class InitialRecover extends Component {
  constructor(props) {
    super(props);

    this.state = {

      email: '',
      errorMsg: '',
      code: '',

      step: 'request',

      newPassword: '',
      newPassword2: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
  }

  handleChange(event){
    let field = event.target.name;
    this.setState({
      ...this.state,
      [field]: event.target.value
    })
  }

  handleSubmit(){

    let data = {
      email: this.state.email
    }

    fetch('http://127.0.0.1:8000/api/recovery/request',{
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, step: 'check', errorMsg: ''})
      } else {
        this.setState({...this.state, errorMsg: res.error})
      }
    });

  }

  handleCodeSubmit(){

    let data = {
      email: this.state.email,
      code: this.state.code
    }

    fetch('http://127.0.0.1:8000/api/recovery/check', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, step: 'change', errorMsg: ''})
      } else {
        this.setState({...this.state, errorMsg: res.error})
      }

    });

  }

  handlePasswordSubmit(){
    let password1 = this.state.newPassword.replace(' ', '')
    let password2 = this.state.newPassword2.replace(' ', '')

    if(password1 === '' && password2 === '')
        return

    if(password1 !== password2){
      this.setState({...this.state, errorMsg: 'Passwords dont match'})
      return
    }

    let data = {
      email: this.state.email,
      password: this.state.newPassword
    }

    fetch('http://127.0.0.1:8000/api/recovery/change', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, step: 'success'})
      } else {
        this.setState({...this.state, errorMsg: res.error})
      }

    })

  }



  render(){

    const hasError = this.state.errorMsg !== ''

    switch(this.state.step){

      case "request":
        return(
          <div>
            <h1> Enter your accounts email </h1>
            <input name="email" value={this.state.email} onChange={this.handleChange}/>
            <button onClick={this.handleSubmit}>Request password reset</button>
            {
              hasError ?
              <p>{this.state.errorMsg} </p>
              :
              <div></div>
            }
          </div>
      );

      case "check":
        return(
          <div>
            <h1> Enter the recovery code </h1>
            <input name="code" value={this.state.code} onChange={this.handleChange}/>
            <button onClick={this.handleCodeSubmit}>Request password reset</button>
            {
              hasError ?
              <p>{this.state.errorMsg} </p>
              :
              <div></div>
            }
          </div>
        );

      case "change":
        return(
          <div>
            <p> Enter new password </p>
            <input name="newPassword" value={this.state.newPassword} onChange={this.handleChange}/>
            <p> Repeat new password </p>
            <input name="newPassword2" value={this.state.newPassword2} onChange={this.handleChange}/>
            <button onClick={this.handlePasswordSubmit}>Request password reset</button>
            {
              hasError ?
              <p>{this.state.errorMsg} </p>
              :
              <div></div>
            }
          </div>
        );

      default:
        return(
          <Navigate to="/login"/>
        );


    }


  }



}

export default InitialRecover;
