import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function EventRegistration() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [organizers, setOrganizers] = useState('');
    const [photos, setPhotos] = useState('');
    const navigate = useNavigate();
    let map;
    let marker;

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

    const initializeMap = () => {
        map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: -16.4047, lng: -71.5375 }, // Puno, Peru
            zoom: 13,
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
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en el local storage

        axios.post('http://localhost:8000/api/events', {
            name, // Asegúrate de enviar el nombre del evento
            location: `${location.lat}, ${location.lng}`,
            start_time: startTime,
            end_time: endTime,
            organizers,
            photos,
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Agrega el token a los encabezados
            }
        }).then(response => {
            alert('Event created successfully');
            navigate('/'); // Redirige a la página de inicio u otra página después de la creación exitosa
        }).catch(error => {
            console.error(error);
            alert('Failed to create event');
        });
    };

    return (
        <div className="container">
            <h1>Register New Event</h1>
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Event Name</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input type="text" className="form-control" value={location.lat ? `${location.lat}, ${location.lng}` : ''} readOnly />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <input type="date" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <input type="date" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Organizers</label>
                            <input type="text" className="form-control" value={organizers} onChange={(e) => setOrganizers(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Photos</label>
                            <input type="text" className="form-control" value={photos} onChange={(e) => setPhotos(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Register Event</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <h3>Select Event Location on Map</h3>
                    <div id="map" style={{ height: '500px', width: '100%' }}></div>
                </div>
            </div>
        </div>
    );
}

export default EventRegistration;
