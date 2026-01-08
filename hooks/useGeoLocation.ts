import { useEffect, useState } from "react";

interface LocationState {
  loaded: boolean;
  coordinates?: { lat: string; long: string };
  error?: { message: string };
}

const useGeoLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    loaded: false,
  });

  const onSuccess = (pos: GeolocationPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: pos.coords.latitude.toString(),
        long: pos.coords.longitude.toString(),
      },
    });
  };

  const onError = (error: GeolocationPositionError | { message: string }) => {
    setLocation({
      loaded: true,
      error: { message: error.message },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setTimeout(() => {
        onError({ message: "Geolocation not supported" });
      }, 0);
      return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);
  return location;
};

export default useGeoLocation;
