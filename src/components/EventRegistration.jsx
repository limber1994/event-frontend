import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
    Container, TextField, Button, Typography, Grid, Paper, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AppBar, Toolbar, IconButton, CssBaseline
} from '@mui/material';
import { Home, Add, ExitToApp } from '@mui/icons-material'; // Importación de iconos

function EventRegistration() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState({});
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [organizers, setOrganizers] = useState('');
    const [photos, setPhotos] = useState('');  // Estado para las fotos
    const [open, setOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const navigate = useNavigate();
    let map;
    let marker;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCijf73ETDE-LWRoUcAca2b7G8GUIDI3Kw";
        script.async = true;
        script.onload = () => {
            initializeMap();
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initializeMap = () => {
        map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: -15.8402, lng: -70.0219 }, // Puno, Peru
            zoom: 12,
        });

        map.addListener('click', (event) => {
            if (marker) {
                marker.setMap(null);
            }
            marker = new window.google.maps.Marker({
                position: event.latLng,
                map: map,
                draggable: true,
            });

            setLocation({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            });
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', `${location.lat}, ${location.lng}`);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('organizers', organizers);
        formData.append('photos', photos);  // Añadir las fotos al FormData

        axios.post('http://localhost:8000/api/events', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setModalTitle('Exitoso');
            setModalMessage('Evento creado exitosamente');
            setOpen(true);
        }).catch(error => {
            setModalTitle('Error');
            setModalMessage('No se pudo crear el evento');
            setOpen(true);
        });
    };

    const handleClose = () => {
        setOpen(false);
        if (modalTitle === 'Exitoso') {
            window.location.reload(); // Recarga la página actual
        }
    };

    const handleExit = () => {
        navigate('/'); // Redirige a la página de inicio o a otra página que definas
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #5e35b1 0%, #5e35b1 100%)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <CssBaseline />
            <AppBar position="static" sx={{ backgroundColor: '#4A2C8B' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Registro de Eventos
                    </Typography>
                    <IconButton color="inherit" onClick={handleExit}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container
                component={Paper}
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#000',
                    marginTop: 4,
                    marginBottom: 4,
                    flexGrow: 1
                }}
            >
                <Typography component="h1" variant="h4" sx={{ color: '#6c4fac', fontWeight: 'bold', mb: 2 }} gutterBottom>Registrar nuevo evento</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Nombre del evento"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Ubicación"
                                value={location.lat ? `${location.lat}, ${location.lng}` : ''}
                                readOnly
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Inicio"
                                type="date"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Finalización"
                                type="date"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Organizadores"
                                value={organizers}
                                onChange={(e) => setOrganizers(e.target.value)}
                                required
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Photos URL"
                                value={photos}
                                onChange={(e) => setPhotos(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#a2cf6e', borderColor: '#a2cf6e' }, mr: 2 }}
                                startIcon={<Add />} // Icono añadido
                            >
                                Registrar Evento
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ mt: 2, backgroundColor: '#009688', color: '#fff', '&:hover': { backgroundColor: '#5bbbb2', borderColor: '#5bbbb2' } }}
                                onClick={handleExit}
                                startIcon={<ExitToApp />} // Icono añadido
                            >
                                Salir
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography component="h1" variant="h6" sx={{ color: '#6c4fac', fontWeight: 'bold', mb: 2 }}>Seleccione la ubicación del evento en el mapa</Typography>
                        <Paper style={{ height: '500px', width: '100%' }} id="map"></Paper>
                    </Grid>
                </Grid>
            </Container>
            <AppBar position="static" sx={{ backgroundColor: '#4A2C8B', top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <Typography variant="body1" color="inherit" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        © 2024 Event Registration. Todos los derechos reservados.
                    </Typography>
                </Toolbar>
            </AppBar>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {modalMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EventRegistration;
