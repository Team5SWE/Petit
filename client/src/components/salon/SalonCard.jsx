import {React, Component} from "react";
import logo from "../../assets/default_salon.png"

export default class SalonCard extends Component {

  render(){
    return(
      <div class="salon-card">

        <div class="salon-card-iconbox">
          <img class="circled-icon" src={logo} alt="salon logo"/>
        </div>

        <div class="salon-card-info">
          <h4>{this.props.name}</h4>
          <p>{this.props.location}</p>
        </div>

        <div class="salon-card-buttons">

          <a href={"appointment/"+this.props.identifier}>
            <div class="red-btn salon-card-btn">
              MAKE APPOINTMENT
            </div>
          </a>



          <a href={"salon/"+this.props.identifier}>
            <div class="dark-btn salon-card-btn">
              LEARN MORE
            </div>
          </a>

        </div>

      </div>
    )
  }

}
