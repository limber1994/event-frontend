import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Container, Box, Button
} from '@mui/material';
import backgroundImage from './imagenes/museo1.png'; // Importa la imagen de fondo
import logotipo from './imagenes/log.png';

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/events')
            .then(response => {
                console.log('Eventos cargados:', response.data);
                setEvents(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat',
            color: 'white' 
        }}>
            <AppBar position="static" style={{ background: '#4A2C8B' }}>
                <Toolbar>
                    <img src={logotipo} alt="logo" style={{ marginRight: '10px', width: '50px', height: 'auto' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Eventos Culturales
                    </Typography>
                    <Button color="inherit" href="/login">Iniciar Sesión</Button>
                    <Button color="inherit" href="/register">Registrarse</Button>
                </Toolbar>
            </AppBar>
            <Container style={{ 
                textAlign: 'center', 
                marginTop: '20px', 
                flex: '1', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center' 
            }}
            maxWidth="md" // Puedes usar "xs", "sm", "md", "lg", "xl" según el tamaño que prefieras
            >
                <Box sx={{ 
                    bgcolor: 'rgba(192, 192, 192, 0.5)', 
                    borderRadius: '8px', 
                    p: 3, 
                    mx: 'auto', 
                    display: 'inline-block' 
                }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            fontFamily: 'Segoe UI', // Cambia la fuente aquí
                            fontWeight: 'bold', // Texto en negrita
                            color: '#4A2C8B' // Color del texto
                        }}
                    >
                        Bienvenido a EventArt</Typography>
                    <Typography
                        variant="h7" 
                        gutterBottom 
                        sx={{ 
                            color: '#000000', // Color de texto
                            fontFamily: 'Raleway', // Cambia la fuente aquí
                            fontWeight: 'normal', // Normal o negrita
                            mb: 2
                        }}
                    >
                        En EventArt, te invitamos a explorar la rica y vibrante escena cultural de Puno. Nuestra plataforma está diseñada para mantenerte al tanto de los eventos más emocionantes y diversos que enriquecen la vida cultural de la región. Desde impresionantes representaciones teatrales y exposiciones artísticas hasta festivales tradicionales y talleres creativos, te ofrecemos una ventana única al corazón de la cultura puneña.</Typography>
                    <br></br>
                    <Button 
                        variant="contained" 
                        href='/ingresar' 
                        sx={{ 
                            backgroundColor: '#51369A', 
                            color: 'white', 
                            fontFamily: 'Segoe UI', // Cambia la fuente del botón aquí
                            mt: 2
                        }}
                    >
                         VerEventos</Button>
                </Box>
            </Container>
            <footer style={{ 
                backgroundColor: '#4A2C8B', 
                color: 'white', 
                textAlign: 'center', 
                padding: '10px 0', 
                marginTop: 'auto' 
            }}>
                <Typography variant="body1">© 2024 - EventArt</Typography>
            </footer>
        </div>
    );
}

export default Home;
