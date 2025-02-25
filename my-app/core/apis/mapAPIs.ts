import axios from "axios";

interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

const API_KEY = "AlzaSy-J6MHAqBkEymqbjrMuMQvCvGNRAEP82Qs";

export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  try {
    const response = await axios.get(
      "https://maps.gomaps.pro/maps/api/geocode/json",
      {
        params: {
          key: API_KEY,
          address: address,
        },
      }
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
      };
    } else {
      console.log("Không tìm thấy kết quả cho địa chỉ này");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi thực hiện geocoding:", error);
    return null;
  }
}
