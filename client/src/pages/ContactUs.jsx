import React, {Component} from "react";
import "../css/Contact.css";

class ContactUs extends Component {

  render(){
    return(
      <div>

        <div class="header">
          <h1>CONTACT US</h1>
          <p>Team 5</p>
        </div>

        <div class="topnav">
            <a class="active" href="homepage.html">Home</a>
            <a href="signup.html">List Your Business</a>
            <a href="ownerlogin.html">Owner Login</a>
            <a href="contactus.html">Contact Us</a>
        </div>

        <div class="container">
          <form action="mailto:thienbao96@gmail.com">

            <label for="fname">First Name</label>
            <input type="text" id="fname" name="firstname" placeholder="Your name.."/>

            <label for="lname">Last Name</label>
            <input type="text" id="lname" name="lastname" placeholder="Your last name.."/>

            <label for="country">Country</label>

            <select id="country" name="country">
              <option value="usa">USA</option>
              <option value="canada">Canada</option>

            </select>

            <label for="msg">Message</label>
            <textarea id="msg" name="msg" placeholder="Write something.."></textarea>

            <input type="submit" value="Submit"/>

          </form>
        </div>


      </div>
    )

  }



}

export default ContactUs;
