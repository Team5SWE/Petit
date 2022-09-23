import React, {Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUs";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";


class App extends Component {

  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home/>} />

            <Route path="sign-up" element={<SignUp/>} />
            <Route path="login" element={<Login/>} />

            <Route path="contact" element={<ContactUs/>} />
            <Route path="*" element={<NotFound/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }



}

export default App;
