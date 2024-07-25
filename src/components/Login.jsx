import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Link, Grid, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

import backgroundImage from './fondo.png'; // Importa la imagen de fondo
import logo from './imagenes/log.png'; // Importa el logo

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Por favor llenar todos los campos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/register-event');
                }
            } else {
                setError('Credenciales incorrectas. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al autenticar:', error);
            setError('Error al intentar iniciar sesión. Por favor, inténtalo más tarde.');
        }
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
            <Grid container component={Paper} elevation={6} sx={{ width: '100%', maxWidth: '500px', padding: '20px' }}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <img src={logo} alt="Logo" style={{ width: '80px', height: 'auto', marginBottom: '5px' }} />
                    <Typography component="h1" variant="h5" sx={{ color: '#482398', fontWeight: 'bold', mb: 2 }}>
                        ¡Bienvenido a EventArt!
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Por favor ingrese sus datos
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Usuario"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                        {error && (
                            <Typography variant="body2" sx={{ color: 'red', mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                        <Link href="#" variant="body2" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
                            ¿Has olvidado tu contraseña?
                        </Link>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#482398', '&:hover': { bgcolor: 'darkpurple' } }}
                        >
                            Ingresar
                        </Button>
                        <Divider>o Iniciar Sesión con</Divider>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                >
                                    Google
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<FacebookIcon />}
                                >
                                    Facebook
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
                            ¿No tienes una cuenta? <Link href="/register">Registrarse</Link>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Login;
