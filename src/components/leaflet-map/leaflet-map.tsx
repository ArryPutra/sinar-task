"use client";

import dynamic from "next/dynamic";

// Hubungkan ke file client secara dinamis dengan mematikan SSR
const MapClient = dynamic(() => import("./leaflet-map-client"), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        width: "100%", 
        height: "400px", 
        backgroundColor: "#e5e7eb", 
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280"
      }}
    >
      <span>Memuat komponen peta lokasi...</span>
    </div>
  ),
});

interface LeafletMapProps {
  showInput?: boolean;
  latitude?: number;
  longitude?: number;
}

// Export komponen utama yang bersih untuk dipakai di seluruh web
export default function LeafletMap(props: LeafletMapProps) {
  return <MapClient {...props} />;
}