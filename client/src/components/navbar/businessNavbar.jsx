import {React, Component} from "react";
import logo from "../../assets/petit_white.png";
import "../../css/menus.css";

export default class BusinessNavbar extends Component{
  constructor(props){
    super(props);
    this.state = {clicked: false};
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(){
    let option = this.state.clicked;
    this.setState({clicked: !option});
  }


  render(){

    let clicked = this.state.clicked;

    return(
      <div>

      <div class="navbar">

        <div class="nav-logo pointer">
          <a href="/business#stats">
          <img class="nav-logo-img" src={logo} alt=""/>
          </a>
        </div>

        <div class="nav-links">
          <a class="nav-link" href="/employees">Employees</a>
          <a class="nav-link" href="/appointments">Appointments</a>
          <a class="nav-link" href="/settings">Settings</a>
          <a class="nav-link" href="/services">Services</a>
          <div class="nav-link exit-link" onClick={this.props.exitFunc}>Log out</div>
        </div>

        <svg class="hamburger pointer" viewBox="0 0 100 80" width="40" height="40" onClick={this.toggleMenu}>
          <rect width="100" height="20"></rect>
          <rect y="30" width="100" height="20"></rect>
          <rect y="60" width="100" height="20"></rect>
        </svg>

      </div>

      {clicked ?
        <div class="vertical-nav-links">
          <a class="nav-link" href="/employees">Employees</a>
          <a class="nav-link" href="/appointments">Appointments</a>
          <a class="nav-link" href="/settings">Settings</a>
          <a class="nav-link" href="/services">Services</a>
          <div class="nav-link exit-link" onClick={this.props.exitFunc}>Log out</div>
        </div>
        :
        <div> </div>
      }

      </div>

    )
  }

}
