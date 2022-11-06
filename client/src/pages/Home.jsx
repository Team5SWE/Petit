import React, { Component } from "react";
import "../css/Contact.css";
import { Link } from 'react-router-dom'
import belahair from "../assets/belahair.jpg";
import ATLHair from "../assets/ATLHair.jpg";
import JamesHair from "../assets/JamesHair.jpg";
import LushNail from "../assets/LushNail.jpg";
import Happynail from "../assets/Happynail.jpg";
import LoveNail from "../assets/LoveNail.jpg";
import Lashbar from "../assets/Lashbar.jpg";
import Dekalash from "../assets/Dekalash.jpg";
import thelashlounge from "../assets/thelashlounge.jpg";
import envymasssage from "../assets/envymasssage.jpg";
import Relaxtime from "../assets/Relaxtime.jpg";
import Pe from "../assets/Pe.png";

import SalonCard from "../components/salon-card/salon-card.jsx"

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { searchValue: '', findBy: '', salons: [],
     finders: ['name', 'address', 'city', 'state', 'zip']}
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.callApi();
  }

  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  handleSearch(e){
    let url = 'http://127.0.0.1:8000/api/salon/?'

    let value = this.state.searchValue.replace(' ', '+')
    let finder = this.state.findBy

    if(finder === '' || value === '')
      url = 'http://127.0.0.1:8000/api/salon/'
    else
      url += finder+'='+value

    console.log(url)

    fetch(url)
    .then(res => res.json())
    .then(res => this.setState({...this.state, salons: res.businesses}))

  }




  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/")
      .then(res => res.json())
      .then(res => this.setState({...this.state, salons: res.businesses }))
  }

  render() {

    return (
      <div>

        <div class="header">
        <img src={Pe} alt=""/>
          <p>Online Booking Website For ATLANTA Salon</p>
        </div>


        <div class="topnav">
          <a class="active" href="/">Home</a>
          <a href="/about">About</a>
          <a href="/sign-up">List Your Business</a>
          <a href="/login">Owner Login</a>
          <a href="/contact">Contact Us</a>
          <a href="/salon">Appointment</a>
        </div>

        <h2>SEARCH YOUR SHOP</h2>
        <div id="myBtnContainer">
          <input name="searchValue" placeholder="Search values: " value={this.state.searchValue} onChange={this.handleChange} />

          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <InputLabel id="input-label">Search by</InputLabel>
            <Select
              labelId="input-label"
              label="Find by"
              id="input-label"
              name="findBy"
              onChange={this.handleChange}>
              {this.state.finders.map((finder, index) =>
                <MenuItem key={index} value={finder}>{finder}</MenuItem>
              )}
            </Select>
          </FormControl>

          <button onClick={this.handleSearch}> Search </button>

        </div>

        <div class="salon-cards">

        {this.state.salons.map(salon => (
          <SalonCard name={salon.name} address={salon.email} id={salon.id}/>
        ))}



        </div>


      </div>
    );
  }
}

export default Home;
