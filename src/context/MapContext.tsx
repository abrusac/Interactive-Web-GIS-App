import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type Map from "ol/Map";

interface MapContextType {
  map: Map | null;
  setMap: (map: Map) => void;
}

const MapContext = createContext<MapContextType>({
  map: null,
  setMap: () => {},
});

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<Map | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};
export const useMap = () => useContext(MapContext);