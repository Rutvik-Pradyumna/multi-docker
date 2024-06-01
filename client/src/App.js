import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Otherpage from './Otherpage'
import Fib from './Fib'

function App() {
  return (
    <Router>
      <div>
        <Route exact path='/' component={Fib}/>
        <Route path='/otherpage' component={Otherpage}/>
      </div>
    </Router>
  );
}

export default App;
