const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

let rooms = [];
let bookings = [];
let bookingIdCounter = 1;

// Create a room
app.post('/rooms', (req, res) => {
    const { roomName, numberOfSeats, amenities, pricePerHour } = req.body;
    const room = {
        id: rooms.length + 1,
        roomName,
        numberOfSeats,
        amenities,
        pricePerHour
    };
    rooms.push(room);
    res.status(201).json(room);
});

// Book a room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const booking = {
        bookingId: bookingIdCounter++,
        customerName,
        date,
        startTime,
        endTime,
        roomId,
        bookingDate: new Date(),
        bookingStatus: 'Booked'
    };
    bookings.push(booking);
    res.status(201).json(booking);
});

// List all rooms with booked data
app.get('/rooms', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const roomBookings = bookings.filter(booking => booking.roomId === room.id);
        return {
            ...room,
            bookings: roomBookings
        };
    });
    res.json(roomsWithBookings);
});

// List all customers with booked data
app.get('/customers', (req, res) => {
    const customers = bookings.map(booking => ({
        customerName: booking.customerName,
        roomName: rooms.find(room => room.id === booking.roomId).roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
    }));
    res.json(customers);
});

// List how many times a customer has booked a room
app.get('/customer-bookings/:customerName', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    
    const customerBookingDetails = customerBookings.map(booking => ({
        roomName: rooms.find(room => room.id === booking.roomId).roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.bookingId,
        bookingDate: booking.bookingDate,
        bookingStatus: booking.bookingStatus
    }));

    res.json({
        customerName,
        numberOfBookings: customerBookings.length,
        bookings: customerBookingDetails
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
