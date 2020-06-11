import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreatePoint from "./pages/CreatePoint";
import FindPoint from "./pages/FindPoint";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route exact component={Home} path="/" />
      <Route exact component={CreatePoint} path="/create-point" />
      <Route component={FindPoint} path="/find" />
    </BrowserRouter>
  );
};

export default Routes;
