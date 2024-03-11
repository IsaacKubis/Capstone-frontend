
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpaceInvaders from './components/sapceinvaders/spaceinvaders';
import DemoGame from './components/demogame'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/demo' element={<DemoGame/>} />
        <Route path='/spaceinvaders' element={<SpaceInvaders/>} />
      </Routes>
    </Router>
  );
}

export default App;
