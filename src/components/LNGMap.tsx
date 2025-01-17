import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Define proper types for our data
type Terminal = {
  name: string;
  coordinates: [number, number];
  capacity: string;
};

const terminals: Terminal[] = [
  {
    name: "Port Qasim LNG Terminal",
    coordinates: [67.3374, 24.7708],
    capacity: "600 MMCFD",
  },
  {
    name: "Engro Elengy Terminal",
    coordinates: [67.3060, 24.7681],
    capacity: "690 MMCFD",
  },
];

export function LNGMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [67.3374, 24.7708],
      zoom: 9,
      accessToken: "YOUR_MAPBOX_TOKEN", // Replace with your token
    });

    // Add markers
    terminals.forEach(({ name, coordinates, capacity }) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${name}</h3><p>Capacity: ${capacity}</p>`
      );

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[300px] rounded-lg overflow-hidden"
    />
  );
}