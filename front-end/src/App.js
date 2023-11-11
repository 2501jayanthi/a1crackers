import { Route, Switch } from "react-router-dom";

import Products from "./components/Products";
import NotFound from './components/NotFound'
import "./App.css";

const App = () => (
  <Switch>
    <Route exact path="/" component={Products} />
    <Route component={NotFound} />
  </Switch>
);
export default App;
