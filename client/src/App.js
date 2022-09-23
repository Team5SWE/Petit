import React, {Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

class App extends Component {

  render(){
    return(
      <BrowserRouter>

        <Routes>

          <Route path="/">

            <Route index element={<Home/>} />
            <Route path="*" element={<NotFound/>} />

          </Route>

        </Routes>

      </BrowserRouter>
    )
  }



}

export default App;
