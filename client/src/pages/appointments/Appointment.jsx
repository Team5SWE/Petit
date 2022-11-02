import React, { Component } from "react";
import "../../css/Appointment.css";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dateTimeArr from '../../mockAPI/employee-services-datetime.json'
import {Navigate} from "react-router-dom";

class Appointment extends Component {
  constructor(props) {
    super(props);
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
      clientName: '',
      clientEmail: '',
      clientPhone: ''
    }
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getEndTime = this.getEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSlotClick = this.handleSlotClick.bind(this);
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


  handleSubmit(){

    console.log(this.state)

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

    fetch('http://127.0.0.1:8000/api/make_appointment/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid)
        this.setState({...this.state, token: res.url})
      else
        this.setState({...this.state, errorMsg: res.errorMessage})
    })

  }


  getData() {
    return dateTimeArr;
  }

  handleSlotClick(time){

    this.setState({...this.state, selectedSlot: time})
  }


  handleSearchClick(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      showTime: this.state.service && this.state.employee && this.state.date && this.state.address
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
    })

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

  callApi(){

    // Get basic business data
    fetch('http://127.0.0.1:8000/api/salon/1/')
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, servicesList: res.services, addressList: res.addresses, businessData: res})
      }
      console.log(this.state.servicesList)
    })

    fetch('http://127.0.0.1:8000/api/salon/1/employees/')
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, employeeList: res.employees})
      }

    })

  }


  getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  render() {
    if(this.state.token === ''){
      return (
        <div className="appointment-container">
          <div>
            <h1> Appointment </h1>
          </div>
          <Box className="box" sx={{ m: 1, minWidth: 120 }}>

            {/* Services Drop down menu */}
            <FormControl sx={{ m: 1, minWidth: 120 }} >
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

            <FormControl sx={{ m: 1, minWidth: 120 }} >
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

            <FormControl sx={{ m: 1, minWidth: 120 }} >
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

            <FormControl sx={{ m: 1, minWidth: 120 }} >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  openTo="year"
                  views={['year', 'month', 'day']}
                  value={this.state.date}
                  onChange={this.handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <div className="search-button">
              <Button variant="contained" href="#" onClick={this.handleSearchClick}>
                Search
              </Button>
            </div>
          </Box>
          <br />
          {this.state.showTime && <div className="avail-date-container">
            Choose your available date below: <br />
            { this.state.timeSlots.map(availTime =>
                  {if(availTime === this.state.selectedSlot)
                    return <Button variant="contained">{availTime}</Button>
                  else {
                    return <Button variant="outlined" onClick={() => this.handleSlotClick(availTime)}>
                    {availTime}</Button>
                  }

                  }
                )

            }
          </div>}


          <div>
            <input type="text" name="clientName" value={this.state.clientName} onChange={this.handleChange}
             placeholder="Your Name:"/>
            <input type="text" name="clientEmail" value={this.state.clientEmail} onChange={this.handleChange}
             placeholder="Your Email:"/>
            <input type="text" name="clientPhone" value={this.state.clientPhone} onChange={this.handleChange}
            placeholder="Your Phone:"/>
            <div className="search-button">
              <Button variant="contained" href="#" onClick={this.handleSubmit}>
                Make appointment
              </Button>
            </div>
          </div>

        </div>
      )
    } else {

      return(
        <Navigate to={"/confirm/"+this.state.token}/>
      )

    }
  }
}
export default Appointment;
