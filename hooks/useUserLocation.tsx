import { useMemo } from "react";
import { useSettings } from "contexts/settings/settings.context";
import { Location } from "interfaces";

export default function useUserLocation() {
  const { location: userLocation } = useSettings();

  const location: Location | undefined = useMemo(() => {
    if (!userLocation) {
      return undefined;
    }

    const [latitude, longitude] = userLocation.split(",").map(coord => coord.toString());
    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      return undefined;
    }

    return {
      latitude,
      longitude,
    };
  }, [userLocation]);
  console.log("Parsed location:", location);
  return location;
}
