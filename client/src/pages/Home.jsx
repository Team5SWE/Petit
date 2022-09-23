import React, { Component } from "react";
import ListSalon from "../components/list-salon/list-salon";
import Navbar from "../components/navbar/navbar";
import Searchbar from "../components/search-bar/search-bar";
import { Link } from 'react-router-dom';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }
  
  render() {
    const title = 'Start Your Business';
    return (
      <div>
        <Navbar></Navbar>
        <div>
          <Searchbar></Searchbar>
          <ListSalon></ListSalon>
        </div>
        <div>
          {title}
          <Link to="/sign-up"><button type="button">Register your business now!</button></Link>
        </div>
      </div>
    );
  }
}

export default Home;
