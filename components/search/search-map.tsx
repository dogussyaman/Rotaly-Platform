'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ListingCard } from '../listings/listing-card';
import MarkerClusterGroup from 'react-leaflet-cluster';

// Custom CSS to fix Leaflet path issues and style custom markers
const mapStyles = `
  .leaflet-container {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    z-index: 1;
  }
  .custom-marker-pill {
    background: white;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 999px;
    padding: 6px 12px;
    font-weight: 800;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    white-space: nowrap;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  .custom-marker-pill:hover {
    transform: translateY(-2px) scale(1.05);
    background: #000;
    color: #fff;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1000 !important;
  }
  .marker-cluster {
    background: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(4px);
    border-radius: 50%;
  }
  .marker-cluster div {
    background: #000 !important;
    color: #fff !important;
    border-radius: 50%;
    font-weight: 800;
    font-size: 12px;
  }
  .leaflet-popup-content-wrapper {
    padding: 0;
    overflow: hidden;
    border-radius: 1.5rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  .leaflet-popup-content {
    margin: 0 !important;
    width: 280px !important;
  }
  .leaflet-popup-tip-container {
    display: none;
  }
  .leaflet-bar a {
    background-color: #fff !important;
    color: #000 !important;
    border: none !important;
    font-weight: bold !important;
  }
  .leaflet-control-zoom {
    border: 1px solid rgba(0,0,0,0.05) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    border-radius: 12px !important;
    overflow: hidden;
  }
`;

interface Listing {
    id: string;
    title: string;
    location: string;
    pricePerNight: number;
    rating: number;
    totalReviews: number;
    images: string[];
    propertyType: string;
    maxGuests: number;
    bedrooms: number;
    lat: number;
    lng: number;
}

interface MapProps {
    listings: Listing[];
}

function MapContent({ listings }: MapProps) {
    const map = useMap();

    useEffect(() => {
        if (listings.length > 0) {
            const timer = setTimeout(() => {
                const bounds = L.latLngBounds(listings.map(l => [l.lat, l.lng]));
                if (listings.length === 1) {
                    map.flyTo([listings[0].lat, listings[0].lng], 13, {
                        animate: true,
                        duration: 1.5
                    });
                } else {
                    map.fitBounds(bounds, {
                        padding: [70, 70],
                        maxZoom: 15,
                        animate: true,
                        duration: 1.5
                    });
                }
            }, 100);
            return () => clearTimeout(timer);
        } else {
            // Default focus if no results (e.g. center of the world or a specific default)
            map.setView([20, 0], 2, { animate: true });
        }
    }, [listings, map]);

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading>
                {listings.map((listing) => {
                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="custom-marker-pill">₺${listing.pricePerNight.toLocaleString('tr-TR')}</div>`,
                        iconSize: [60, 30],
                        iconAnchor: [30, 15],
                    });

                    return (
                        <Marker
                            key={listing.id}
                            position={[listing.lat, listing.lng]}
                            icon={customIcon}
                        >
                            <Popup closeButton={false}>
                                <div className="w-[300px]">
                                    <ListingCard {...listing} layout="grid" />
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MarkerClusterGroup>
        </>
    );
}

export default function SearchMap({ listings }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="w-full h-full bg-muted animate-pulse rounded-3xl" />;

    return (
        <div className="w-full h-full relative">
            <style>{mapStyles}</style>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <MapContent listings={listings} />
            </MapContainer>
        </div>
    );
}
