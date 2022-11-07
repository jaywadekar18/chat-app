import './App.css';
import Home from './pages/Home';
import Chats from './pages/Chats';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute';
import {
  BrowserRouter as Router,
  Route, Routes,
  Link
} from "react-router-dom";
function App() {
  return (
    <div >
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/chats' element={<PrivateRoute path='/chats'><Chats/></PrivateRoute>}/>
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
