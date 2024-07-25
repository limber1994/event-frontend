import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Container, Box, Button, Grid
} from '@mui/material';
import logotipo from './imagenes/log.png'

const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCijf73ETDE-LWRoUcAca2b7G8GUIDI3Kw`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
    });
};

function Ingresar() {
    const [events, setEvents] = useState([]);
    const [map, setMap] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/events')
            .then(response => {
                console.log('Eventos cargados:', response.data);
                setEvents(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        loadGoogleMapsScript()
            .then(() => {
                if (!map) {
                    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
                        center: { lat: -15.8402, lng: -70.0219 }, // Coordenadas de Puno, Perú
                        zoom: 12
                    });
                    setMap(mapInstance);
                }

                console.log('Eventos para crear marcadores:', events);

                events.forEach(event => {
                    const [lat, lng] = event.location.split(',').map(coord => parseFloat(coord.trim()));
                    const marker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        title: event.name,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    });

                    const infoWindowContent = `<div>
                        <h2>${event.name}</h2>
                        <p>${event.location}</p>
                        <p>${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}</p>
                        <p>${event.organizers}</p>
                        <img src="${event.photos}" alt="${event.name}" style="max-width:100px;" />
                    </div>`;
                    
                    console.log('InfoWindow content:', infoWindowContent);

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: infoWindowContent
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                        setSelectedEvent(event); // Establecer el evento seleccionado
                    });
                });
            })
            .catch(error => console.error('Error loading Google Maps script:', error));
    }, [events, map]);

    return (
        <div style={{ color: 'black' }}>
            <AppBar position="static" style={{ background: '#24414F' }}>
                <Toolbar>
                    <img src={logotipo} alt="logo" style={{ marginRight: '10px', width: '50px', height: 'auto'}} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Eventos Culturales
                    </Typography>
                    <Button color="inherit" href="/login">Iniciar Sesión</Button>
                    <Button color="inherit" href="/register">Registrarse</Button>
                    <Button color="inherit" href="/"
                        sx={{ 
                            color: '#6FA8DC', // Cambia el color del texto aquí
                            '&:hover': {
                                color: '#3D85C6' // Cambia el color del texto cuando se pasa el ratón
                            }
                        }}
                    >Salir</Button>
                </Toolbar>
            </AppBar>
            <Container style={{ textAlign: 'center', marginTop: '20px', flex: '1'}} >
                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography component="h1" variant="h6" sx={{ color: '#263481', fontWeight: 'bold', textAlign: 'left' }}>Seleccione algun evento del mapa que quiera ver</Typography>
                        <Box sx={{ height: '600px', width: '100%' }} id="map"></Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" sx={{ color: '#08124A', fontWeight: 'bold', mb: 2 }} gutterBottom>Eventos Actuales y Próximos</Typography>
                        {selectedEvent ? (
                            <Box sx={{ bgcolor: 'rgba(120,184,211)', borderRadius: '8px', p: 3 }}>
                                <Typography variant="h5" sx={{ color: '#0F0F0F', fontWeight: 'bold', mb: 2 }} gutterBottom>{selectedEvent.name}</Typography>
                                <Typography variant="body1">Fecha y hora del evento:</Typography>
                                <Typography variant="body1" sx={{ color: '#28346F', mb: 2 }}>
                                    {new Date(selectedEvent.start_time).toLocaleString()} - {new Date(selectedEvent.end_time).toLocaleString()}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={8}>
                                        <img src={selectedEvent.photos} alt={selectedEvent.name} style={{ width: '100%', borderRadius: '8px' }} />
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={12}>
                                                <img src={selectedEvent.photos} alt={selectedEvent.name} style={{ width: '100%', borderRadius: '8px' }} />
                                            </Grid>
                                            <Grid item xs={6} md={12}>
                                                <img src={selectedEvent.photos} alt={selectedEvent.name} style={{ width: '100%', borderRadius: '8px' }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                
                                <Typography variant="body1" sx={{ color: '#28346F', mt:2 }}>{selectedEvent.organizers}</Typography>
                                
                            </Box>
                        ) : (
                            <Box sx={{ bgcolor: 'rgba(120,184,211)', borderRadius: '8px', p: 3 }}>
                                <Typography variant="h5" sx={{ color: '#0F0F0F', fontWeight: 'bold', mb: 2 }} gutterBottom>Curso de Pintura</Typography>
                                <Typography variant="body1">Fecha y hora del evento:</Typography>
                                <Typography variant="body1" sx={{ color: '#28346F', mb: 2 }}>
                                    24/7/2024, 03:00:00 p. m. - 24/7/2024, 04:00:00 p. m.
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <img src="https://img.freepik.com/vector-premium/acuarela-paisaje-arboles-naturaleza-abstracta-fondo-dibujado-mano_473673-268.jpg" alt="Imagen principal" style={{ width: '100%', borderRadius: '8px' }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={10.9}>
                                                <img src="https://www.sanguesa.es/wp-content/uploads/2020/06/expo-pintura-eventos.jpg" alt="Imagen secundaria 1" style={{ width: '100%', borderRadius: '8px' }} />
                                            </Grid>
                                            <Grid item xs={6} md={10.9}>
                                                <img src="https://img.freepik.com/fotos-premium/mesa-trabajo-pintor-decorador-esta-adornada-proyecto-casa-varias-muestras-colores_410516-84775.jpg" alt="Imagen secundaria 2" style={{ width: '100%', borderRadius: '8px' }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Typography variant="body1" sx={{ color: '#28346F', mt:2 }}>
                                    Un curso de pintura ofrece la oportunidad de desarrollar habilidades técnicas y fomentar la creatividad, abarcando desde el manejo de herramientas y materiales (como pinceles y diferentes tipos de pintura) hasta la teoría del color, composición, y perspectiva.
                                </Typography>
                            </Box>
                        )}
                        
                    </Grid>
                </Grid>
            </Container>
            <br></br>
            <footer style={{ backgroundColor: '#24414F', color: 'white', textAlign: 'center', padding: '10px 0' }}>
                <Typography variant="body1">© 2024 - EventArt</Typography>
            </footer>
        </div>
    );
}

export default Ingresar;
