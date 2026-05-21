// Sample Destinations Data
const destinations = [
    {
        id: 1,
        name: 'Paris, France',
        category: 'city',
        emoji: '🗼',
        description: 'Experience romance and culture in the City of Light',
        price: 1200,
        duration: '5 days',
        rating: 4.8,
        details: 'Explore the Eiffel Tower, Louvre Museum, Notre-Dame, and charming cafés.'
    },
    {
        id: 2,
        name: 'Bali, Indonesia',
        category: 'beach',
        emoji: '🏝️',
        description: 'Tropical paradise with pristine beaches and temples',
        price: 800,
        duration: '7 days',
        rating: 4.7,
        details: 'Visit Ubud rice terraces, Tanah Lot temple, and beautiful beaches.'
    },
    {
        id: 3,
        name: 'Banff, Canada',
        category: 'mountain',
        emoji: '⛰️',
        description: 'Stunning mountain landscapes and outdoor adventures',
        price: 1500,
        duration: '6 days',
        rating: 4.9,
        details: 'Hiking, Lake Louise, glacier exploration, and wildlife viewing.'
    },
    {
        id: 4,
        name: 'Moab, Utah',
        category: 'adventure',
        emoji: '🏜️',
        description: 'Desert adventure with rock climbing and hiking',
        price: 900,
        duration: '4 days',
        rating: 4.6,
        details: 'Moab is a world-class destination for rock climbing and hiking.'
    },
    {
        id: 5,
        name: 'Maldives',
        category: 'beach',
        emoji: '🌴',
        description: 'Luxury island getaway with turquoise waters',
        price: 2000,
        duration: '5 days',
        rating: 4.9,
        details: 'Water bungalows, snorkeling, diving, and pristine beaches.'
    },
    {
        id: 6,
        name: 'Tokyo, Japan',
        category: 'city',
        emoji: '🗾',
        description: 'Modern city blending tradition and innovation',
        price: 1400,
        duration: '5 days',
        rating: 4.8,
        details: 'Visit temples, enjoy cuisine, experience nightlife, and shop.'
    },
    {
        id: 7,
        name: 'New Zealand',
        category: 'adventure',
        emoji: '🧗',
        description: 'Adventure capital with stunning landscapes',
        price: 1800,
        duration: '10 days',
        rating: 4.9,
        details: 'Bungee jumping, hiking, skiing, and breathtaking scenery.'
    },
    {
        id: 8,
        name: 'Barcelona, Spain',
        category: 'city',
        emoji: '🏖️',
        description: 'Beach city with Gaudí architecture and vibrant culture',
        price: 1000,
        duration: '4 days',
        rating: 4.7,
        details: 'Sagrada Familia, Park Güell, beaches, and nightlife.'
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    displayDestinations(destinations);
    loadBookings();
    loadTrips();
});

// Display Destinations
function displayDestinations(destinationsToDisplay) {
    const grid = document.getElementById('destinationsGrid');
    grid.innerHTML = '';

    if (destinationsToDisplay.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No destinations found</p>';
        return;
    }

    destinationsToDisplay.forEach(destination => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <div class="destination-image">${destination.emoji}</div>
            <div class="destination-info">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                <div class="destination-footer">
                    <span class="price">$${destination.price}</span>
                    <span class="rating">⭐ ${destination.rating}</span>
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="viewDestinationDetail(${destination.id})">View Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Destinations
function filterDestinations() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filterCategory = document.getElementById('filterCategory').value;

    const filtered = destinations.filter(destination => {
        const nameMatch = destination.name.toLowerCase().includes(searchInput);
        const categoryMatch = !filterCategory || destination.category === filterCategory;
        return nameMatch && categoryMatch;
    });

    displayDestinations(filtered);
}

// View Destination Detail
function viewDestinationDetail(id) {
    const destination = destinations.find(d => d.id === id);
    if (!destination) return;

    const modal = document.getElementById('destinationModal');
    const detailDiv = document.getElementById('destinationDetail');

    detailDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${destination.emoji}</div>
            <h2>${destination.name}</h2>
            <p style="font-size: 1.1rem; color: #666; margin-bottom: 1rem;">${destination.description}</p>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left;">
                <h4>Trip Details:</h4>
                <p><strong>Overview:</strong> ${destination.details}</p>
                <p><strong>Duration:</strong> ${destination.duration}</p>
                <p><strong>Price per person:</strong> $${destination.price}</p>
                <p><strong>Rating:</strong> ⭐ ${destination.rating}/5.0</p>
            </div>

            <div style="display: flex; gap: 1rem;">
                <button class="btn-primary" style="flex: 1;" onclick="bookDestination(${destination.id})">Book Now</button>
                <button class="btn-secondary" style="flex: 1;" onclick="addToTrip(${destination.id})">Add to Trip</button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Close Destination Modal
function closeDestinationModal() {
    document.getElementById('destinationModal').style.display = 'none';
}

// Book Destination
function bookDestination(destinationId) {
    const destination = destinations.find(d => d.id === destinationId);
    if (!destination) return;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = {
        id: Date.now(),
        destinationId: destinationId,
        name: destination.name,
        price: destination.price,
        date: new Date().toLocaleDateString(),
        status: 'confirmed',
        checkInDate: new Date().toISOString().split('T')[0],
        nights: 5
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert(`✅ Successfully booked ${destination.name}!\nBooking Reference: #${booking.id}`);
    closeDestinationModal();
    loadBookings();
}

// Load Bookings
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsList = document.getElementById('bookingsList');

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>No bookings yet. <a href="#destinations">Book your first trip!</a></p>';
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <h4>${booking.name}</h4>
            <p><strong>Booking Reference:</strong> #${booking.id}</p>
            <p><strong>Check-in Date:</strong> ${booking.checkInDate}</p>
            <p><strong>Duration:</strong> ${booking.nights} nights</p>
            <p><strong>Total Price:</strong> $${booking.price * booking.nights}</p>
            <span class="booking-status ${booking.status}">${booking.status.toUpperCase()}</span>
            <button class="btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="cancelBooking(${booking.id})">Cancel Booking</button>
        </div>
    `).join('');
}

// Cancel Booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadBookings();
        alert('Booking cancelled successfully.');
    }
}

// Create Trip
function createTrip(event) {
    event.preventDefault();

    const trip = {
        id: Date.now(),
        name: document.getElementById('tripName').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        budget: parseFloat(document.getElementById('budget').value),
        notes: document.getElementById('notes').value,
        destinations: [],
        spent: 0
    };

    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));

    // Reset form
    event.target.reset();
    alert(`✅ Trip "${trip.name}" created successfully!`);
    loadTrips();
}

// Add to Trip
function addToTrip(destinationId) {
    let trips = JSON.parse(localStorage.getItem('trips')) || [];

    if (trips.length === 0) {
        alert('Please create a trip first!');
        return;
    }

    const destination = destinations.find(d => d.id === destinationId);
    const tripId = trips[trips.length - 1].id;

    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex !== -1) {
        if (!trips[tripIndex].destinations.find(d => d.id === destinationId)) {
            trips[tripIndex].destinations.push({
                id: destinationId,
                name: destination.name,
                price: destination.price
            });
            trips[tripIndex].spent += destination.price;
            localStorage.setItem('trips', JSON.stringify(trips));
            alert(`✅ ${destination.name} added to your trip!`);
            closeDestinationModal();
            loadTrips();
        } else {
            alert('This destination is already in your trip!');
        }
    }
}

// Load Trips
function loadTrips() {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const tripsList = document.getElementById('tripsList');

    if (trips.length === 0) {
        tripsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No trips created yet. Create one to get started!</p>';
        return;
    }

    tripsList.innerHTML = trips.map(trip => {
        const daysUntilStart = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));
        const budgetRemaining = trip.budget - trip.spent;
        
        return `
            <div class="trip-card">
                <h4>📍 ${trip.name}</h4>
                <p><strong>Dates:</strong> ${trip.startDate} to ${trip.endDate}</p>
                <p><strong>Days Until Trip:</strong> ${daysUntilStart > 0 ? daysUntilStart : 'Happening Now!'}</p>
                <p><strong>Budget:</strong> $${trip.budget}</p>
                <p class="budget">Spent: $${trip.spent} | Remaining: $${budgetRemaining}</p>
                <p><strong>Destinations:</strong> ${trip.destinations.length}</p>
                ${trip.notes ? `<p><strong>Notes:</strong> ${trip.notes}</p>` : ''}
                <div class="trip-actions">
                    <button class="btn-edit" onclick="editTrip(${trip.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteTrip(${trip.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Edit Trip
function editTrip(tripId) {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const trip = trips.find(t => t.id === tripId);

    if (trip) {
        document.getElementById('tripName').value = trip.name;
        document.getElementById('startDate').value = trip.startDate;
        document.getElementById('endDate').value = trip.endDate;
        document.getElementById('budget').value = trip.budget;
        document.getElementById('notes').value = trip.notes;

        deleteTrip(tripId);
        document.querySelector('.planning-form form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete Trip
function deleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this trip?')) {
        let trips = JSON.parse(localStorage.getItem('trips')) || [];
        trips = trips.filter(t => t.id !== tripId);
        localStorage.setItem('trips', JSON.stringify(trips));
        loadTrips();
        alert('Trip deleted successfully.');
    }
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    localStorage.setItem('userEmail', email);
    alert(`Welcome! Logged in as ${email}`);
    closeLoginModal();
}

function openSignupModal() {
    closeLoginModal();
    alert('Sign up feature coming soon!');
}

// Scroll to Destinations
function scrollToDestinations() {
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const destinationModal = document.getElementById('destinationModal');

    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === destinationModal) {
        destinationModal.style.display = 'none';
    }
}
