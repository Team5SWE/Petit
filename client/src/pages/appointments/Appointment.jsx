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


class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesList: [],
      employeeList: [],
      dateTimeArr: [],
      showTime: false,
      service: '',
      employee: '',
      date: new Date()
    }
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getData() {
    return dateTimeArr;
  }
  handleSearchClick(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      showTime: this.state.service && this.state.employee && this.state.date
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
      servicesList: dateTimeArr.servicesList,
      employeeList: dateTimeArr.employeeList,
      dateTimeArr: dateTimeArr.dateTime
    });
  }
  render() {
    return (
      <div className="appointment-container">
        <div>
          <h1> Appointment </h1>
        </div>
        <Box className="box" sx={{ m: 1, minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <InputLabel id="input-label">Services</InputLabel>
            <Select
              labelId="input-label"
              label="Services"
              id="input-label"
              name="service"
              onChange={this.handleChange}>
              {this.state.servicesList.map(service =>
                <MenuItem key={service.key} value={service.value}>{service.text} ${service.price}</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <InputLabel id="input-label-employee">Employee</InputLabel>
            <Select
              labelId="input-label-employee"
              label="Employee"
              name="employee"
              id="input-label-employee"
              onChange={this.handleChange}>
              {this.state.employeeList.map(service =>
                <MenuItem key={service.key} value={service.value}>{service.text} </MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                openTo="year"
                views={['year', 'month', 'day']}
                value={new Date().toLocaleDateString()}
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
          { this.state.dateTimeArr.map(availTime =>
              <div>
                <h5>{availTime.label}</h5>
                {availTime.avail.map(avail => 
                  <Button variant="outlined">{avail.time} {avail.con}</Button>
                )}
              </div>)
          }
        </div>}
      </div>
    )
  }
}
export default Appointment;
