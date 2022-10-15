import React, { Component } from "react";
import "../css/aboutpage.css";
import male from "../assets/male.jpeg";
import female from "../assets/female.jpeg";

class Cancel extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render() {
    return (
<div>

<div class="header">
        <p>About Petit</p>
        <h1>We're providing affordable, intuitive, user-friendly software products that foster business growth.</h1>
      </div>


      <div class="topnav">
          <a class="active" href="/">Home</a>
          <a href="/about">About</a>
          <a href="/sign-up">List Your Business</a>
          <a href="/login">Owner Login</a>
          <a href="/contact">Contact Us</a>
        </div>
        </div>
          );
        }
      }
      
export default Cancel;