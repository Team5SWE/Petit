
import {React, Component} from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import "../../css/customer/salonsite.css";

class ContactUs extends Component{
  constructor(props){
    super(props);
    this.state = {message: '', name: '', email: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.setState({...this.state, [event.target.name] : event.target.value})
  }


  render(){

      return(
        <div>
          <Navbar/>

          <section class="white">
            <div class="salon-contact-container">
              <div class="salon-contact-info">
                <h4 class="contact-title">CONTACT US </h4>
                </div>

              <div class="salon-contact-box dark">
                <h4 class="contact-title">LEAVE A MESSAGE </h4>

                <div class="salon-contact-upper">
                  <div class="salon-contact-inputbox">
                    <input type="text" class="salon-contact-input" placeholder="Name:"
                    name="name" value={this.state.name} onChange={this.handleChange}/>
                  </div>

                  <div class="salon-contact-inputbox">
                    <input type="text" class="salon-contact-input" placeholder="Email:"
                    name="email" value={this.state.email} onChange={this.handleChange}/>
                  </div>

                </div>

                <div class="salon-contact-lower">
                  <textarea class="salon-contact-input" name="message" rows="8" cols="80"
                  resizable="" placeholder="Your message:" value={this.state.message}
                  onChange={this.handleChange}/>
                </div>

                <div class="side-submit-btn yellow-btn send-salon-msg-btn">
                  SEND
                </div>

              </div>

            </div>
          </section>

        </div>
      );


  }

}

export default (props) => ( <ContactUs
        {...props}
    />);
