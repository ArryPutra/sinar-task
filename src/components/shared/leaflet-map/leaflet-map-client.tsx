"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const markerIcon = typeof window !== "undefined" ? new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
}) : undefined;

function MapEventsHandler({
  center,
  showInput,
  onMapClick,
}: {
  center: [number, number];
  showInput: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const isDifferent =
      Math.abs(currentCenter.lat - center[0]) > 0.0001 ||
      Math.abs(currentCenter.lng - center[1]) > 0.0001;

    if (isDifferent) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

  useMapEvents({
    click(e) {
      if (showInput) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export default function LeafletMapClient({
  showInput = false,
  latitude = -3.43995499830927,
  longitude = 114.83087915423647
}: {
  showInput?: boolean
  latitude?: number
  longitude?: number
}) {
  const defaultCenter: [number, number] = [latitude, longitude];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [position, setPosition] = useState<[number, number] | null>(defaultCenter);

  const [latInput, setLatInput] = useState<string>(latitude.toString());
  const [lngInput, setLngInput] = useState<string>(longitude.toString());

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setLatInput(lat.toString());
    setLngInput(lng.toString());
    setCenter([lat, lng]);
  };

  const updateCoordinates = (lat: string, lng: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      setPosition([latitude, longitude]);
      setCenter([latitude, longitude]);
    }
  };

  const targetLat = position ? position[0] : center[0];
  const targetLng = position ? position[1] : center[1];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`;

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {showInput && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <Field>
              <FieldLabel>Latitude</FieldLabel>
              <Input
                type="number"
                step="any"
                value={latInput}
                name="latitude"
                placeholder="Masukkan Lat"
                onChange={(e) => {
                  const value = e.target.value;
                  setLatInput(value);
                  updateCoordinates(value, lngInput);
                }}
              />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field>
              <FieldLabel>Longitude</FieldLabel>
              <Input
                type="number"
                step="any"
                value={lngInput}
                name="longitude"
                placeholder="Masukkan Lng"
                onChange={(e) => {
                  const value = e.target.value;
                  setLngInput(value);
                  updateCoordinates(latInput, value);
                }}
              />
            </Field>
          </div>
        </div>
      )}

      {/* Kontainer Utama Peta */}
      <div style={{ width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", position: "relative", zIndex: 0 }}>

        {/* Komponen Map */}
        <MapContainer center={center} zoom={15} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventsHandler center={center} showInput={showInput} onMapClick={handleMapClick} />
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>

        {/* Tombol Google Maps di dalam Peta (Pojok Kiri Bawah) */}
        <div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 1000, // Menghindari tombol tenggelam di bawah peta
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#ffffff", // Menggunakan warna dasar putih agar kontras dengan jalanan peta
              color: "#1f2937",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              transition: "background-color 0.2s, color 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#1f2937";
            }}
          >
            <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Buka Google Maps
          </a>

          {showInput && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "16px",
                transform: "translateX(-50%)",
                zIndex: 900,
                pointerEvents: "none",

                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",

                color: "#1f2937",
                padding: "8px 14px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",

                fontSize: "13px",
                fontWeight: 500,

                width: "calc(100% - 32px)", // mengikuti lebar layar
                maxWidth: "420px",
                textAlign: "center",
                whiteSpace: "normal", // biarkan membungkus
                lineHeight: 1.4,
              }}
            >
              📍 Pilih lokasi dengan mengklik peta. Koordinat akan terisi secara otomatis.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}