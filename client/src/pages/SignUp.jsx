import { Component } from "react";
import FormInput from "../components/form-input/form-input";
import "../css/SignUp.css";
import "../App.css";

export default class SignUp extends Component {
  signInForm = [
    { key: "fullName", label: "Full name" },
    { key: "email", label: "Email address" },
    { key: "password", label: "Password", isPassword: true },
  ];
  render() {
    return (
      <div className="signin-container">
        <h1>Petit</h1>
        <div className="form-list">
          <div>
            <h4>Create Your Account</h4>
          </div>
          <div>
            {this.signInForm.map((form) => (
              <FormInput key={form.key} id={form.key} label={form.label} isPassword={form.isPassword}></FormInput>
            ))}
          </div>
          <div>
            <button type="button" className="btn btn-primary">Sign Up</button>
          </div>
          <div>
            <span>I'm already a member! <a href="#">Sign In</a></span>
          </div>
        </div>
      </div>
    );
  }
}
