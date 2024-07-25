import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Ingresar from './components/Ingresar';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import EventRegistration from './components/EventRegistration';
import ListEvent from './components/ListEvent'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ingresar" element={<Ingresar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register-event" element={<EventRegistration/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/lista-eventos" element={<ListEvent />} />
            </Routes>
        </Router>
    );
}

export default App;

