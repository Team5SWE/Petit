import './App.css';
import {React, Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

//Business side pages
import Home from './pages/Home.jsx';
import Services from "./pages/dashboard/Services.jsx";
import Employees from "./pages/dashboard/Employees.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import BusinessDashboard from "./pages/dashboard/BusinessDashboard.jsx";
import Schedule from "./pages/dashboard/Schedule.jsx";

import Login from "./pages/auth/Login.jsx";
import Recovery from "./pages/auth/Recovery.jsx";
import Signup from "./pages/auth/Signup.jsx";

//Customer side pages
import Confirm from "./pages/customer/Confirm.jsx";
import Appointment from "./pages/customer/Appointment.jsx";
import SalonSite from "./pages/customer/SalonSite.jsx";
import ContactUs from "./pages/customer/ContactUs.jsx";

class App extends Component {

  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home/>} />
            <Route path="services" element={<Services/>}></Route>
            <Route path="employees" element={<Employees/>}></Route>
            <Route path="confirmation/:id" element={<Confirm/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="appointments" element={<Schedule/>}/>
            <Route path="contact" element={<ContactUs/>}/>
            <Route path="business" element={<BusinessDashboard/>}/>


            <Route path="login" element={<Login/>}/>
            <Route path="recovery" element={<Recovery/>}/>
            <Route path="signup" element={<Signup/>}/>

            <Route path="appointment/:id" element={<Appointment/>}/>
            <Route path="salon/:id" element={<SalonSite/>}/>


          </Route>
        </Routes>
      </BrowserRouter>
    )
  }



}

export default App;
