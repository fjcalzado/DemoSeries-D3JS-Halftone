import { Preset, PresetCollection } from "../../models/presetModel";

export const PresetList: PresetCollection = [
   {
    name: "Default",
    description: "Simplest pattern",
    thumbnailUrl: "",
    layerStackJSON: require("./Default.json"),
    customBackgroundColor: false,
    backgroundColor: "rgb(255, 255, 255)",
  },
  {
    name: "CMYK",
    description: "Simulates CMYK print pattern",
    thumbnailUrl: "",
    layerStackJSON: require("./CMYK_Print.json"),
    customBackgroundColor: false,
    backgroundColor: "rgb(255, 255, 255)",
  },
];
