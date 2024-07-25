import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logotipo from './imagenes/log.png';

function Admin() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState({});
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [organizers, setOrganizers] = useState('');
    const [photos, setPhotos] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    let map;
    let marker;

    const initializeMap = () => {
        map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: -15.8402, lng: -70.0219 },
            zoom: 12
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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCijf73ETDE-LWRoUcAca2b7G8GUIDI3Kw`;
        script.async = true;
        script.onload = () => {
            initializeMap();
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCreate = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', `${location.lat}, ${location.lng}`);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('organizers', organizers);
        formData.append('photos', photos);

        axios.post('http://localhost:8000/api/events', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setName('');
                setLocation({});
                setStartTime('');
                setEndTime('');
                setOrganizers('');
                setPhotos('');
            })
            .catch(error => console.error(error));
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', `${location.lat}, ${location.lng}`);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('organizers', organizers);
        formData.append('photos', photos);

        axios.put(`http://localhost:8000/api/events/${editId}`, formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setEditMode(false);
                setEditId(null);
                setName('');
                setLocation({});
                setStartTime('');
                setEndTime('');
                setOrganizers('');
                setPhotos('');
            })
            .catch(error => console.error('Error updating event:', error));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#eeebf3' }}>
            <header style={{ padding: '10px', backgroundColor: '#4A2C8B', color: '#fff', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logotipo} alt="logo" style={{ marginRight: '10px', width: '50px', height: 'auto' }} />
                        <Typography variant="h6">Eventos Culturales</Typography>
                    </div>
                    <nav>
                        <Button onClick={() => navigate('/ingresar')} sx={{ color: '#fff', marginRight: '10px' }}>Ver Eventos</Button>
                        <Button onClick={() => navigate('/lista-eventos')} sx={{ color: '#fff', marginRight: '10px' }}>Lista de eventos</Button>
                        <Button onClick={() => localStorage.removeItem('token') && navigate('/login')} sx={{ color: '#fff' }}>Salir</Button>
                    </nav>
                </div>
            </header>

            <Container sx={{ backgroundColor: '#fff', borderRadius: 1, p: 3, flex: 1 }}>
                <Typography  variant="h4" sx={{ color: '#60678b', fontWeight: 'bold', mb: 2 }} gutterBottom>{editMode ? 'Edit Event' : 'Crear evento'}</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <form onSubmit={editMode ? handleEditSubmit : handleCreate}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Nombre del Evento"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Ubicación"
                                    value={location.lat ? `${location.lat}, ${location.lng}` : ''}
                                    readOnly
                                />
                                <div id="map" style={{ height: '300px', marginBottom: '20px' }}></div>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Inicio"
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Finalización"
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Organizadores"
                                    value={organizers}
                                    onChange={(e) => setOrganizers(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="URL de la Imagen"
                                    value={photos}
                                    onChange={(e) => setPhotos(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    {editMode ? 'Update Event' : 'Crear Evento'}
                                </Button>
                                {editMode && (
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setEditMode(false);
                                            setName('');
                                            setLocation({});
                                            setStartTime('');
                                            setEndTime('');
                                            setOrganizers('');
                                            setPhotos('');
                                        }}
                                        sx={{ mt: 2, ml: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <footer style={{ padding: '10px', backgroundColor: '#4A2C8B', color: '#fff', textAlign: 'center', flexShrink: 0 }}>
                <Typography variant="body2">© 2024 Eventos Culturales</Typography>
            </footer>
        </Box>
    );
}

export default Admin;
