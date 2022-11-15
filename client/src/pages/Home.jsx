import {React, Component} from "react";
import Navbar from "../components/navbar/navbar.jsx";
import SalonCard from "../components/salon/SalonCard.jsx";
import Dropdown from "../components/inputs/Dropdown.jsx";
import SectionLoader from "../components/navbar/SectionLoader.jsx";

import woman from "../assets/petitwoman.png";

import "../css/customer/home.css";

export default class Home extends Component{
  constructor(props){
    super(props)


    this.state= {searchOps: ['name', 'address', 'city', 'state', 'zip'],
    searchValue: '',  findBy: '', salons: [], sortBy: '',
    sortOps: ['Name (A-Z)', 'Name(Z-A)', 'Popularity'], searching: false}
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }


  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  handleDropdownChange(name, value){
    this.setState({...this.state, [name]: value})
    console.log(name+' '+value)
  }

  handleSearch(e){
    let url = 'http://127.0.0.1:8000/api/salon/?'

    this.setState({...this.state, searching: true})

    let value = this.state.searchValue.replace(' ', '+')
    let finder = this.state.findBy

    if(finder === '' || value === '')
      url = 'http://127.0.0.1:8000/api/salon/'
    else
      url += finder+'='+value

    console.log(url)

    fetch(url)
    .then(res => res.json())
    .then(res => this.setState({...this.state, salons: res.businesses, searching: false}))
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/")
      .then(res => res.json())
      .then(res => this.setState({...this.state, salons: res.businesses, searching: false }))
  }



  render(){
    return(
      <div>
        <Navbar/>

        <section class="title-container">
          <h1 class="page-title">SEARCH YOUR SALON</h1>
        </section>

        <section class="services-container">
        <div class="search-div">

          <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass "></i>
            <input type="text" placeholder="Name, City, or ZIP" name="searchValue"
            value={this.state.searchValue}
            onChange={this.handleChange}/>
          </div>

          <div class="search-by s1">
            <Dropdown default="Search by" options={this.state.searchOps}
            mainColor="white" selectColor="dark" fieldName="findBy"
            changeFunc={this.handleDropdownChange}/>
          </div>

          <div class="search-by s2">
            <Dropdown default="Sort by" options={this.state.sortOps} mainColor="white" selectColor="dark"
            fieldName="sortBy"
            changeFunc={this.handleDropdownChange}/>
          </div>

          <div class="search-btn dark" onClick={this.handleSearch}>
            SEARCH
          </div>

        </div>
        </section>

        <section class="services-container">
          <div class="salon-list">
            {
              !this.state.searching ? this.state.salons?.map(salon => (
                <SalonCard key={salon.id} name={salon.name} location={salon.email}
                params={this.state} identifier={salon.id}/>
              )) : <SectionLoader/>
            }

          </div>
        </section>

        <svg id="settings-wave" viewBox="0 0 1440 320" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,160L40,154.7C80,149,160,139,240,154.7C320,171,400,213,480,218.7C560,224,640,192,720,160C800,128,880,96,960,117.3C1040,139,1120,213,1200,229.3C1280,245,1360,203,1440,160C1520,117,1600,75,1680,53.3C1760,32,1840,32,1920,58.7C2000,85,2080,139,2160,154.7C2240,171,2320,149,2400,154.7C2480,160,2560,192,2640,197.3C2720,203,2800,181,2880,170.7C2960,160,3040,160,3120,144C3200,128,3280,96,3360,85.3C3440,75,3520,85,3600,101.3C3680,117,3760,139,3840,122.7C3920,107,4000,53,4080,74.7C4160,96,4240,192,4320,197.3C4400,203,4480,117,4560,80C4640,43,4720,53,4800,74.7C4880,96,4960,128,5040,144C5120,160,5200,160,5280,138.7C5360,117,5440,75,5520,69.3C5600,64,5680,96,5720,112L5760,128L5760,320L5720,320C5680,320,5600,320,5520,320C5440,320,5360,320,5280,320C5200,320,5120,320,5040,320C4960,320,4880,320,4800,320C4720,320,4640,320,4560,320C4480,320,4400,320,4320,320C4240,320,4160,320,4080,320C4000,320,3920,320,3840,320C3760,320,3680,320,3600,320C3520,320,3440,320,3360,320C3280,320,3200,320,3120,320C3040,320,2960,320,2880,320C2800,320,2720,320,2640,320C2560,320,2480,320,2400,320C2320,320,2240,320,2160,320C2080,320,2000,320,1920,320C1840,320,1760,320,1680,320C1600,320,1520,320,1440,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>

        <section class="services-container dark" id="about">
          <div class="divided-container">
            <div class="about-info">
              <h1 class="page-title">ABOUT US</h1>
              <p class="about-desc"> Petit strives to help small
                  businesses and independent
                  service professionals reach
                  their objectives by bringing
                  technology solutions that
                  foster growth. Moreover,
                  we help people can find and
                  make an appoinment with
                  their spa services easier.
            </p>
            </div>
            <div class="about-image-container">
              <img class="about-image" src={woman} alt="woman"/>
            </div>
          </div>
        </section>

      </div>
    )
  }


}
