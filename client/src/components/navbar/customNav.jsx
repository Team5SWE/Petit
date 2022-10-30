import { Component } from "react";
import logo from "../../assets/logos/petit_white.png";
import "../../css/concept.css"

export default class CustomNav extends Component {
    render() {
        return <div class="navbar">
            <div class="logo-container">
              <img class="logo-nav" src={logo} alt="logo"/>
            </div>

            <div class="links">
              <a href="/">Employees</a>
              <a href="/">Appointments</a>
              <a href="/">Settings</a>
              <a href="/">Services</a>
              <a href="/">Log Out</a>
            </div>

        </div>
    }
}
