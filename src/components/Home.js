import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

function Home() {
    const [events, setEvents] = useState([]);
    const [map, setMap] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/events')
            .then(response => setEvents(response.data))
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

                events.forEach(event => {
                    const [lat, lng] = event.location.split(',').map(coord => parseFloat(coord.trim()));
                    const marker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        title: event.name,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    });

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<div>
                            <h2>${event.name}</h2>
                            <p>${event.location}</p>
                            <p>${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}</p>
                            <p>${event.organizers}</p>
                            <img src="${event.photos}" alt="${event.name}" style="max-width:100px;" />
                        </div>`
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });
            })
            .catch(error => console.error('Error loading Google Maps script:', error));
    }, [events, map]);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Eventos Culturales</a>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <h1>Eventos Actuales y Próximos</h1>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
}

export default Home;

