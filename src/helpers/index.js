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
},

  // Country code to country name mapping
  getCountryName(countryCode) {
    const countryMap = {
      // ISO 3166-1 alpha-2 codes
      'AD': 'Andorra', 'AE': 'United Arab Emirates', 'AF': 'Afghanistan', 'AG': 'Antigua and Barbuda',
      'AI': 'Anguilla', 'AL': 'Albania', 'AM': 'Armenia', 'AO': 'Angola', 'AQ': 'Antarctica',
      'AR': 'Argentina', 'AS': 'American Samoa', 'AT': 'Austria', 'AU': 'Australia', 'AW': 'Aruba',
      'AX': 'Åland Islands', 'AZ': 'Azerbaijan', 'BA': 'Bosnia and Herzegovina', 'BB': 'Barbados',
      'BD': 'Bangladesh', 'BE': 'Belgium', 'BF': 'Burkina Faso', 'BG': 'Bulgaria', 'BH': 'Bahrain',
      'BI': 'Burundi', 'BJ': 'Benin', 'BL': 'Saint Barthélemy', 'BM': 'Bermuda', 'BN': 'Brunei',
      'BO': 'Bolivia', 'BQ': 'Caribbean Netherlands', 'BR': 'Brazil', 'BS': 'Bahamas', 'BT': 'Bhutan',
      'BV': 'Bouvet Island', 'BW': 'Botswana', 'BY': 'Belarus', 'BZ': 'Belize', 'CA': 'Canada',
      'CC': 'Cocos Islands', 'CD': 'Democratic Republic of the Congo', 'CF': 'Central African Republic',
      'CG': 'Republic of the Congo', 'CH': 'Switzerland', 'CI': 'Côte d\'Ivoire', 'CK': 'Cook Islands',
      'CL': 'Chile', 'CM': 'Cameroon', 'CN': 'China', 'CO': 'Colombia', 'CR': 'Costa Rica',
      'CU': 'Cuba', 'CV': 'Cape Verde', 'CW': 'Curaçao', 'CX': 'Christmas Island', 'CY': 'Cyprus',
      'CZ': 'Czech Republic', 'DE': 'Germany', 'DJ': 'Djibouti', 'DK': 'Denmark', 'DM': 'Dominica',
      'DO': 'Dominican Republic', 'DZ': 'Algeria', 'EC': 'Ecuador', 'EE': 'Estonia', 'EG': 'Egypt',
      'EH': 'Western Sahara', 'ER': 'Eritrea', 'ES': 'Spain', 'ET': 'Ethiopia', 'FI': 'Finland',
      'FJ': 'Fiji', 'FK': 'Falkland Islands', 'FM': 'Micronesia', 'FO': 'Faroe Islands', 'FR': 'France',
      'GA': 'Gabon', 'GB': 'United Kingdom', 'GD': 'Grenada', 'GE': 'Georgia', 'GF': 'French Guiana',
      'GG': 'Guernsey', 'GH': 'Ghana', 'GI': 'Gibraltar', 'GL': 'Greenland', 'GM': 'Gambia',
      'GN': 'Guinea', 'GP': 'Guadeloupe', 'GQ': 'Equatorial Guinea', 'GR': 'Greece', 'GS': 'South Georgia',
      'GT': 'Guatemala', 'GU': 'Guam', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HK': 'Hong Kong',
      'HM': 'Heard Island', 'HN': 'Honduras', 'HR': 'Croatia', 'HT': 'Haiti', 'HU': 'Hungary',
      'ID': 'Indonesia', 'IE': 'Ireland', 'IL': 'Israel', 'IM': 'Isle of Man', 'IN': 'India',
      'IO': 'British Indian Ocean Territory', 'IQ': 'Iraq', 'IR': 'Iran', 'IS': 'Iceland', 'IT': 'Italy',
      'JE': 'Jersey', 'JM': 'Jamaica', 'JO': 'Jordan', 'JP': 'Japan', 'KE': 'Kenya', 'KG': 'Kyrgyzstan',
      'KH': 'Cambodia', 'KI': 'Kiribati', 'KM': 'Comoros', 'KN': 'Saint Kitts and Nevis', 'KP': 'North Korea',
      'KR': 'South Korea', 'KW': 'Kuwait', 'KY': 'Cayman Islands', 'KZ': 'Kazakhstan', 'LA': 'Laos',
      'LB': 'Lebanon', 'LC': 'Saint Lucia', 'LI': 'Liechtenstein', 'LK': 'Sri Lanka', 'LR': 'Liberia',
      'LS': 'Lesotho', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'LV': 'Latvia', 'LY': 'Libya',
      'MA': 'Morocco', 'MC': 'Monaco', 'MD': 'Moldova', 'ME': 'Montenegro', 'MF': 'Saint Martin',
      'MG': 'Madagascar', 'MH': 'Marshall Islands', 'MK': 'North Macedonia', 'ML': 'Mali', 'MM': 'Myanmar',
      'MN': 'Mongolia', 'MO': 'Macau', 'MP': 'Northern Mariana Islands', 'MQ': 'Martinique', 'MR': 'Mauritania',
      'MS': 'Montserrat', 'MT': 'Malta', 'MU': 'Mauritius', 'MV': 'Maldives', 'MW': 'Malawi',
      'MX': 'Mexico', 'MY': 'Malaysia', 'MZ': 'Mozambique', 'NA': 'Namibia', 'NC': 'New Caledonia',
      'NE': 'Niger', 'NF': 'Norfolk Island', 'NG': 'Nigeria', 'NI': 'Nicaragua', 'NL': 'Netherlands',
      'NO': 'Norway', 'NP': 'Nepal', 'NR': 'Nauru', 'NU': 'Niue', 'NZ': 'New Zealand', 'OM': 'Oman',
      'PA': 'Panama', 'PE': 'Peru', 'PF': 'French Polynesia', 'PG': 'Papua New Guinea', 'PH': 'Philippines',
      'PK': 'Pakistan', 'PL': 'Poland', 'PM': 'Saint Pierre and Miquelon', 'PN': 'Pitcairn Islands',
      'PR': 'Puerto Rico', 'PS': 'Palestine', 'PT': 'Portugal', 'PW': 'Palau', 'PY': 'Paraguay',
      'QA': 'Qatar', 'RE': 'Réunion', 'RO': 'Romania', 'RS': 'Serbia', 'RU': 'Russia', 'RW': 'Rwanda',
      'SA': 'Saudi Arabia', 'SB': 'Solomon Islands', 'SC': 'Seychelles', 'SD': 'Sudan', 'SE': 'Sweden',
      'SG': 'Singapore', 'SH': 'Saint Helena', 'SI': 'Slovenia', 'SJ': 'Svalbard and Jan Mayen',
      'SK': 'Slovakia', 'SL': 'Sierra Leone', 'SM': 'San Marino', 'SN': 'Senegal', 'SO': 'Somalia',
      'SR': 'Suriname', 'SS': 'South Sudan', 'ST': 'São Tomé and Príncipe', 'SV': 'El Salvador',
      'SX': 'Sint Maarten', 'SY': 'Syria', 'SZ': 'Eswatini', 'TC': 'Turks and Caicos Islands',
      'TD': 'Chad', 'TF': 'French Southern Territories', 'TG': 'Togo', 'TH': 'Thailand', 'TJ': 'Tajikistan',
      'TK': 'Tokelau', 'TL': 'Timor-Leste', 'TM': 'Turkmenistan', 'TN': 'Tunisia', 'TO': 'Tonga',
      'TR': 'Turkey', 'TT': 'Trinidad and Tobago', 'TV': 'Tuvalu', 'TW': 'Taiwan', 'TZ': 'Tanzania',
      'UA': 'Ukraine', 'UG': 'Uganda', 'UM': 'United States Minor Outlying Islands', 'US': 'United States',
      'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VA': 'Vatican City', 'VC': 'Saint Vincent and the Grenadines',
      'VE': 'Venezuela', 'VG': 'British Virgin Islands', 'VI': 'United States Virgin Islands',
      'VN': 'Vietnam', 'VU': 'Vanuatu', 'WF': 'Wallis and Futuna', 'WS': 'Samoa', 'YE': 'Yemen',
      'YT': 'Mayotte', 'ZA': 'South Africa', 'ZM': 'Zambia', 'ZW': 'Zimbabwe',
      
      // Phone country codes (numeric)
      '1': 'United States/Canada', '7': 'Russia/Kazakhstan', '20': 'Egypt', '27': 'South Africa',
      '30': 'Greece', '31': 'Netherlands', '32': 'Belgium', '33': 'France', '34': 'Spain',
      '36': 'Hungary', '39': 'Italy', '40': 'Romania', '41': 'Switzerland', '43': 'Austria',
      '44': 'United Kingdom', '45': 'Denmark', '46': 'Sweden', '47': 'Norway', '48': 'Poland',
      '49': 'Germany', '51': 'Peru', '52': 'Mexico', '53': 'Cuba', '54': 'Argentina',
      '55': 'Brazil', '56': 'Chile', '57': 'Colombia', '58': 'Venezuela', '60': 'Malaysia',
      '61': 'Australia', '62': 'Indonesia', '63': 'Philippines', '64': 'New Zealand', '65': 'Singapore',
      '66': 'Thailand', '81': 'Japan', '82': 'South Korea', '84': 'Vietnam', '86': 'China',
      '90': 'Turkey', '91': 'India', '92': 'Pakistan', '93': 'Afghanistan', '94': 'Sri Lanka',
      '95': 'Myanmar', '98': 'Iran', '212': 'Morocco', '213': 'Algeria', '216': 'Tunisia',
      '218': 'Libya', '220': 'Gambia', '221': 'Senegal', '222': 'Mauritania', '223': 'Mali',
      '224': 'Guinea', '225': 'Côte d\'Ivoire', '226': 'Burkina Faso', '227': 'Niger',
      '228': 'Togo', '229': 'Benin', '230': 'Mauritius', '231': 'Liberia', '232': 'Sierra Leone',
      '233': 'Ghana', '234': 'Nigeria', '235': 'Chad', '236': 'Central African Republic',
      '237': 'Cameroon', '238': 'Cape Verde', '239': 'São Tomé and Príncipe', '240': 'Equatorial Guinea',
      '241': 'Gabon', '242': 'Republic of the Congo', '243': 'Democratic Republic of the Congo',
      '244': 'Angola', '245': 'Guinea-Bissau', '246': 'British Indian Ocean Territory',
      '248': 'Seychelles', '249': 'Sudan', '250': 'Rwanda', '251': 'Ethiopia', '252': 'Somalia',
      '253': 'Djibouti', '254': 'Kenya', '255': 'Tanzania', '256': 'Uganda', '257': 'Burundi',
      '258': 'Mozambique', '260': 'Zambia', '261': 'Madagascar', '262': 'Réunion', '263': 'Zimbabwe',
      '264': 'Namibia', '265': 'Malawi', '266': 'Lesotho', '267': 'Botswana', '268': 'Eswatini',
      '269': 'Comoros', '290': 'Saint Helena', '291': 'Eritrea', '297': 'Aruba', '298': 'Faroe Islands',
      '299': 'Greenland', '350': 'Gibraltar', '351': 'Portugal', '352': 'Luxembourg', '353': 'Ireland',
      '354': 'Iceland', '355': 'Albania', '356': 'Malta', '357': 'Cyprus', '358': 'Finland',
      '359': 'Bulgaria', '370': 'Lithuania', '371': 'Latvia', '372': 'Estonia', '373': 'Moldova',
      '374': 'Armenia', '375': 'Belarus', '376': 'Andorra', '377': 'Monaco', '378': 'San Marino',
      '380': 'Ukraine', '381': 'Serbia', '382': 'Montenegro', '383': 'Kosovo', '385': 'Croatia',
      '386': 'Slovenia', '387': 'Bosnia and Herzegovina', '389': 'North Macedonia', '420': 'Czech Republic',
      '421': 'Slovakia', '423': 'Liechtenstein', '500': 'Falkland Islands', '501': 'Belize',
      '502': 'Guatemala', '503': 'El Salvador', '504': 'Honduras', '505': 'Nicaragua', '506': 'Costa Rica',
      '507': 'Panama', '508': 'Saint Pierre and Miquelon', '509': 'Haiti', '590': 'Guadeloupe',
      '591': 'Bolivia', '592': 'Guyana', '593': 'Ecuador', '594': 'French Guiana', '595': 'Paraguay',
      '596': 'Martinique', '597': 'Suriname', '598': 'Uruguay', '599': 'Caribbean Netherlands',
      '670': 'Timor-Leste', '672': 'Australian External Territories', '673': 'Brunei', '674': 'Nauru',
      '675': 'Papua New Guinea', '676': 'Tonga', '677': 'Solomon Islands', '678': 'Vanuatu',
      '679': 'Fiji', '680': 'Palau', '681': 'Wallis and Futuna', '682': 'Cook Islands', '683': 'Niue',
      '684': 'American Samoa', '685': 'Samoa', '686': 'Kiribati', '687': 'New Caledonia', '688': 'Tuvalu',
      '689': 'French Polynesia', '690': 'Tokelau', '691': 'Micronesia', '692': 'Marshall Islands',
      '850': 'North Korea', '852': 'Hong Kong', '853': 'Macau', '855': 'Cambodia', '856': 'Laos',
      '880': 'Bangladesh', '886': 'Taiwan', '960': 'Maldives', '961': 'Lebanon', '962': 'Jordan',
      '963': 'Syria', '964': 'Iraq', '965': 'Kuwait', '966': 'Saudi Arabia', '967': 'Yemen',
      '968': 'Oman', '970': 'Palestine', '971': 'United Arab Emirates', '972': 'Israel', '973': 'Bahrain',
      '974': 'Qatar', '975': 'Bhutan', '976': 'Mongolia', '977': 'Nepal', '992': 'Tajikistan',
      '993': 'Turkmenistan', '994': 'Azerbaijan', '995': 'Georgia', '996': 'Kyrgyzstan', '998': 'Uzbekistan'
    };

    // Handle both string and numeric country codes
    const code = String(countryCode).toUpperCase().trim();
    
    // If it's already a country name (like "California", "New York", etc.), return as is
    if (code.length > 3 && !/^\d+$/.test(code)) {
      return countryCode;
    }
    
    // Look up the country code
    const countryName = countryMap[code];
    return countryName || countryCode; // Return original if not found
  }
};

export default Helper;
