import {React, Component} from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import PageLoader from "../../components/navbar/PageLoader.jsx";

import {useParams} from "react-router-dom";
import {Navigate} from "react-router-dom";


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import "../../css/customer/appointment.css";

class Appointment extends Component {
  constructor(props){
    super(props)

    const {id} = this.props.params;

    this.state = {
      servicesList: [],
      employeeList: [],
      addressList: [],
      timeSlots: [],

      showTime: false,
      errorMsg: '',

      service: '',
      employee: '',
      address: '',

      token: '',
      date: new Date(),
      selectedSlot: '',
      endTime: '',

      businessData: null,
      stage: 'waiting',
      busId: id,

      clientName: '',
      clientEmail: '',
      clientPhone: ''
    }

    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getEndTime = this.getEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSlotClick = this.handleSlotClick.bind(this);

    this.hasClientCredentials = this.hasClientCredentials.bind(this);
    this.hasAppDetails = this.hasAppDetails.bind(this);
    this.hasAllDetails = this.hasAllDetails.bind(this);
  }


  getEndTime(){
    let time = this.state.selectedSlot.split(':')
    let hour = time[0]
    let minute = time[1]

    hour = Number(hour)
    hour += 1

    if(hour === 24)
      hour= 0

    if(hour<10)
      hour = "0"+hour.toString()
    else
      hour = hour.toString()

    return hour+':'+minute
  }

////////////////////////////////////////////////////////////////////////////
// API INTERACTIONS
//////////////////////////////////////////////////////////////////////////
  handleSubmit(){

    if(!this.hasAllDetails())
      return

    let data = {
      clientName: this.state.clientName,
      businessId: this.state.businessData.id,
      clientEmail: this.state.clientEmail,
      clientPhone: this.state.clientPhone,
      employeeId: this.state.employee,
      date: this.getFormattedDate(this.state.date),
      startTime: this.state.selectedSlot,
      endTime: this.getEndTime(this.state.selectedSlot),
      service: this.state.service,
      addressId: this.state.address
    }

    this.setState({...this.state, stage: 'waiting'})

    fetch('http://127.0.0.1:8000/api/make_appointment/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid)
        this.setState({...this.state, token: res.url, stage: 'completed'})
      else
        this.setState({...this.state, errorMsg: res.errorMessage})
    });
  }
////////////////////////////////////////////////////////////////////////////////

  callApi(){

    // Get basic business data
    fetch('http://127.0.0.1:8000/api/salon/'+this.state.busId+'/')
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, servicesList: res.services, addressList: res.addresses,
           businessData: res, stage: 'loaded'})
      } else {
        this.setState({...this.state, stage: 'failed'})
        return;
      }

    })

    // Get business employee data
    fetch('http://127.0.0.1:8000/api/salon/'+this.state.busId+'/employees/')
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, employeeList: res.employees})
      } else {
        this.setState({...this.state, stage: 'failed'})
      }
    });
  }
  //////////////////////////////////////////////////////////////////////////////
  handleSearchClick(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      selectedSlot: ''
    })

    let dateParam = this.getFormattedDate(this.state.date)
    let empParam = this.state.employee

    let fetchUrl = "http://127.0.0.1:8000/api/slots/?empId="+empParam+'&date='+dateParam

    fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({...this.state, timeSlots: res.slots})
      }
    });
  }
////////////////////////////////////////////////////////////////////////////////

  handleSlotClick(time){
    if(this.state.errorMsg === "No timeslot has been selected!"){
      this.setState({...this.state, selectedSlot: time, errorMsg: ''})
    } else {
      this.setState({...this.state, selectedSlot: time, errorMsg: ''})
    }
  }



  handleChange(e) {
    if(e.$d) {
      const value = e.$d;
      this.setState({
        ...this.state,
        date: new Date(value)
      })
    } else {
      const value = e.target.value;
      this.setState({
        ...this.state,
        [e.target.name]: value
      })
    }
  }

  componentDidMount() {
    this.setState({
      servicesList: [],
      employeeList: [],
      timeSlots: []
    });
    this.callApi()
  }



  getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  hasClientCredentials(){
    return this.state.clientName!== '' && this.state.clientEmail !=='' &&
    this.state.clientPhone !==''
  }

 hasAppDetails(){
   return this.state.service !=='' && this.state.employee!=='' && this.state.address!=='';
 }

 hasAllDetails(){

   if(this.state.selectedSlot ===''){
     this.setState({...this.state, errorMsg: 'No timeslot has been selected!'})
     return false;
   }

   if(!this.hasAppDetails()){
     this.setState({...this.state, errorMsg: 'Missing details for appointment, see above'})
     return false;
   }

   if(this.hasClientCredentials()){
     if(!this.state.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
       this.setState({...this.state, errorMsg: 'Invalid email format'})
       console.log('Invalid email')
       return false;
     }
   }

   console.log('All good')
   return true;

 }


  render(){

    const hasAppDetails = this.hasAppDetails();
    const hasClientCredentials = this.hasClientCredentials();
    const hasSlots = this.state.timeSlots.length > 0;
    const hasErrors = this.state.errorMsg !== ''
    const stage = this.state.stage

    switch(stage){
      case "waiting":
        return(
          <PageLoader/>
        )
      case "loaded":

      return(
        <div>
          <Navbar/>
          <section class="title-container">
            <h1 class="page-title">Welcome To {this.state.businessData.name}</h1>
            <h4 class="page-subtitle">LET’S MAKE AN APPOINTMENT</h4>
          </section>
          <section class="services-container">
            <div class="appointment-selectors">

              <div class="appointment-selector">
              <FormControl sx={{ backgroundColor: 'white' }} >
                <InputLabel id="input-label">Services</InputLabel>
                <Select
                  labelId="input-label"
                  label="Services"
                  id="input-label"
                  name="service"
                  onChange={this.handleChange}>
                  {this.state.servicesList.map((service) =>
                    <MenuItem key={service.id} value={service.id}>{service.name} ${service.price}</MenuItem>
                  )}
                </Select>
              </FormControl>
              </div>

              <div class="appointment-selector">
              <FormControl sx={{ backgroundColor: 'white', color: 'black' }} >
                <InputLabel id="input-label-employee">Stylist</InputLabel>
                <Select
                  labelId="input-label-employee"
                  label="Employee"
                  name="employee"
                  id="input-label-employee"
                  onChange={this.handleChange}>
                  {this.state.employeeList.map(employee =>
                    <MenuItem key={employee.id} value={employee.id}>{employee.name} </MenuItem>
                  )}
                </Select>
              </FormControl>
              </div>

              <div class="appointment-selector">
              <FormControl>
                <InputLabel id="input-label-address">Address</InputLabel>
                <Select
                  labelId="input-label-address"
                  label="Address"
                  name="address"
                  id="input-label-address"
                  onChange={this.handleChange}>
                  {this.state.addressList.map(address =>
                    <MenuItem key={address.id} value={address.id}>{address.toString} </MenuItem>
                  )}
                </Select>
              </FormControl>
              </div>

              <div class="appointment-selector">
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ backgroundColor: 'white' }}>
                  <DatePicker
                    label="Date"
                    openTo="day"
                    views={['year', 'month', 'day']}
                    value={this.state.date}
                    onChange={this.handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              {hasAppDetails ? <div class="submit-btn dark pointer" onClick={this.handleSearchClick}>SEARCH TIMESLOTS</div>
              : <div></div>}

            </div>
          </section>

          <svg id="settings-wave" viewBox="0 0 1440 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,180L48,166.7C96,153,192,127,288,100C384,73,480,47,576,46.7C672,47,768,73,864,100C960,127,1056,153,1152,143.3C1248,133,1344,87,1440,60C1536,33,1632,27,1728,50C1824,73,1920,127,2016,140C2112,153,2208,127,2304,103.3C2400,80,2496,60,2592,73.3C2688,87,2784,133,2880,133.3C2976,133,3072,87,3168,70C3264,53,3360,67,3456,60C3552,53,3648,27,3744,13.3C3840,0,3936,0,4032,23.3C4128,47,4224,93,4320,110C4416,127,4512,113,4608,106.7C4704,100,4800,100,4896,113.3C4992,127,5088,153,5184,150C5280,147,5376,113,5472,93.3C5568,73,5664,67,5760,83.3C5856,100,5952,140,6048,153.3C6144,167,6240,153,6336,136.7C6432,120,6528,100,6624,80C6720,60,6816,40,6864,30L6912,20L6912,200L6864,200C6816,200,6720,200,6624,200C6528,200,6432,200,6336,200C6240,200,6144,200,6048,200C5952,200,5856,200,5760,200C5664,200,5568,200,5472,200C5376,200,5280,200,5184,200C5088,200,4992,200,4896,200C4800,200,4704,200,4608,200C4512,200,4416,200,4320,200C4224,200,4128,200,4032,200C3936,200,3840,200,3744,200C3648,200,3552,200,3456,200C3360,200,3264,200,3168,200C3072,200,2976,200,2880,200C2784,200,2688,200,2592,200C2496,200,2400,200,2304,200C2208,200,2112,200,2016,200C1920,200,1824,200,1728,200C1632,200,1536,200,1440,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"></path></svg>

          <section class="services-container dark">

            {hasSlots ?
              <div class="make-appointment-container fadein-element">

                <div class="time-slots-container">
                  <h4 class="make-appointment-title">CHOOSE A TIME</h4>
                  <div class="time-slots">
                  { this.state.timeSlots.map((availTime, index) =>
                        {if(availTime === this.state.selectedSlot)
                           return <div key={index} class="time-slot yellow-btn selected-slot">
                          {availTime}
                          </div>
                        else {
                           return <div key={index} class="time-slot yellow-btn"
                          onClick={() => this.handleSlotClick(availTime)}>
                          {availTime}
                          </div>
                        }

                        }
                      )

                  }
                  </div>
                </div>

                <div class="client-credentials-container">
                  <h4 class="make-appointment-title">YOUR INFORMATION</h4>
                  <div class="client-credentials-inputs">

                    <input class="client-credential-input" type="text" placeholder="Your Name:"
                      value={this.state.clientName} name="clientName" onChange={this.handleChange} />

                    <input class="client-credential-input" type="email" placeholder="Your Email:"
                      value={this.state.clientEmail} name="clientEmail" onChange={this.handleChange} />

                    <input class="client-credential-input" type="text" placeholder="Your Phone:"
                     value={this.state.clientPhone} name="clientPhone" onChange={this.handleChange} />

                  </div>

                  {hasClientCredentials ? <div class="submit-btn green-btn app-btn" onClick={this.handleSubmit}>
                    MAKE APPOINTMENT </div>
                  : <div/>}
                  <div>
                    {hasErrors ? <p class="app-error">{this.state.errorMsg}</p> : <div></div>}
                  </div>

                </div>

              </div>
              : <div></div>}

          </section>


        </div>
      );
      case "completed":
        return(
          <Navigate to={"/confirmation/"+this.state.token}/>
        );
      default:
        return(
          <Navigate to={"/"}/>
        )

    }

  }

}

export default (props) => ( <Appointment
        {...props}
        params={useParams()}
    />);
