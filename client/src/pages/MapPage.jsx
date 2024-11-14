import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, ExclamationCircleIcon, CheckCircleIcon, PhotoIcon, GlobeEuropeAfricaIcon, PencilSquareIcon, TagIcon } from '@heroicons/react/24/solid';

// Map categories to colors
const categoryColors = {
    "pothole": "red",
    "power outage": "orange",
    "waste management": "green",
    "broken streetlight": "blue",
    "road damage": "purple",
    "flooding": "cyan",
    "traffic signal malfunction": "magenta",
    "water supply": "navy",
    "noise complaint": "maroon"
};

const createHeroIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker-icon',
        html: `
            <div style="color: ${color}; font-size: 24px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24" width="40" height="40">
                    <path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 7 13 7 13s7-9.134 7-13c0-3.866-3.134-7-7-7zM12 11a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
            </div>
        `,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [8, -36]
    });
};

const MapPage = () => {
    const defaultCenter = [4.8472226, 8.3405024];
    const [issues, setIssues] = useState([]);
    const [isMapVisible, setIsMapVisible] = useState(true); // State to control map visibility

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get("/api/v1/issues");
                setIssues(response?.data?.data);
            } catch (error) {
                console.error("Failed to fetch issues", error);
            }
        };

        fetchIssues();
    }, []);

    const toggleVisibility = () => {
        setIsMapVisible((prev) => !prev); // Toggle between map and details
    };

    function toSentenceCase(str) {
        return str
            .toLowerCase()
            .split('. ')
            .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
            .join('. ');
    }
    

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Map Section (Visible on larger screens or when toggled on mobile) */}
            <div className={`flex-1 ${isMapVisible ? '' : 'hidden'} lg:block relative`} style={{ zIndex: 1 }}>
                <MapContainer center={defaultCenter} zoom={10} scrollWheelZoom={false} style={{ height: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {issues.map((issue) => (
                        <Marker
                            key={issue._id}
                            position={[issue.latitude, issue.longitude]}
                            icon={createHeroIcon(categoryColors[issue.category] || 'black')}>

                            <Popup maxWidth={300} minWidth={300}>
                                <div className="text-sm font-sans w-full">
                                    {/* Category */}
                                    <div className="flex items-center mb-2">
                                        <TagIcon className="w-5 h-5 text-yellow-600 mr-2"/>
                                        <strong className="text-gray-800">Category: </strong>
                                        <span className={`font-semibold pl-2 text-${categoryColors[issue.category] || 'gray'}-600`}>
                                            {toSentenceCase(issue.category)}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="flex items-center mb-2">
                                        <PencilSquareIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0"/>
                                        <strong className="text-gray-800">Description: </strong>
                                        <span className="text-gray-700 pl-2">{toSentenceCase(issue.description)}</span>
                                    </div>

                                    {/* State */}
                                    <div className="flex items-center mb-2">
                                        {/* <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 mr-2" /> */}
                                        <GlobeEuropeAfricaIcon className="w-5 h-5 text-yellow-600 mr-2"/>
                                        <strong className="text-gray-800">State:</strong>
                                        <span className={`pl-2 capitalize text-${issue.state === 'open' ? 'red' : issue.state === 'in progress' ? 'yellow' : 'green'}-600`}>
                                            {issue.state.charAt(0).toUpperCase() + issue.state.slice(1)}
                                        </span>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-center mb-2">
                                        <MapPinIcon className="w-5 h-5 text-gray-600 mr-2" />
                                        <strong className="text-gray-800">Street Address:</strong>
                                        <span className="text-gray-700 pl-2">{toSentenceCase(issue.street_address)}</span>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center mb-2">
                                        {issue.status === 'resolved' ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                                        ) : (
                                            <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                                        )}
                                        <strong className="text-gray-800 font-semibold">Status:</strong>
                                        <span className={`pl-2 capitalize text-${issue.status === 'open' ? 'red' : issue.status === 'resolved' ? 'green' : 'yellow'}-600`}>
                                            {issue.status}
                                        </span>
                                    </div>

                                    {/* Images */}
                                    {issue.photo_upload && issue.photo_upload.length > 0 && (
                                        <div className="mt-4">
                                            <strong className="text-gray-800 font-semibold flex items-center mb-2">
                                                Images:
                                            </strong>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {issue.photo_upload.map((image, index) => (
                                                    <div key={index} className="w-full">
                                                        <img
                                                            src={image.image_secure_url}
                                                            alt={`Issue image ${index + 1}`}
                                                            className="w-full h-auto object-cover rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                                                            loading="lazy"
                                                            onClick={() => window.open(image.image_secure_url, "_blank")}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Popup>



                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Info Section */}
            <div className={`bg-gray-100 p-8 w-full lg:w-1/3 ${isMapVisible ? 'hidden' : ''} lg:block`}>
                <div className="mb-4 text-2xl font-bold text-center lg:text-left">Community Issue Tracker</div>
                <div className="mb-8 text-lg text-gray-700">
                    <p>
                        This platform allows the community to report various issues such as potholes, road damage, power outages, and more.
                        By contributing, you help us maintain and improve the area!
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="text-xl font-semibold">Categories</div>
                    {Object.entries(categoryColors).map(([category, color]) => (
                        <div key={category} className="flex items-center space-x-2">
                            <div style={{ width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%' }}></div>
                            <span className='capitalize'>{category}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center lg:text-left">
                    <a href="/add-issue" className="inline-block py-2 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-200">
                        Add an Issue
                    </a>
                </div>
            </div>

            {/* Toggle Button for Smaller Devices */}
            <div
                className={`lg:hidden fixed bottom-8 right-2 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50 transition-all duration-300 ${isMapVisible ? 'opacity-100' : 'opacity-50'}`}
                onClick={toggleVisibility}
                style={{
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    transform: isMapVisible ? 'scale(0.9)' : 'scale(0.8)',
                }}
            >
                {isMapVisible ? 'Show Details' : 'Show Map'}
            </div>
        </div>
    );
};

export default MapPage;



