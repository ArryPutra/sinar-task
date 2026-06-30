"use client";

import { APIProvider, Map, MapMouseEvent, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export default function GoogleMap({
  showInput = false,
  latitude = -3.43995499830927,
  longitude = 114.83087915423647
}: {
  showInput?: boolean
  latitude?: number
  longitude?: number
}) {
  const defaultCenter = { lat: latitude, lng: longitude };

  // State untuk mengontrol pusat kamera peta
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
  // State untuk posisi Marker
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // State untuk menampung teks di kolom input
  const [latInput, setLatInput] = useState<string>(latitude.toString());
  const [lngInput, setLngInput] = useState<string>(longitude.toString());

  // 1. Fungsi ketika peta diklik secara manual
  const handleMapClick = (event: MapMouseEvent) => {
    if (!event.detail.latLng) return;

    const newPosition = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    };

    setPosition(newPosition);
    // Update isi input teks agar sesuai dengan titik yang diklik
    setLatInput(newPosition.lat.toString());
    setLngInput(newPosition.lng.toString());
  };

  // 2. Efek otomatis untuk mendeteksi perubahan input teks Lat & Lng
  useEffect(() => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    // Validasi: Pastikan input berupa angka yang valid dan masuk rentang koordinat bumi
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180
    ) {
      const newPos = { lat, lng };
      setPosition(newPos);
      setCenter(newPos); // Otomatis geser peta ke pusat koordinat baru
    }
  }, [latInput, lngInput]); // Berjalan setiap kali isi kolom input berubah

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div style={{ fontFamily: "sans-serif", }}>

        {/* Form Input Koordinat */}
        {
          showInput &&
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <Field>
                <FieldLabel>Latitude</FieldLabel>
                <Input
                  type="number"
                  step="any"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="Masukkan Lat (ex: -3.43)"
                  name="latitude" />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field>
                <FieldLabel>Longitude</FieldLabel>
                <Input
                  type="number"
                  step="any"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  placeholder="Masukkan Lng (ex: 114.83)"
                  name="longitude" />
              </Field>
            </div>
          </div>
        }

        {/* Komponen Map */}
        <Map
          style={{ width: "100%", height: "400px", borderRadius: "8px", overflow: "hidden" }}
          center={center}
          defaultZoom={15}
          onClick={(event) => showInput && handleMapClick(event)}
          // Update posisi center saat user menggeser/drag peta manual agar tidak mantul balik
          onCameraChanged={(ev) => setCenter(ev.detail.center)}>
          {/* Hanya menggunakan Marker saja di dalam peta */}
          {position && <Marker position={position} />}
        </Map>
      </div>
    </APIProvider>
  );
}