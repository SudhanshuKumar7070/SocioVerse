import { UAParser } from 'ua-parser-js';

const parser = new UAParser();


export const getDeviceInfo = ()=>{
    const result=parser.getResult();
    const deviceInfo = {
  browser: result.browser.name,
  os: result.os.name,
  device: result.device.model || "Desktop"
};
 return deviceInfo;
}

