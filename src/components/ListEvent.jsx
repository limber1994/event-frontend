import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton,
    Modal,
    Container,
    TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import logotipo from './imagenes/log.png';

function ListEvent() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8000/api/events', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setEvents(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/events/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                setEvents(events.filter(event => event.id !== id));
                if (fullscreen) {
                    setFullscreen(false);
                }
            })
            .catch(error => console.error('Error deleting event:', error));
    };

    const handleEdit = (event) => {
        setModalContent(event);
        setModalOpen(true);
        setSelectedEventId(event.id);
    };

    const handleSaveEdit = () => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:8000/api/events/${selectedEventId}`, modalContent, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setEvents(events.map(event => event.id === selectedEventId ? response.data : event));
                setModalOpen(false);
            })
            .catch(error => console.error('Error updating event:', error));
    };

    const handlePDFExport = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Name', 'Location', 'Start Time', 'End Time', 'Organizers']],
            body: events.map(event => [
                event.name,
                event.location,
                event.start_time,
                event.end_time,
                event.organizers
            ])
        });
        doc.save('events.pdf');
    };

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.organizers.toLowerCase().includes(search.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const csvHeaders = [
        { label: 'Name', key: 'name' },
        { label: 'Location', key: 'location' },
        { label: 'Start Time', key: 'start_time' },
        { label: 'End Time', key: 'end_time' },
        { label: 'Organizers', key: 'organizers' }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#b289cb' }}>
            <header style={{ padding: '10px', backgroundColor: '#4A2C8B', color: '#fff', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logotipo} alt="logo" style={{ marginRight: '10px', width: '50px', height: 'auto' }} />
                        <Typography variant="h6">Eventos Culturales</Typography>
                    </div>
                    <nav>
                        <Button onClick={() => navigate('/ingresar')} sx={{ color: '#fff', marginRight: '10px' }}>Ver Eventos</Button>
                        <Button onClick={() => navigate('/admin')} sx={{ color: '#fff', marginRight: '10px' }}>Crear Evento</Button>
                        <Button onClick={() => localStorage.removeItem('token') && navigate('/login')} sx={{ color: '#fff' }}>Salir</Button>
                    </nav>
                </div>
            </header>

            <Box sx={{ backgroundColor: '#fff', borderRadius: 1, p: 3, flex: 1 }}>
                <Typography variant="h4" gutterBottom>Lista de eventos</Typography>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                        <Button variant="contained" color="primary" onClick={handlePDFExport} sx={{ mr: 1 }}>
                            <AddIcon /> Export to PDF
                        </Button>
                        <Button variant="contained" color="primary">
                            <CSVLink data={filteredEvents} headers={csvHeaders} filename="events.csv" style={{ color: 'white', textDecoration: 'none' }}>
                                <AddIcon /> Export to CSV
                            </CSVLink>
                        </Button>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={() => setShowSearch(!showSearch)} sx={{ mr: 1 }}>
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick={() => setFullscreen(!fullscreen)}>
                            {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Box>
                </Box>
                {showSearch && (
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
                <Box sx={{ position: 'relative', width: '100%', height: fullscreen ? 'calc(100vh - 200px)' : 'auto' }}>
                    <TableContainer
                        component={Paper}
                        sx={{ overflow: fullscreen ? 'auto' : 'hidden', height: '100%' }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Organizers</TableCell>
                                    <TableCell>Photos</TableCell> {/* New column for photos */}
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(event => (
                                    <TableRow key={event.id}>
                                        <TableCell>{event.name}</TableCell>
                                        <TableCell>{event.location}</TableCell>
                                        <TableCell>{event.start_time}</TableCell>
                                        <TableCell>{event.end_time}</TableCell>
                                        <TableCell>{event.organizers}</TableCell>
                                        <TableCell>
                                            <img
                                                src={event.photos}
                                                alt={event.name}
                                                style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleEdit(event)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleDelete(event.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredEvents.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Box>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="edit-event-modal"
                aria-describedby="edit-event-description"
            >
                <Container sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, maxWidth: 'sm' }}>
                    <Typography variant="h6" id="edit-event-modal">Edit Event</Typography>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={modalContent.name || ''}
                        onChange={(e) => setModalContent({ ...modalContent, name: e.target.value })}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        margin="normal"
                        value={modalContent.location || ''}
                        onChange={(e) => setModalContent({ ...modalContent, location: e.target.value })}
                    />
                    <TextField
                        label="Start Time"
                        fullWidth
                        margin="normal"
                        value={modalContent.start_time || ''}
                        onChange={(e) => setModalContent({ ...modalContent, start_time: e.target.value })}
                    />
                    <TextField
                        label="End Time"
                        fullWidth
                        margin="normal"
                        value={modalContent.end_time || ''}
                        onChange={(e) => setModalContent({ ...modalContent, end_time: e.target.value })}
                    />
                    <TextField
                        label="Organizers"
                        fullWidth
                        margin="normal"
                        value={modalContent.organizers || ''}
                        onChange={(e) => setModalContent({ ...modalContent, organizers: e.target.value })}
                    />
                    <TextField
                        label="Photos URL"
                        fullWidth
                        margin="normal"
                        value={modalContent.photos || ''}
                        onChange={(e) => setModalContent({ ...modalContent, photos: e.target.value })}
                    />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
                    </Box>
                </Container>
            </Modal>
        </Box>
    );
}

export default ListEvent;
