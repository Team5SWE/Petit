import React, {Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/navbar';
import Searchbar from './components/search-bar/search-bar';
import ListSalon from './components/list-salon/list-salon';

const title = 'Start Your Business'
function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div>
        <Searchbar></Searchbar>
        <ListSalon></ListSalon>
      </div>
      <div>
        {title}
        <button type="button">Register your business now!</button>
      </div>
    </div>
  );
}

export default App;
