import { Buffer } from "buffer";
import moment from "moment";

export const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];

    const decoded = JSON.parse(Buffer.from(payload, "base64")?.toString());

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const formatCurrency = (amount: number): string => {
  // Định dạng số theo kiểu tiếng Việt
  const formattedNumber = new Intl.NumberFormat("vi-VN").format(amount);
  return `${formattedNumber} VND`;
};

export const dateToString = (date: Date | string): string => {
  return moment(date).format("MM/DD/YYYY");
};

export const decodePolyline = (encoded: string) => {
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;
  let path = [];
  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    path.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return path;
};
