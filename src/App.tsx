import React from "react";


import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import FullPizza from "./pages/FullPizza";
import NotFound from "./pages/NotFound";
import { Route, Routes } from "react-router-dom";



import "./scss/app.scss";
import Login from "./pages/login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/" element={<MainLayout />}>
        <Route path="home" element={<Home />} />{" "}
        <Route path="cart" element={<Cart />} />{" "}
        <Route path="pizza/:id" element={<FullPizza />} />{" "}
        <Route path="*" element={<NotFound />} />{" "}
      </Route>
    </Routes>
  );
}

export default App;
