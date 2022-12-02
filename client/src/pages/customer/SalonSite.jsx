import {React, Component} from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import PageLoader from "../../components/navbar/PageLoader.jsx";
import "../../css/customer/salonsite.css";

import { Navigate, useParams } from 'react-router-dom'

import ServiceCard from "../../components/services/ServiceCard.jsx"
import EmployeeCard from "../../components/employees/EmployeeCard.jsx";

import logo from "../../assets/default_salon.png";

class SalonSite extends Component{
  constructor(props){
    super(props);
    const {id} = props.params;
    this.state = {businessData: null,
    stage: 'waiting', busId: id, name: '', email: '', message: '', sending: false}

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/"+this.state.busId+'/view/')
      .then(res => res.json())
      .then(res => {
        if(res.valid){
          this.setState({...this.state, businessData: res, stage:'loaded'})
        } else {
          this.setState({...this.state, stage: 'failed'})
        }
      });
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

    fetch('http://127.0.0.1:8000/api/salon/'+this.state.busId+'/contact/',
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
          <section class="white">
            <h1 class="page-title">Welcome To {this.state.businessData.name}</h1>
            <div class="salon-presentation-container salon-site-subsection">

              <div class="logo-img-container">
                <img class="logo-img" src={logo} alt="logo"/>
              </div>

              <div class="salon-presentation-description">
                {this.state.businessData.description}
              </div>

            </div>
          </section>

          <section class="services-container">
            <h1 class="page-title">Our List of Services</h1>
            <div class="salon-site-services-container salon-site-subsection">

              <div class="services">

                {this.state.businessData.services?.map(service =>(
                  <ServiceCard key={service.id} price={service.price} name={service.name}
                  category={service.category} editable={false}/>
                ))}

                <a href={"/appointment/"+this.state.busId} class="side-submit-btn green-btn">
                  MAKE APPOINTMENT
                </a>

              </div>
            </div>
          </section>

          <svg id="settings-wave" viewBox="0 0 1440 210" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,63L60,70C120,77,240,91,360,112C480,133,600,161,720,161C840,161,960,133,1080,101.5C1200,70,1320,35,1440,28C1560,21,1680,42,1800,42C1920,42,2040,21,2160,21C2280,21,2400,42,2520,52.5C2640,63,2760,63,2880,56C3000,49,3120,35,3240,56C3360,77,3480,133,3600,143.5C3720,154,3840,119,3960,105C4080,91,4200,98,4320,98C4440,98,4560,91,4680,101.5C4800,112,4920,140,5040,140C5160,140,5280,112,5400,87.5C5520,63,5640,42,5760,45.5C5880,49,6000,77,6120,91C6240,105,6360,105,6480,119C6600,133,6720,161,6840,150.5C6960,140,7080,91,7200,77C7320,63,7440,84,7560,101.5C7680,119,7800,133,7920,119C8040,105,8160,63,8280,52.5C8400,42,8520,63,8580,73.5L8640,84L8640,210L8580,210C8520,210,8400,210,8280,210C8160,210,8040,210,7920,210C7800,210,7680,210,7560,210C7440,210,7320,210,7200,210C7080,210,6960,210,6840,210C6720,210,6600,210,6480,210C6360,210,6240,210,6120,210C6000,210,5880,210,5760,210C5640,210,5520,210,5400,210C5280,210,5160,210,5040,210C4920,210,4800,210,4680,210C4560,210,4440,210,4320,210C4200,210,4080,210,3960,210C3840,210,3720,210,3600,210C3480,210,3360,210,3240,210C3120,210,3000,210,2880,210C2760,210,2640,210,2520,210C2400,210,2280,210,2160,210C2040,210,1920,210,1800,210C1680,210,1560,210,1440,210C1320,210,1200,210,1080,210C960,210,840,210,720,210C600,210,480,210,360,210C240,210,120,210,60,210L0,210Z"></path></svg>

          <section class="services-container dark">
            <h1 class="page-title">Our fellow employees</h1>
            <div class="employees salon-site-subsection">

              {this.state.businessData.employees?.map(employee => (
                <EmployeeCard key={employee.id} specialty="Master Stylist" name={employee.name}
                 email={employee.email}/>
              ))
              }

            </div>
          </section>

          <svg id="settings-wave" class="white-wave" viewBox="0 0 1440 210" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(255, 255, 255, 1)" offset="0%"></stop><stop stop-color="rgba(255, 255, 255, 1)" offset="100%"></stop></linearGradient></defs><path class="path"  d="M0,63L60,70C120,77,240,91,360,112C480,133,600,161,720,161C840,161,960,133,1080,101.5C1200,70,1320,35,1440,28C1560,21,1680,42,1800,42C1920,42,2040,21,2160,21C2280,21,2400,42,2520,52.5C2640,63,2760,63,2880,56C3000,49,3120,35,3240,56C3360,77,3480,133,3600,143.5C3720,154,3840,119,3960,105C4080,91,4200,98,4320,98C4440,98,4560,91,4680,101.5C4800,112,4920,140,5040,140C5160,140,5280,112,5400,87.5C5520,63,5640,42,5760,45.5C5880,49,6000,77,6120,91C6240,105,6360,105,6480,119C6600,133,6720,161,6840,150.5C6960,140,7080,91,7200,77C7320,63,7440,84,7560,101.5C7680,119,7800,133,7920,119C8040,105,8160,63,8280,52.5C8400,42,8520,63,8580,73.5L8640,84L8640,210L8580,210C8520,210,8400,210,8280,210C8160,210,8040,210,7920,210C7800,210,7680,210,7560,210C7440,210,7320,210,7200,210C7080,210,6960,210,6840,210C6720,210,6600,210,6480,210C6360,210,6240,210,6120,210C6000,210,5880,210,5760,210C5640,210,5520,210,5400,210C5280,210,5160,210,5040,210C4920,210,4800,210,4680,210C4560,210,4440,210,4320,210C4200,210,4080,210,3960,210C3840,210,3720,210,3600,210C3480,210,3360,210,3240,210C3120,210,3000,210,2880,210C2760,210,2640,210,2520,210C2400,210,2280,210,2160,210C2040,210,1920,210,1800,210C1680,210,1560,210,1440,210C1320,210,1200,210,1080,210C960,210,840,210,720,210C600,210,480,210,360,210C240,210,120,210,60,210L0,210Z"></path></svg>

          <section class="white">
            <div class="salon-contact-container">
              <div class="salon-contact-info">
                <h4 class="contact-title">CONTACT US </h4>

                <div class="contact-info">
                  <i class="fa-solid fa-phone fa-2x"></i>
                  <p class="contact-info-text">+1 {this.state.businessData.phone}</p>
                </div>

                <div class="contact-info">
                  <i class="fa-solid fa-envelope fa-2x"></i>
                  <p class="contact-info-text">{this.state.businessData.email}</p>
                </div>

                <h4 class="contact-title">FIND US AT </h4>

                {
                  this.state.businessData.addresses?.map(address => (
                    <div key={address.id} class="contact-info">
                      <i class="fa-solid fa-location-dot fa-2x"></i>
                      <p class="location-info-text">{address.toString}</p>
                    </div>
                  ))
                }

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
                  resizable="" value={this.state.message} placeholder="Your message:"
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

      default:
        return(
          <Navigate to="/"/>
        );
    }


  }



}

export default (props) => ( <SalonSite
        {...props}
        params={useParams()}
    />);
