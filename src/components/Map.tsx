import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { useMap } from "../context/MapContext";
import "ol/ol.css";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import Popup from "./Popup";
import type { FeatureLike } from "ol/Feature";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import { parcelStyleFunction } from "../mapStyles/cadastralLayerStyles";
import { TileWMS } from "ol/source";

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { setMap } = useMap();
  const [highlightedFeature, setHighlightedFeature] = useState<FeatureLike | null>(null);
  const [popupData, setPopupData] = useState<{
    clickedCoordinate: Array<number>;
    parcelNumber: string;
    area: string;
  } | null>(null);
  const cadastralLayerRef = useRef<VectorTileLayer | null>(null);
  const corineLayerRef = useRef<TileLayer<TileWMS> | null>(null);
  const [wmsVisible, setWmsVisible] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const highlightedFeatureRef = useRef<FeatureLike | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    setMapLoading(true);

    const croatiaExtent = [...fromLonLat([13.0, 42.1]), ...fromLonLat([19.7, 46.6])];

    const vzTopliceCoords = fromLonLat([16.42, 46.21]);

    const corineLayer = new TileLayer({
      source: new TileWMS({
        url: "https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer",
        params: {
          LAYERS: "13",
          STYLES: "",
          TILED: true,
          FORMAT: "image/png",
          TRANSPARENT: true,
          VERSION: "1.3.0",
        },
        serverType: "mapserver",
        crossOrigin: "anonymous",
      }),
      visible: true,
    });

    corineLayerRef.current = corineLayer;

    const cadastralLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: "https://gis-dev.listlabs.net/tegola/maps/cadastral_parcels/{z}/{x}/{y}.pbf",
      }),
      style: (feature) => parcelStyleFunction(feature, highlightedFeatureRef.current),
    });

    cadastralLayerRef.current = cadastralLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        corineLayer,
        cadastralLayer,
      ],
      view: new View({
        center: vzTopliceCoords,
        zoom: 14,
        extent: [...croatiaExtent],
      }),
    });

    // --- ERROR HANDLERS ---
    const corineSource = corineLayer.getSource();
    const cadastralSource = cadastralLayer.getSource();

    let wmsError = false;
    let cadastralError = false;

    const showToast = () => {
      if (wmsError && cadastralError) {
        setToast(
          "Neither WMS nor cadastral layer could be loaded, please check your network connection.",
        );
      } else if (wmsError) {
        setToast("Error while fetching WMS layer, please check your network connection.");
      } else if (cadastralError) {
        setToast("Error while fetching cadastral layer, please check your network connection.");
      } else {
        return;
      }

      setTimeout(() => setToast(null), 3200);
    };

    const handleCorineError = () => {
      wmsError = true;
      setWmsVisible(false);
      corineLayer.setVisible(false);
      showToast();
    };

    const handleCadastralError = () => {
      cadastralError = true;
      showToast();
    };

    corineSource?.on("tileloaderror", handleCorineError);
    cadastralSource?.on("tileloaderror", handleCadastralError);

    map.once("rendercomplete", () => {
      setMapLoading(false);
    });

    // ---POPUP CLICK ---

    const handleClick = async (evt: MapBrowserEvent) => {
      const features = map.getFeaturesAtPixel(evt.pixel);

      if (!features || features.length === 0) {
        setHighlightedFeature(null);
        setPopupData(null);
        return;
      }

      const feature = features[0];
      setHighlightedFeature(feature);
      cadastralLayer.changed();

      const id = feature.getId();
      if (!id) return;

      try {
        const response = await fetch(`https://gis-dev.listlabs.net/api/dkp/parcels/${id}`);

        const json = await response.json();

        setPopupData({
          clickedCoordinate: evt.pixel,
          parcelNumber: json.properties.parcel_number,
          area: json.properties.area,
        });
      } catch (err) {
        console.error("Error while fetching parcel data:", err);
        setPopupData(null);
        setToast(`Error while fetching parcel data:${id}`);
        setTimeout(() => setToast(null), 3200);
      }
    };

    map.on("singleclick", handleClick);

    setMap(map);

    return () => {
      map.un("singleclick", handleClick);
      map.setTarget(undefined);
    };
  }, [setMap]);

  // ---HIGHLIGHT FEATURE---
  useEffect(() => {
    highlightedFeatureRef.current = highlightedFeature;
    cadastralLayerRef.current?.changed();
  }, [highlightedFeature]);

  return (
    <div className=" w-screen h-screen">
      <div ref={mapRef} className="w-full h-full" />

      {/* SWITCH BUTTON */}
      <div className="absolute top-4 right-4  flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-xl border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Corine WMS</span>
        <button
          onClick={() => {
            if (corineLayerRef.current) {
              const current = corineLayerRef.current.getVisible();
              corineLayerRef.current.setVisible(!current);
              setWmsVisible(!current);
              setPopupData(null);
              setHighlightedFeature(null);
            }
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
            wmsVisible ? "bg-blue-400" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
              wmsVisible ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {/* LOADING OVERLAY */}
      {mapLoading && (
        <div className="absolute inset-0  flex items-center justify-center bg-white bg-opacity-90 pointer-events-none">
          <div className="animate-spin h-20 w-20 border-4 border-blue-400 border-t-transparent rounded-full" />
        </div>
      )}
      {/* TOAST ERROR */}
      {toast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 p-4 rounded shadow  border border-red-300">
          {toast}
        </div>
      )}

      {/* POPUP */}
      {popupData && (
        <Popup
          data={popupData}
          onClose={() => {
            setPopupData(null);
            setHighlightedFeature(null);
          }}
        />
      )}
    </div>
  );
};

export default MapComponent;
