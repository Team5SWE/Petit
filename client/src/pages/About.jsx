import React, { Component } from "react";
import "../css/aboutpage.css";
import male from "../assets/male.jpeg";
import female from "../assets/female.jpeg";

class About extends Component {
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
          <a href="/cancel">Cancel</a>

        </div>

          <h2 >Our Mission</h2>
  <p>Petit strives to help small businesses and independent service professionals reach their objectives by bringing technology solutions that foster growth. Moreover, we help people can find and make an appoinment with their spa services easier.</p>
  
  <h2 >Our Team</h2>
  <div className="row">
  <div className="column">
    <div className="card">
      <img src={male} alt="Brian Le" />
      <div className="container">
        <h2>Brian Le</h2>
        <p className="title">Frontend Developer</p>
        <p>Student in Georgia State University</p>
        <p>ble11@student.gsu.edu</p>
        <p>
          <button className="button">Contact</button>
        </p>
      </div>
    </div>
  </div>
  
  <div class="column">
    <div class="card">
      <img src={female} alt="Aleeza Iftikhar"/>
      <div class="container">
        <h2>Aleeza Iftikhar</h2>
        <p class="title">Frontend Developer</p>
        <p>Student in Georgia State University</p>
        <p>AIftikhar@student.gsu.edu</p>
        <p><button class="button">Contact</button></p>
      </div>
    </div>
  </div>
  <div class="column">
    <div class="card">
      <img src={female} alt="Jennie Vu"/>
      <div class="container">
      <h2>Jennie Vu</h2>
        <p class="title">Frontend Developer</p>
        <p>Student in Georgia State University</p>
        <p>nvu19@student.gsu.edu</p>
        <p><button class="button">Contact</button></p>
      </div>
    </div>
  </div>
</div>
  <div class="column">
    <div class="card">
      <img src={male} alt="Guillermo Clara"/>
      <div class="container">
      <h2>Guillermo Clara</h2>
        <p class="title">Full-Stack Developer</p>
        <p>Student in Georgia State University</p>
        <p>GClara@student.gsu.edu</p>
        <p><button class="button">Contact</button></p>
      </div>
    </div>
  </div>
  <div class="column">
    <div class="card">
      <img src={female} alt="Jisoo Park"/>
      <div class="container">
      <h2>Jisoo Park</h2>
        <p class="title">Backend Developer</p>
        <p>Student in Georgia State University</p>
        <p>Jpark@student.gsu.edu</p>
        <p><button class="button">Contact</button></p>
      </div>
    </div>
  </div>
        

</div>

    );
  }
}

export default About;
