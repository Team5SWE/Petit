import React, { Component } from "react";
import "../css/Contact.css";
import { Link } from 'react-router-dom'
import belahair from "../assets/belahair.jpg";
import ATLHair from "../assets/ATLHair.jpg";
import JamesHair from "../assets/JamesHair.jpg";
import LushNail from "../assets/LushNail.jpg";
import Happynail from "../assets/Happynail.jpg";
import LoveNail from "../assets/LoveNail.jpg";
import Lashbar from "../assets/Lashbar.jpg";
import Dekalash from "../assets/Dekalash.jpg";
import thelashlounge from "../assets/thelashlounge.jpg";
import envymasssage from "../assets/envymasssage.jpg";
import Relaxtime from "../assets/Relaxtime.jpg";
import Pe from "../assets/Pe.png";



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" }
  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/2/")
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }))
  }

  render() {

    console.log(this.state.apiResponse)
    return (
      <div>

        <div class="header">
        <img src={Pe} alt=""/>
          <p>Online Booking Website For ATLANTA Salon</p>
        </div>


        <div class="topnav">
          <a class="active" href="/">Home</a>
          <a href="/about">About</a>
          <a href="/sign-up">List Your Business</a>
          <a href="/login">Owner Login</a>
          <a href="/contact">Contact Us</a>
          <a href="/salon">Appointment</a>
        </div>

        <h2>LIST OF SALONS IN ATLANTA</h2>
        <div id="myBtnContainer">
          <button class="btn" onclick="filterSelection('all')"> Show all</button>
          <button class="btn" onclick="filterSelection('hair')"> Hairs</button>
          <button class="btn" onclick="filterSelection('nails')"> Nails</button>
          <button class="btn" onclick="filterSelection('lash')"> Lashes</button>
          <button class="btn" onclick="filterSelection('massage')"> Massage</button>
          <Link to="/salon"><button class="btn"> Appointment</button></Link>
        </div>

        <div class="row">

          <div class="column hair">

            <div class="content">
              <img class="col-img" src={belahair} alt="Belahair"/>
              
              <h4>Bela Hair</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>

          </div>

          <div class="column hair">
            <div class="content">
              <img class="col-img" src={ATLHair} alt="ATLHair"/>
              <h4>ATL Hair</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>
          <div class="column hair">
            <div class="content">
              <img class="col-img" src={JamesHair} alt="JamesHair"/>
              <h4>James Hair</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>

          <div class="column nails">
            <div class="content">
              <img class="col-img" src={LushNail}alt="LushNail"/>
              <h4>Lush Nails</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>
          <div class="column nails">
            <div class="content">
              <img src={Happynail} alt="Happynail" class="col-img"/>
              <h4>Happy Nails</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone}</p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>
          <div class="column nails">
            <div class="content">
              <img src={LoveNail} alt="LoveNail" class="col-img"/>
              <h4>Love Nail</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>

          <div class="column lash">
            <div class="content">
              <img class="col-img" src={Lashbar} alt="Lashbar" />
              <h4>Lash Bar</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>
          <div class="column lash">
            <div class="content">
              <img src={Dekalash} alt="Dekalash" class="col-img"/>
              <h4>Deka Lash</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>
          <div class="column lash">
            <div class="content">
              <img src={thelashlounge} alt="thelashlounge" class="col-img"/>
              <h4>The Lash Lounge</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>

          <div class="column massage">
            <div class="content">
              <img src={envymasssage} alt="envymasssage" class="col-img"/>
              <h4>Envy Massage</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone} </p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>
          <div class="column massage">
            <div class="content">
              <img src={Relaxtime} alt="Relaxtime" class="col-img"/>
              <h4>Relax Time</h4>
              <p class="phone">Phone:{this.state.apiResponse.phone}</p>
              <Link to="/salon"><button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button></Link>
            </div>
          </div>

        </div>


      </div>
    );
  }
}

export default Home;
