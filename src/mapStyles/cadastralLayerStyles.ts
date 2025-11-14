import { Style, Stroke, Fill } from "ol/style";
import type { FeatureLike } from "ol/Feature";

export const getHighlightedParcelStyle = () =>
  new Style({
    stroke: new Stroke({ color: "#00b7ffff", width: 2 }),
    fill: new Fill({ color: "#00b7ff65" }),
  });

export const getDefaultParcelStyle = () =>
  new Style({
    stroke: new Stroke({ color: "#84afb9ff", width: 1 }),
    fill: new Fill({ color: "#8cc8e065" }),
  });

export const parcelStyleFunction = (
  feature: FeatureLike,
  highlightedFeature: FeatureLike | null,
) => {
  if (highlightedFeature && feature.getId() === highlightedFeature.getId()) {
    return getHighlightedParcelStyle();
  }
  return getDefaultParcelStyle();
};
