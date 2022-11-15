import {React, Component} from "react";
import '../../css/customer/confirm.css';

export default class Cancel extends Component {

  render(){
    return(
      <section class="services-container">
      <div class="cancel-container white">

        <div class="cancel-heading">
          <h4>APPOINTMENT CANCELLED</h4>
          <i class="fa-regular fa-calendar-xmark fa-4x"></i>
          <p>Your appointment with BusName has been succesfully canceled</p>
        </div>

        <div class="cancel-contact">
          <h4>LET BUSNAME KNOW WHAT WENT WRONG </h4>
          <textarea name="description" rows="8" cols="80"
           resizable=""/>

           <div class="side-submit-btn dark-btn send-salon-msg-btn round-btn">
             SEND
           </div>
        </div>

        <div class="cancel-buttons">

          <a href="/appointment" class="full-btn green-btn round-btn">
            MAKE APPOINTMENT
          </a>

          <div class="full-btn dark-btn round-btn">
            GO BACK TO HOMEPAGE
          </div>

        </div>

      </div>
      </section>
    );
  }

}
