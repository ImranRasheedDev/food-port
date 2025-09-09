const secretKey = "app.resarchHound753";
import _ from "lodash";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { notification, message } from "antd";
const Helper = {
  devLog: function (message, params = "") {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "dev"
    ) {
    }
    return;
  },
  truncateText: function (text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  },
  getStorageData: function (key) {
    let data = _.isEmpty(localStorage.getItem(key))
      ? {}
      : localStorage.getItem(key);
    // Decrypt
    if (!_.isEmpty(data)) {
      var bytes = CryptoJS.AES.decrypt(data, secretKey);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return _.isEmpty(decryptedData) ? {} : decryptedData;
    }
  },
  setStorageData: function (key, value) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      secretKey
    ).toString();
    localStorage.setItem(key, ciphertext);
  },
  removeStorageData: function () {
    localStorage.clear();
  },

  

  overlay(is_show = false) {
    if (is_show === true) {
      if (document.getElementById("overlay"))
        document.getElementById("overlay").style.display = "block";
    } else {
      if (document.getElementById("overlay"))
        document.getElementById("overlay").style.display = "none";
    }
  },

  dateFormat(given_date) {
    return moment(given_date).format("YYYY-MM-DD hh:mm:ss");
  },
  dateFormattoYMD(given_date) {
    console.log(moment(given_date).format("L"));
    return moment(given_date).format("YYYY-MM-DD");
  },
  dateFormattoYMDSlashes(given_date) {
    // console.log(moment(given_date).format('L'))
    return moment(given_date).format("L");
  },

  dayFromdate(given_date) {
    const date = moment(given_date);
    // console.log(moment(date).format('dddd'))
    return date.format("dddd");
  },
  formatPhoneNumber(number) {
    // Ensure the number starts with a country code and remove the '+' sign
    if (!number || typeof number !== "string") {
      return "";
    }

    // Slice off the leading '+' and the country code
    const countryCode = number.slice(0, 2); // "+1"
    const areaCode = number.slice(2, 5); // "323"
    const firstPart = number.slice(5, 8); // "648"
    const secondPart = number.slice(8); // "4282"

    // Format as desired: +1 (323) 648-4282
    const formattedNumber = `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;

    return formattedNumber;
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
  encryptCryptoString(data) {
    let secret = CryptoJS.enc.Utf8.parse(window.constants.crypto_secret);
    let vector = CryptoJS.enc.Utf8.parse(window.constants.crypto_vector);
    let ciphertext = CryptoJS.AES.encrypt(data, secret, {
      iv: vector,
    }).toString();
    return ciphertext;
  },
  timeDiff(sTime, eTime) {
    const startTime = moment(sTime, "HH:mm:ss");
    const endTime = moment(eTime, "HH:mm:ss");
    time_diff = moment.duration(endTime.diff(startTime));
    time_diff =
      time_diff > 0 ? time_diff : moment.duration(startTime.diff(endTime));
    return time_diff.hours() + ":" + time_diff.minutes();
  },
  getUid() {
    let number = Math.floor(100000000 + Math.random() * 900000000);
    return number;
  },
  sendNotification: (
    type = "success",
    message = "Success",
    description = "..."
  ) => {
    notification[type]({ message, description });
  },
  successMessage: (data) => {
    return message.info(data);
  },
  sweetAlert: async function (
    type = "success",
    title = "Success",
    msg = "success",
    callback = () => {}
  ) {
    return Swal.fire({
      title: title,
      text: msg,
      icon: type,
      confirmButtonText: "OK",
    }).then(callback);
  },
  generateRanges: (step = 50, max = 1000) => {
    const ranges = [];
    for (let i = 0; i < max; i += step) {
      const range = `${i}-${i + step}`;
      ranges.push({ key: range, value: range });
    }
    return ranges;
  },
  formatPhoneNumber: (phoneNumber) => {
    // Remove any non-numeric characters (except +)
    const cleaned = phoneNumber.replace(/[^\d+]/g, "");

    // Extract country code (assuming it's always +1 in this case)
    const countryCode = cleaned.substring(0, 2); // +1
    const areaCode = cleaned.substring(2, 5); // First 3 digits after +1
    const firstPart = cleaned.substring(5, 8); // Next 3 digits
    const secondPart = cleaned.substring(8, 11); // Last 3 digits

    // Format the number
    return `${countryCode} ${areaCode} ${firstPart} ${secondPart}`;
  },
};

export default Helper;
