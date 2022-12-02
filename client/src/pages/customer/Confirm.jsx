import {React, Component} from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import {useParams} from "react-router-dom";
import '../../css/customer/confirm.css';
import {Navigate} from "react-router-dom";
import PageLoader from "../../components/navbar/PageLoader.jsx";

class Confirm extends Component{
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", appToken: '', valid: false, loaded: false, cancelled: false,
     expired: false,
      stage: 'waiting', message: '', sent: false };

    this.handleCancel = this.handleCancel.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.callApi();
  }

  handleChange(event){
    this.setState({...this.state, [event.target.name] : event.target.value})
  }

  handleCancel(){
    let token = this.state.appToken
    if(token === '')
      return;

    this.setState({...this.state, stage: 'waiting'})

    let data = {
      token: token
    }

    fetch('http://127.0.0.1:8000/api/delete_appointment/',{
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, cancelled: true, stage: 'cancelled'})
      } else {
        this.setState({...this.state, stage: 'failed'})
      }
    })
  }

  callApi(){
    const {id} = this.props.params;

    this.setState({...this.state, appToken: id})

    fetch("http://127.0.0.1:8000/api/appointment/"+id)
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, apiResponse: res, stage: 'loaded', expired: res.finish})
      } else {
        this.setState({...this.state, stage: 'failed'})
      }
    })
  }


  sendMessage(){

    if(this.state.sent)
      return;

    let name = this.state.apiResponse.clientName;
    let email = this.state.apiResponse.clientEmail;
    let message = this.state.message.trim();

    if(message === '')
      return;

    let data = {
      name: name,
      email: email,
      message: message
    }

    this.setState({...this.state, sent: true});

    fetch('http://127.0.0.1:8000/api/salon/'+this.state.apiResponse.businessId+'/contact/',
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
  }



  render(){

    const stage = this.state.stage;

    switch(stage){

      case "waiting":
        return(
          <PageLoader/>
        );

      case "loaded":
      return(
        <div>
          <Navbar/>
          <section class="title-container">
            <h1 class="page-title">YOUR APPOINTMENT DETAILS</h1>
          </section>

          <section class="services-container">
            <div class="appointment-container">

              <div class="appointment-info white">
                <div class="info-title">
                  Your info:
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Name:</h4>
                  <p>{this.state.apiResponse.clientName}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Service:</h4>
                  <p>{this.state.apiResponse.service}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Date:</h4>
                  <p>{this.state.apiResponse.date}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Time:</h4>
                  <p>{this.state.apiResponse.start}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Stylist:</h4>
                  <p>{this.state.apiResponse.provider}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Location:</h4>
                  <p>{this.state.apiResponse.address}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Appointment ID:</h4>
                  <p>{this.state.appToken}</p>
                </div>

              </div>

              <div class="appointment-info appointment-contact dark">

                <div class="info-title">
                  Contact:
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Business Name:</h4>
                  <p>{this.state.apiResponse.business}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Business Email:</h4>
                  <p>{this.state.apiResponse.businessEmail}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Business Phone:</h4>
                  <p>{this.state.apiResponse.providerPhone}</p>
                </div>

                <div class="info-box">
                  <h4 class="info-box-title">Employee Email:</h4>
                  <p>{this.state.apiResponse.providerEmail}</p>
                </div>

                {!this.state.expired ? <div class="cancel-box">
                  <p>No longer able to come?</p>
                  <div class="cancel-btn red-btn" onClick={this.handleCancel}>
                    CANCEL APPOINTMENT
                  </div>
                </div> : <div class="ignore"/>}

              </div>

            </div>
          </section>

        </div>
      );

    case "cancelled":
      return(
        <section class="services-container">
        <div class="cancel-container white">

          <div class="cancel-heading">
            <h4>APPOINTMENT CANCELLED</h4>
            <i class="fa-regular fa-calendar-xmark fa-4x"></i>
            <p>Your appointment with {this.state.apiResponse.business} has been succesfully canceled</p>
          </div>

          {
            !this.state.sent ?

            <div class="cancel-contact">
              <h4>LET {this.state.apiResponse.business.toUpperCase()} KNOW WHAT WENT WRONG </h4>
              <textarea name="message" rows="8" cols="80" value={this.state.message}
               resizable="" onChange={this.handleChange}/>

               <div class="side-submit-btn dark-btn send-salon-msg-btn round-btn"
               onClick={this.sendMessage}>
                 SEND
               </div>
            </div> : null
          }

          <div class="cancel-buttons">

            <a href={"/appointment/"+this.state.apiResponse.businessId}
            class="full-btn green-btn round-btn">
              MAKE APPOINTMENT
            </a>

            <a href="/" class="full-btn dark-btn round-btn">
              GO BACK TO HOMEPAGE
            </a>

          </div>

        </div>
        </section>
      );
      default:
        return(
          <Navigate to="/"/>
        );
    }

  }
}

export default (props) => ( <Confirm
        {...props}
        params={useParams()}
    />);
