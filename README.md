# TravelHub - Travel Booking & Planning Platform

A modern, responsive web application for booking flights, hotels, and planning travel itineraries all in one place.

## Features

### 🎯 Core Features
- **Destination Discovery**: Browse popular travel destinations with detailed information
- **Search & Filter**: Find destinations by name or category (Beach, Mountain, City, Adventure)
- **Booking System**: Book destinations and receive confirmation
- **Trip Planning**: Create customized trips with budgets and itineraries
- **Booking Management**: View, edit, and cancel bookings
- **User Authentication**: Login functionality for personalized experience

### 📱 Features in Detail

#### Destinations
- 8 pre-loaded popular destinations
- Detailed destination information with ratings
- Price per person information
- Category-based filtering
- Real-time search functionality

#### Bookings
- One-click booking for any destination
- Confirmation with booking reference
- View all your bookings
- Cancel bookings anytime
- Track booking status (Confirmed/Pending)

#### Trip Planning
- Create custom trips with specific dates
- Set and track budget allocation
- Add destinations to your trip
- Monitor spending vs. budget
- Add notes for each trip
- Edit and delete trips

#### User Features
- User login/registration
- Persistent data storage (LocalStorage)
- Responsive design for all devices
- Smooth animations and transitions

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage
- **Styling**: Custom CSS with modern design patterns
- **Responsive**: Mobile-first responsive design

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Usage

1. **Open the Website**: Open `index.html` in your web browser

2. **Browse Destinations**: 
   - Explore popular destinations on the home page
   - Use search and filters to find specific types of trips
   - Click "View Details" to see more information

3. **Book a Destination**:
   - Click "View Details" on any destination
   - Click "Book Now" to make a reservation
   - Confirm your booking

4. **Plan Your Trip**:
   - Scroll to "Plan Trip" section
   - Fill in trip details (name, dates, budget)
   - Create your trip
   - Add destinations to your trip
   - Track your budget and spending

5. **View Your Bookings**:
   - Navigate to "My Bookings" section
   - See all your confirmed bookings
   - Cancel bookings if needed

## File Structure

```
TravelHub/
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## Features Explained

### Destinations Section
Browse through 8 curated destinations including:
- Paris (City)
- Bali (Beach)
- Banff (Mountain)
- Moab (Adventure)
- Maldives (Beach)
- Tokyo (City)
- New Zealand (Adventure)
- Barcelona (City)

### Booking System
- **Click "Book Now"** to instantly book a destination
- **Get booking reference** for your records
- **View bookings** in the My Bookings section
- **Track status** of your bookings (Confirmed/Pending)
- **Cancel anytime** with one click

### Trip Planning
- **Create trips** with custom names and dates
- **Set budgets** for each trip
- **Add destinations** from the destination list
- **Track spending** to stay within budget
- **Add notes** for trip reminders
- **Edit trips** by clicking Edit button
- **Delete trips** when no longer needed

## Local Storage

The application uses browser LocalStorage to persist data:
- **Bookings**: Stored in `bookings` key
- **Trips**: Stored in `trips` key
- **User Email**: Stored in `userEmail` key

Data persists between browser sessions automatically.

## Responsive Design

- **Desktop**: Full multi-column layouts
- **Tablet**: Optimized grid layouts
- **Mobile**: Single column, touch-friendly interface

## Color Scheme

- **Primary**: #ff6b6b (Coral Red)
- **Secondary**: #4ecdc4 (Turquoise)
- **Dark**: #2c3e50 (Dark Blue)
- **Light**: #ecf0f1 (Off White)

## Future Enhancements

Potential features to add:
- [ ] Backend API integration
- [ ] Payment gateway integration
- [ ] User authentication system
- [ ] Real flight/hotel data
- [ ] Social sharing
- [ ] Review and rating system
- [ ] Weather information
- [ ] Currency conversion
- [ ] PDF itinerary export
- [ ] Email notifications

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available for personal and educational use.

## Contributing

Feel free to fork, modify, and improve this project!

---

**Made with ❤️ for travel enthusiasts**
