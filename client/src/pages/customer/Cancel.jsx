import {React, Component} from "react";
import '../../css/customer/confirm.css';
import {Navigate} from "react-router-dom";

export default class Cancel extends Component {
  constructor(props){
    super(props);
    this.state = {message: '', sent: false, sender: this.props.sender,
     busId: this.props.busId, senderEmail: this.props.email}

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

  }

  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  sendMessage(){

    if(this.state.sent)
      return;

    let name = this.state.sender.trim();
    let email = this.state.senderEmail.trim();
    let message = this.state.message.trim();

    if(name === '' || email === '' || message === '')
      return;

    let data = {
      name: name,
      email: email,
      message: message
    }

    this.setState({...this.state, sent: true});

    fetch('http://127.0.0.1:8000/api/salon/'+this.state.busId+'/contact/',
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })

  }



  render(){

    const busName = this.props.busName;

    if(busName === undefined) {
        return(
          <Navigate to="/"/>
        )
    } else {

      return(
        <section class="services-container">
        <div class="cancel-container white">

          <div class="cancel-heading">
            <h4>APPOINTMENT CANCELLED</h4>
            <i class="fa-regular fa-calendar-xmark fa-4x"></i>
            <p>Your appointment with {busName} has been succesfully canceled</p>
          </div>

          {
            !this.state.sent ?

            <div class="cancel-contact">
              <h4>LET {busName.toUpperCase()} KNOW WHAT WENT WRONG </h4>
              <textarea name="message" rows="8" cols="80" value={this.state.message}
               resizable="" onChange={this.handleChange}/>

               <div class="side-submit-btn dark-btn send-salon-msg-btn round-btn"
               onClick={this.sendMessage}>
                 SEND
               </div>
            </div> : null
          }



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

}
