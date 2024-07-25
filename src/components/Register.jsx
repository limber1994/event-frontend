import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Grid, TextField, Button, Typography } from '@mui/material';

import backgroundImage from './fondo.png'; // Importa la imagen de fondo
import logo from './imagenes/log.png'; // Importa el logo

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            if (response.status === 200) {
                // Mostrar modal o mensaje de éxito y redirigir al login
                navigate('/login');
            } else {
                setError('Error al registrar. Por favor, inténtalo más tarde.');
            }
        } catch (error) {
            console.error(error);
            setError('Error al registrar. Por favor, inténtalo más tarde.');
        }
    };

    const validateForm = () => {
        if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim()) {
            setError('Por favor llenar todos los campos.');
            return false;
        }

        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden.');
            return false;
        }

        return true;
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <Paper sx={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
                <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <img src={logo} alt="Logo" style={{ width: '80px', height: 'auto', marginBottom: '5px' }} />
                        <Typography component="h2" variant="h5" sx={{ color: '#482398', fontWeight: 'bold', mb: 2 }}>
                            ¡Regístrate en EventArt!
                        </Typography>
                    </Grid>
                </Grid>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nombre"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo electrónico"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password_confirmation"
                        label="Confirmar contraseña"
                        type="password"
                        id="password_confirmation"
                        autoComplete="current-password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    {error && (
                        <Typography variant="body2" sx={{ color: 'red', mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#482398', '&:hover': { bgcolor: 'darkpurple' } }}
                    >
                        Registrarse
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default Register;
