import React, { Component } from "react";
import "../css/Contact.css";
import { Link } from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render() {
    return (
      <div>

        <div class="header">
          <h1>PETIT</h1>
          <p>Online Booking Website For ATLANTA Salon</p>
        </div>


        <div class="topnav">
          <a class="active" href="/">Home</a>
          <a href="/about">About</a>
          <a href="/sign-up">List Your Business</a>
          <a href="/login">Owner Login</a>
          <a href="/contact">Contact Us</a>
        </div>

        <h2>LIST OF SALONS IN ATLANTA</h2>
        <div id="myBtnContainer">
          <button class="btn" onclick="filterSelection('all')"> Show all</button>
          <button class="btn" onclick="filterSelection('hair')"> Hairs</button>
          <button class="btn" onclick="filterSelection('nails')"> Nails</button>
          <button class="btn" onclick="filterSelection('lash')"> Lashes</button>
          <button class="btn" onclick="filterSelection('massage')"> Massage</button>
          <Link to="/appointment"><button class="btn"> Appointment</button></Link>
        </div>

        <div class="row">

          <div class="column hair">

            <div class="content">
              <img class="col-img" src="../assets/belahair.jpg" alt="Belahair"/>
              <h4>Bela Hair</h4>
              <p class="rating">4 Stars </p>
              <button class="btn2" onclick="window.location.href= 'Belahair.html';">Book Now</button>
            </div>

          </div>

          <div class="column hair">
            <div class="content">
              <img class="col-img" src="../assets/ATLHair.jpg" alt="ATLHair"/>
              <h4>ATL Hair</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>
          <div class="column hair">
            <div class="content">
              <img class="col-img" src="../assets/JamesHair.jpg" alt="JamesHair"/>
              <h4>James Hair</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>

          <div class="column nails">
            <div class="content">
              <img class="col-img" src="../assets/LushNail.jpg" alt="LushNail"/>
              <h4>Lush Nails</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>
          <div class="column nails">
            <div class="content">
              <img src="../assets/Happynail.jpg" alt="Happynail" class="col-img"/>
              <h4>Happy Nails</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>
          <div class="column nails">
            <div class="content">
              <img src="../assets/LoveNail.jpg" alt="LoveNail" class="col-img"/>
              <h4>Love Nail</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>

          <div class="column lash">
            <div class="content">
              <img class="col-img" src="Lashbar.jpg" alt="Lashbar" />
              <h4>Lash Bar</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>
          <div class="column lash">
            <div class="content">
              <img src="../assets/Dekalash.jpg" alt="Dekalash" class="col-img"/>
              <h4>Deka Lash</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>
          <div class="column lash">
            <div class="content">
              <img src="../assets/thelashlounge.jpg" alt="thelashlounge" class="col-img"/>
              <h4>The Lash Lounge</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>

          <div class="column massage">
            <div class="content">
              <img src="../assets/envymasssage.jpg" alt="envymasssage" class="col-img"/>
              <h4>Envy Massage</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>
          <div class="column massage">
            <div class="content">
              <img src="../assets/Relaxtime.jpg" alt="Relaxtime" class="col-img"/>
              <h4>Relax Time</h4>
              <p class="rating">5 Stars </p>
              <button class="btn2" onclick="window.location.href= 'ATLHair.html';">Book Now</button>
            </div>
          </div>

        </div>


      </div>
    );
  }
}

export default Home;
