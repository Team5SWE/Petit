import { Component } from "react";
import "../components/form-input/form-input"; 
import "../css/SignUp.css";
import "../App.css";

export default class Login extends Component {

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
    });

  }

  handleSubmit(){

    let data = {
      email: this.state.email,
      password: this.state.password
    }

    fetch('http://127.0.0.1:8000/api/login/', {
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
            <h4>Sign in</h4>
          </div>

          <div>

            <div className="form-container">
              <label className="form-label" htmlFor="email" >Email Address</label>
              <input id="email" className="form-input" type="text" name="email"
              value={this.email} onChange={this.handleChange}/>
            </div>

            <div className="form-container">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" className="form-input" type="password" name="password"
              value={this.password} onChange={this.handleChange}/>
            </div>

          </div>

          <div>

            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Sign In</button>

          </div>
          
          <div className="sign-up">
           <p>Dont have an account? <a href="/sign-up">Sign Up</a></p>
          </div>
        </div>
      </div>
    );
  }
}
