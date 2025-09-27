const secretKey = "app.resarchHound753";
import _ from "lodash";
import Swal from "sweetalert2";

// Browser & Node ke liye crypto
const cryptoObj = globalThis.crypto || require("crypto");

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const Helper = {
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  },

  async getStorageData(key) {
    let data = _.isEmpty(localStorage.getItem(key))
      ? null
      : localStorage.getItem(key);

    if (data) {
      try {
        const decrypted = await this.decrypt(data, secretKey);
        return _.isEmpty(decrypted) ? {} : JSON.parse(decrypted);
      } catch (e) {
        console.error("Decryption failed:", e);
        return {};
      }
    }
    return {};
  },

  async setStorageData(key, value) {
    try {
      const ciphertext = await this.encrypt(JSON.stringify(value), secretKey);
      localStorage.setItem(key, ciphertext);
    } catch (e) {
      console.error("Encryption failed:", e);
    }
  },

  removeStorageData() {
    localStorage.clear();
  },

  async encrypt(message, password) {
    const pwUtf8 = textEncoder.encode(password);
    const pwHash = await cryptoObj.subtle.digest("SHA-256", pwUtf8);

    const iv = cryptoObj.getRandomValues(new Uint8Array(12));

    const alg = { name: "AES-GCM", iv: iv };
    const key = await cryptoObj.subtle.importKey("raw", pwHash, alg, false, [
      "encrypt",
    ]);

    const encoded = textEncoder.encode(message);
    const ciphertext = await cryptoObj.subtle.encrypt(alg, key, encoded);

    // iv + ciphertext -> base64
    const buff = new Uint8Array(iv.byteLength + ciphertext.byteLength);
    buff.set(iv, 0);
    buff.set(new Uint8Array(ciphertext), iv.byteLength);

    return btoa(String.fromCharCode(...buff));
  },

  async decrypt(ciphertextBase64, password) {
    const data = Uint8Array.from(atob(ciphertextBase64), (c) =>
      c.charCodeAt(0)
    );

    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);

    const pwUtf8 = textEncoder.encode(password);
    const pwHash = await cryptoObj.subtle.digest("SHA-256", pwUtf8);

    const alg = { name: "AES-GCM", iv: iv };
    const key = await cryptoObj.subtle.importKey("raw", pwHash, alg, false, [
      "decrypt",
    ]);

    const plainBuffer = await cryptoObj.subtle.decrypt(alg, key, ciphertext);
    return textDecoder.decode(plainBuffer);
  },

  randomid(length) {
    let result = [];
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  },

  sweetAlert(
    type = "success",
    title = "Success",
    msg = "success",
    callback = () => {}
  ) {
    return Swal.fire({
      title: title,
      text: msg,
      icon: type,
      showCancelButton: true, // 👈 Cancel button add
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then(callback);
  },
 async  getLocationDetails(lat, lng, destLat, destLng) {
  try {
    // 1) Reverse Geocoding -> Get City name
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${window.constants.google_api_key}`
    );
    const geoData = await geoRes.json();

    const city =
      geoData.results[0]?.address_components.find((c) =>
        c.types.includes("locality")
      )?.long_name ||
      geoData.results[0]?.address_components.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.long_name ||
      geoData.results[0]?.formatted_address ||
      "Unknown";

    // 2) Distance Matrix -> Distance + Duration
    let distance = "-";
    let duration = "-";

    if (destLat && destLng) {
      const distanceRes = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destLat},${destLng}&key=${window.constants.google_api_key}`
      );
      const distanceData = await distanceRes.json();

      if (distanceData.rows?.[0]?.elements?.[0]?.status === "OK") {
        distance = distanceData.rows[0].elements[0].distance.text;
        duration = distanceData.rows[0].elements[0].duration.text;
      }
    }

    return { city, distance, duration };
  } catch (err) {
    console.error("Error in getLocationDetails:", err);
    return { city: "Unknown", distance: "-", duration: "-" };
  }
}
};

export default Helper;
