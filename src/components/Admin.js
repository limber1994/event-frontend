import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function Admin() {
    const [events, setEvents] = useState([]);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [organizers, setOrganizers] = useState('');
    const [photos, setPhotos] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8000/api/events', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => setEvents(response.data))
        .catch(error => console.error(error));
    }, []);

    const handleCreate = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('http://localhost:8000/api/events', { name, location, start_time, end_time, organizers, photos }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => setEvents([...events, response.data]))
        .catch(error => console.error(error));
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/events/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => setEvents(events.filter(event => event.id !== id)))
        .catch(error => console.error(error));
    };

    const handleEdit = (event) => {
        setEditMode(true);
        setEditId(event.id);
        setName(event.name);
        setLocation(event.location);
        setStartTime(new Date(event.start_time).toISOString().slice(0, 16));
        setEndTime(new Date(event.end_time).toISOString().slice(0, 16));
        setOrganizers(event.organizers);
        setPhotos(event.photos);
        setShowModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        console.log('Submitting edit for ID:', editId);
        console.log({ name, location, start_time, end_time, organizers, photos });

        axios.put(`http://localhost:8000/api/events/${editId}`, { name, location, start_time, end_time, organizers, photos }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            console.log('Edit response:', response.data);
            setEvents(events.map(event => (event.id === editId ? response.data : event)));
            setEditMode(false);
            setEditId(null);
            setName('');
            setLocation('');
            setStartTime('');
            setEndTime('');
            setOrganizers('');
            setPhotos('');
            setShowModal(false);
        })
        .catch(error => console.error('Error updating event:', error));
    };

    return (
        <div className="container">
            <h1>Admin Panel</h1>
            <form onSubmit={editMode ? handleEditSubmit : handleCreate}>
                <div className="mb-3">
                    <label className="form-label">Event Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Start Time</label>
                    <input type="datetime-local" className="form-control" value={start_time} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">End Time</label>
                    <input type="datetime-local" className="form-control" value={end_time} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Organizers</label>
                    <input type="text" className="form-control" value={organizers} onChange={(e) => setOrganizers(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Photos URL</label>
                    <input type="text" className="form-control" value={photos} onChange={(e) => setPhotos(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">{editMode ? 'Update Event' : 'Create Event'}</button>
            </form>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Organizers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.name}</td>
                            <td>{event.location}</td>
                            <td>{new Date(event.start_time).toLocaleString()}</td>
                            <td>{new Date(event.end_time).toLocaleString()}</td>
                            <td>{event.organizers}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                                <button className="btn btn-success" onClick={() => handleEdit(event)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Event Name</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <input type="datetime-local" className="form-control" value={start_time} onChange={(e) => setStartTime(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <input type="datetime-local" className="form-control" value={end_time} onChange={(e) => setEndTime(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Organizers</label>
                            <input type="text" className="form-control" value={organizers} onChange={(e) => setOrganizers(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Photos URL</label>
                            <input type="text" className="form-control" value={photos} onChange={(e) => setPhotos(e.target.value)} />
                        </div>
                        <Button variant="primary" type="submit" onClick={handleEditSubmit}>Update Event</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Admin;
