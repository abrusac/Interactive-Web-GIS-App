# 🗺️ React + OpenLayers Cadastral Map Viewer

This project is a React-based web application that uses **OpenLayers** to display cadastral parcels and Corine Land Cover 2018 raster data on an interactive map. The app allows users to click on parcels to view their details and toggle WMS layers dynamically.

---

## 🔧 Technologies Used

- **React** (with TypeScript)
- **OpenLayers** for map rendering
- **TailwindCSS** for UI styling
- **REST API** and **WMS** services for spatial data
- **MVT (Mapbox Vector Tiles)** for cadastral parcels
- **WMS (Web Map Service)** for Corine Land Cover 2018

---

## 🌐 External Services

### 🧭 Cadastral Parcels (Vector Tiles)

- **Vector Tiles URL:**  
  `https://gis-dev.listlabs.net/tegola/maps/cadastral_parcels/{z}/{x}/{y}.pbf`

- **Parcel Details API (REST):**  
  `https://gis-dev.listlabs.net/api/dkp/parcels/:id`  
  *(returns parcel number and area by feature ID)*

---

### 🌍 Corine Land Cover 2018 (WMS)

- **WMS GetCapabilities:**  
  `https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer?service=WMS&request=GetCapabilities&version=1.3.0`

- **WMS GetMap Base URL:**  
  `https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer`

- **Layer Used:**  
  Layer name: `'CLC2018'` (style: `'default'`)  
  CRS: `EPSG:3857`  
  Format: `'image/png'`


  ## ▶️ How to Run

1. **Clone the repository:**
2. npm install
3. npm run dev
4. Visit http://localhost:3000
 in your browser

Enjoy 😊
