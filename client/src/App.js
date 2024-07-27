import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  
  return(
    <Router>
      <Navbar/>
      <Switch>
        <Route path="/" exact component={UserHome} />
        <Route path="/hostel" exact component={Hostel} />
        <Route path="/admin" exact component={AdminHome} />
      </Switch>
    </Router>
  )
}

export default App
