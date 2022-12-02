import {React, Component} from "react";
import logo from "../../assets/petit_white.png";
import "../../css/menus.css";

export default class Navbar extends Component{
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
          <a href="/">
          <img class="nav-logo-img" src={logo} alt=""/>
          </a>
        </div>

        <div class="nav-links">
          <a class="nav-link" href="/#about">About Us</a>
          <a class="nav-link" href="/contact">Contact Us</a>
          <a class="nav-link exit-link" href="/business#stats">Business Portal</a>
        </div>

        <svg class="hamburger pointer" viewBox="0 0 100 80" width="40" height="40" onClick={this.toggleMenu}>
          <rect width="100" height="20"></rect>
          <rect y="30" width="100" height="20"></rect>
          <rect y="60" width="100" height="20"></rect>
        </svg>

      </div>

      {clicked ?
        <div class="vertical-nav-links">
          <a class="nav-link" href="/#aboutus">About Us</a>
          <a class="nav-link" href="/contact">Contact Us</a>
          <a class="nav-link exit-link" href="/business#stats">Business Portal</a>
        </div>
        :
        <div> </div>
      }

      </div>

    )
  }

}
