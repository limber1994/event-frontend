import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Reemplaza useHistory con useNavigate

    const handleSubmit = (event) => {
        event.preventDefault();
        // Mostrar datos en consola antes de enviar la solicitud
        console.log('Email:', email);
        console.log('Password:', password);

        axios.post('http://localhost:8000/api/login', { email, password })
            .then(response => {
                console.log(response.data); //
                localStorage.setItem('token', response.data.token);
                if (response.data.role === 'admin') {
                    navigate('/admin');  // Reemplaza history.push con navigate
                } else {
                    navigate('/register-event');  // Reemplaza history.push con navigate
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-link" onClick={() => navigate('/register')}>Register</button>  {/* Reemplaza history.push con navigate */}
            </form>
        </div>
    );
}

export default Login;
