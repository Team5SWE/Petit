import logo from "../../assets/petit_black.png";
import {React, Component} from "react";

export default class PageLoader extends Component{

  render(){
    return(
      <div class="center-screen">
        <img class="loading-logo" src={logo} alt="logo"/>
        <div class="loader"></div>
      </div>
    );
  }
}
