import { Component } from "react";
import {Navigate} from "react-router-dom";
import "../css/SignUp.css";
import "../App.css";
import "../components/form-input/form-input.css";

export default class SignUp extends Component {

  constructor(props){
    super(props);
    this.state = {fullName: "",
                  password: "",
                  passwordTwo: "",
                  email: "",
                  phone: "",

                  busName: "",
                  busEmail: "",
                  busPhone: "",
                  busDescription: "",

                  userData: null,
                  success: false,
                  errorMsg: ''
                  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(event){

    let field = event.target.name;
    console.log(field)
    this.setState({
      ...this.state,
      [field]: event.target.value
    })

  }

  handleSubmit(){

    if(this.state.password === '' || this.state.email === ''){
      this.setState({...this.state, errorMsg:'Missing account credentials'})
      return;
    }

    if(this.state.busDescription === '' || this.state.busEmail ===''
       || this.state.busName === '' || this.state.busPhone === ''){
         this.setState({...this.state, errorMsg:'Missing business credentials'})
         return;
       }



    let data = {

      user_name: this.state.fullName,
      password: this.state.password,
      email: this.state.email,

      businessData: {
        name: this.state.busName,
        email: this.state.busEmail,
        phone: this.state.busPhone,
        description: this.state.busDescription
      }

    }

    fetch('http://127.0.0.1:8000/api/signup/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, success: true})
      }
    })


  }


  render() {
    if(!this.state.success){

      return (

        <div className="signin-container">
          <h1>Petit</h1>
          <div className="form-lists">
          <div className="form-list">
            <div>
              <h4>Enter your account information</h4>
            </div>
            <div>

              <div className="form-container">
                <label className="form-label" htmlFor="fullName">Username</label>
                <input id="bussName" className="form-input" type="text" name="fullName"
                value={this.fullName} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="email" >Email Address</label>
                <input id="email" className="form-input" type="text" name="email"
                value={this.email} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="phone">Phone</label>
                <input id="phone" className="form-input" type="text" name="phone"
                value={this.phone} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="password">Password</label>
                <input id="password" className="form-input" type="password" name="password"
                value={this.password} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="passwordTwo">Repeat password</label>
                <input id="passwordTwo" className="form-input" type="password" name="passwordTwo"
                value={this.passwordTwo} onChange={this.handleChange}/>
              </div>

            </div>
            <div>
              <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Sign Up</button>
            </div>
            <div>
              {/* <span>I'm already a member! <a href="/login">Sign In</a></span> */}
              <span>I'm already a member! <a href="/login">Sign In</a></span>
            </div>
          </div>

          <div className="form-list">
            <div>
              <h4>Enter your business information</h4>
            </div>
            <div>

              <div className="form-container">
                <label className="form-label" htmlFor="fullName">Name</label>
                <input id="bussName" className="form-input" type="text" name="busName"
                value={this.busName} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="email" >Email Address</label>
                <input id="email" className="form-input" type="text" name="busEmail"
                value={this.busEmail} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="phone">Phone</label>
                <input id="phone" className="form-input" type="text" name="busPhone"
                value={this.busPhone} onChange={this.handleChange}/>
              </div>

              <div className="form-container">
                <label className="form-label" htmlFor="description">Description</label>
                <input id="description" className="form-input" type="text" name="busDescription"
                value={this.busDescription} onChange={this.handleChange}/>
              </div>

            </div>

          </div>

          </div>



        </div>
      );
    } else {

      return(
        <Navigate to="/login"/>
      )

    }
  }
}
