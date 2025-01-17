import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export function LNGMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Note: Replace with your Mapbox token
    mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [69.3451, 30.3753], // Center on Pakistan
      zoom: 4,
    });

    // Sample LNG terminals with properly typed coordinates
    const terminals: Array<{
      name: string;
      coordinates: [number, number]; // Explicitly typed as tuple
      capacity: string;
    }> = [
      {
        name: "Port Qasim LNG Terminal",
        coordinates: [67.3451, 24.7731],
        capacity: "600 MMCFD",
      },
      {
        name: "Engro Elengy Terminal",
        coordinates: [67.3379, 24.7708],
        capacity: "690 MMCFD",
      },
    ];

    map.current.on("load", () => {
      terminals.forEach((terminal) => {
        const marker = new mapboxgl.Marker()
          .setLngLat(terminal.coordinates)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3 class="font-bold">${terminal.name}</h3>
               <p>Capacity: ${terminal.capacity}</p>`
            )
          )
          .addTo(map.current!);
      });
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}