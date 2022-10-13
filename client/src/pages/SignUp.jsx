import { Component } from "react";
import FormInput from "../components/form-input/form-input";
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
                  userData: null,
                  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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
      username: this.state.fullName,
      password: this.state.password
    }

    fetch('http://127.0.0.1:8000/api/signup/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });


  }


  render() {
    return (
      <div className="signin-container">
        <h1>Petit</h1>
        <div className="form-list">
          <div>
            <h4>Create Your Account</h4>
          </div>
          <div>

            <div className="form-container">
              <label className="form-label" htmlFor="fullName" name="bussName">Business Name</label>
              <input id="bussName" className="form-input" type="text"
              value={this.fullName} onChange={this.handleChange}/>
            </div>

            <div className="form-container">
              <label className="form-label" htmlFor="email" name="email">Email Address</label>
              <input id="email" className="form-input" type="text"
              value={this.email} onChange={this.handleChange}/>
            </div>

            <div className="form-container">
              <label className="form-label" htmlFor="email" name="email">Phone</label>
              <input id="email" className="form-input" type="password"
              value={this.phone} onChange={this.handleChange}/>
            </div>

            <div className="form-container">
              <label className="form-label" htmlFor="password" name="password">Password</label>
              <input id="password" className="form-input" type="password"
              value={this.password} onChange={this.handleChange}/>
            </div>

            <div className="form-container">
              <label className="form-label" htmlFor="passwordTwo" name="password">Repeat password</label>
              <input id="passwordTwo" className="form-input" type="text"
              value={this.passwordTwo} onChange={this.handleChange}/>
            </div>

          </div>
          <div>
            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Sign Up</button>
          </div>
          <div>
            <span>I'm already a member! <a href="/login">Sign In</a></span>
          </div>
        </div>
      </div>
    );
  }
}
