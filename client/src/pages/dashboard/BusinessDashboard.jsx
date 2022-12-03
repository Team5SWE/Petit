import {React, Component} from "react";

import BusinessNavbar from "../../components/navbar/businessNavbar.jsx";

import PageLoader from "../../components/navbar/PageLoader.jsx";
import AppointmentCard from "../../components/salon/AppointmentCard.jsx"


import "../../css/dashboard/dashboard.css";

import {Navigate} from "react-router-dom";

export default class BusinessDashboard extends Component{

  constructor(props) {
    super(props);
    this.state = { apiResponse: "",
    authenticated: false,
    stage: 'waiting',
    totalAppointments: 0,
    totalEmployees: 0,
    views: 0,
    mostPopular: '-',
    recentAppointments: []
   }
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    let storedData = {
      access: localStorage.getItem('access')
    }

    fetch('http://127.0.0.1:8000/api/auth/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(storedData)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({authenticated: res.valid, apiResponse: res})

        fetch('http://127.0.0.1:8000/api/salon/'+res.business.id+'/stats/')
        .then(res => res.json())
        .then(res => {
          if(res.valid){
            this.setState({...this.state, totalEmployees: res.employees,
            totalAppointments: res.appointments, views: res.views, stage: 'loaded',
            recentAppointments: res.recentAppointments, mostPopular: res.popularService})
          }
        })

      } else {
        this.setState({authenticated: res.valid, apiResponse: res, stage: 'failed'})
      }
    })
  }

  handleLogout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    this.setState({...this.state, authenticated: false, stage: 'failed'})
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
          <BusinessNavbar exitFunc={this.handleLogout}/>
          <section class="title-container">
            <h1 class="page-title">{this.state.apiResponse.business.name+"'s Dashboard"}</h1>
          </section>

          <svg id="settings-wave" viewBox="0 0 1440 230" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,92L80,88.2C160,84,320,77,480,84.3C640,92,800,115,960,134.2C1120,153,1280,169,1440,153.3C1600,138,1760,92,1920,61.3C2080,31,2240,15,2400,7.7C2560,0,2720,0,2880,19.2C3040,38,3200,77,3360,80.5C3520,84,3680,54,3840,65.2C4000,77,4160,130,4320,130.3C4480,130,4640,77,4800,76.7C4960,77,5120,130,5280,126.5C5440,123,5600,61,5760,61.3C5920,61,6080,123,6240,130.3C6400,138,6560,92,6720,95.8C6880,100,7040,153,7200,176.3C7360,199,7520,192,7680,184C7840,176,8000,169,8160,164.8C8320,161,8480,161,8640,134.2C8800,107,8960,54,9120,42.2C9280,31,9440,61,9600,88.2C9760,115,9920,138,10080,157.2C10240,176,10400,192,10560,187.8C10720,184,10880,161,11040,149.5C11200,138,11360,138,11440,138L11520,138L11520,230L11440,230C11360,230,11200,230,11040,230C10880,230,10720,230,10560,230C10400,230,10240,230,10080,230C9920,230,9760,230,9600,230C9440,230,9280,230,9120,230C8960,230,8800,230,8640,230C8480,230,8320,230,8160,230C8000,230,7840,230,7680,230C7520,230,7360,230,7200,230C7040,230,6880,230,6720,230C6560,230,6400,230,6240,230C6080,230,5920,230,5760,230C5600,230,5440,230,5280,230C5120,230,4960,230,4800,230C4640,230,4480,230,4320,230C4160,230,4000,230,3840,230C3680,230,3520,230,3360,230C3200,230,3040,230,2880,230C2720,230,2560,230,2400,230C2240,230,2080,230,1920,230C1760,230,1600,230,1440,230C1280,230,1120,230,960,230C800,230,640,230,480,230C320,230,160,230,80,230L0,230Z"></path></svg>
          <section class="services-container dark" id="stats">
            <h1 class="page-title page-title-left">BUSINESS OVERVIEW</h1>

            <div class="stats-widgets">

              <div class="stats-widget white slide-element-left">
                <i class="fa-regular fa-calendar fa-5x stats-widget-icon"></i>
                <h4 class="stats-widget-title">Total appointments</h4>
                <p class="stats-widget-value">{this.state.totalAppointments}</p>
              </div>

              <div class="stats-widget white slide-element-right">
                <i class="fa-solid fa-people-group fa-5x stats-widget-icon"></i>
                <h4 class="stats-widget-title">People employed</h4>
                <p class="stats-widget-value">{this.state.totalEmployees}</p>
              </div>

              <div class="stats-widget white slide-element-left">
                <i class="fa-regular fa-eye fa-5x stats-widget-icon"></i>
                <h4 class="stats-widget-title">Salon site views</h4>
                <p class="stats-widget-value">{this.state.views}</p>
              </div>

              <div class="stats-widget white slide-element-right">
                <i class="fa-regular fa-star fa-5x stats-widget-icon"></i>
                <h4 class="stats-widget-title">Popular service</h4>
                <p class="stats-widget-value">{this.state.mostPopular}</p>
              </div>


            </div>

          </section>

          <section class="services-container dark">
            <div class="extended-title-div">
              <h1 class="page-title page-title-left">HISTORY</h1>
              <p>Appointments in the last 15 days</p>
              <a class="side-submit-btn yellow-btn" href="/appointments">VIEW ALL</a>
            </div>
          </section>

          <section class="services-container dark">

          <div class="appointments-list">


            {this.state.recentAppointments.map(appointment =>

              <AppointmentCard key={appointment} provider={appointment.provider}
              service={appointment.service} date={appointment.date}
              start={appointment.start} clientName={appointment.clientName}
              url={appointment.providerUrl}/>
            )
          }

          </div>

          </section>


        </div>
      );

      default:
      return(
        <Navigate to="/login" />
      )
    }



  }

}
