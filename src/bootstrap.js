import lodash from "lodash";
import constants from "@/config/constants";
import helper from "@/helpers";
const bootstrap = async () => { 
  window.lodash = lodash;
  window.constants = constants;
  window.helper = helper;
  try {
    const user = await window.helper.getStorageData("user");
    window.user = user || null; 
  } catch (err) {
    window.user = null;
  }
  
}

export default bootstrap;
