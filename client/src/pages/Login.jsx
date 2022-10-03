import { Component } from "react";
import FormInput from "../components/form-input/form-input";
import "../css/SignUp.css";
import "../App.css";

export default class Login extends Component {
  signInForm = [
    { key: "email", label: "Email address" },
    { key: "password", label: "Password", isPassword: true },
  ];
  render() {
    return (
      <div className="signin-container">
        <h1>Petit</h1>
        <div className="form-list">
          <div>
            <h4>Sign in</h4>
          </div>
          <div>
            {this.signInForm.map((form) => (
              <FormInput key={form.key} id={form.key} label={form.label} isPassword={form.isPassword}></FormInput>
            ))}
          </div>
          <div>
          <a href='/salon'>
            <button type="button" className="btn btn-primary">Sign In</button>
            </a>
          </div>
          <div>
            <span>Dont have an account? <a href="/sign-up">Sign Up</a></span>
          </div>
        </div>
      </div>
    );
  }
}
