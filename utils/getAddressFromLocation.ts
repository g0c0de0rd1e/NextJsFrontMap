import axios from "axios";

export async function getAddressFromLocation(lat: number, lng: number) {
  const params = {
    lat,
    lon: lng,
    format: "json",
  };

  return axios
    .get(`https://nominatim.openstreetmap.org/reverse`, { params })
    .then(({ data }) => data.display_name)
    .catch((error) => {
      console.log(error);
      return "not found";
    });
}
