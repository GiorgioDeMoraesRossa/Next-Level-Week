import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreatePoint from "./pages/CreatePoint";
import FindPoint from "./pages/FindPoint";
import Point from "./pages/Point";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route exact component={Home} path="/" />
      <Route exact component={CreatePoint} path="/create-point" />
      <Route component={FindPoint} path="/find" />
      <Route component={Point} path="/point" />
    </BrowserRouter>
  );
};

export default Routes;
