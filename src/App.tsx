import "./App.css";
import MapComponent from "./components/Map";
import { MapProvider } from "./context/MapContext";

function App() {
  return (
    <MapProvider>
      <MapComponent />
    </MapProvider>
  );
}

export default App;
