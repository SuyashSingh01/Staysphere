import garden_icon from "../assets/icons/facilities/garden-view-icon.svg";
import Kitchen_icon from "../assets/icons/facilities/kitchen-icon.svg";
import wifi_icon from "../assets/icons/facilities/wifi-icon.svg";
import pet from "../assets/icons/facilities/pet.svg";
import alarm_1 from "../assets/icons/facilities/alarm-1.svg";
import alarm_2 from "../assets/icons/facilities/alarm-2.svg";

export const Amenities = [
  { name: "Wifi", icon: wifi_icon },
  { name: "Kitchen", icon: Kitchen_icon },
  { name: "Garden view", icon: garden_icon },
  { name: "Smoke alarm", icon: alarm_2 },
  { name: "Pets allowed", icon: pet },
  { name: "Carbon monoxide alarm", icon: alarm_1 },
];

export const perksOptions = [
  { label: "WiFi", value: "WiFi", icon: "wifi" },
  { label: "Kitchen", value: "Kitchen", icon: "kitchen" },
  { label: "Free Parking", value: "Free Parking", icon: "car" },
  {
    label: "Air Conditioning",
    value: "Air Conditioning",
    icon: "air-conditioner",
  },
  { label: "Pool", value: "Pool", icon: "pool" },
];
