// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error(error));
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCijf73ETDE-LWRoUcAca2b7G8GUIDI3Kw`;
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -15.8402, lng: -70.0219 }, // Coordenadas de Puno, Perú
                zoom: 12
            });

            events.forEach(event => {
                const marker = new window.google.maps.Marker({
                    position: { lat: parseFloat(event.lat), lng: parseFloat(event.lng) },
                    map: map,
                    title: event.name
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div>
                        <h2>${event.name}</h2>
                        <p>${event.location}</p>
                        <p>${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}</p>
                        <p>${event.organizers}</p>
                        <img src="${event.photos}" alt="${event.name}" />
                    </div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            });
        };
    }, [events]);

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
