
import {React, Component} from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import "../../css/customer/salonsite.css";

export default class ContactUs extends Component{
  constructor(props){
    super(props);
    this.state = {message: '', name: '', email: '', sending: false};

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleChange(event){
    this.setState({...this.state, [event.target.name] : event.target.value})
  }



  sendMessage(){

    if(this.state.sending)
      return;

    let name = this.state.name.trim();
    let email = this.state.email.trim();
    let message = this.state.message.trim();

    if(name === '' || email === '' || message === '')
      return;

    let data = {
      name: name,
      email: email,
      message: message
    }

    this.setState({...this.state, sending: true});

    fetch('http://127.0.0.1:8000/api/contact/',
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(this.setState({...this.state,
      sending: false, name: '', email: '', message: ''}));
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

                <div class="side-submit-btn yellow-btn send-salon-msg-btn"
                onClick={this.sendMessage}>
                  SEND
                </div>

              </div>

            </div>
          </section>

        </div>
      );


  }

}
