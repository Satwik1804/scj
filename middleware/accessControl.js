// import UAParser from 'ua-parser-js';
// import dotenv from "dotenv";

// dotenv.config();

// const accessControl = (req, res, next) => {
//     const userAgentString = req.headers['user-agent'];
//     const parser = new UAParser();
//     const agent = parser.setUA(userAgentString).getResult();

//     const isGoogleChrome = agent.browser.name === 'Chrome';
//     const isMobileDevice = agent.device.type === 'mobile';
//     const isOTPValidated = req.headers['x-otp-validated'] === process.env.HEADER;

//     req.deviceType = 'Other';

//     if (isMobileDevice) {
//         req.deviceType = 'Mobile';
//         const currentHour = new Date().getHours();
//         if (currentHour < 19 || currentHour > 23) {
//             return res.status(403).json({ message: "Access restricted for mobile devices outside 7 PM to 11 PM." });
//         }
//         else {
//             if (isGoogleChrome) {
//                 if (isOTPValidated) {
//                     return next();
//                 } else {
//                     return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true });
//                 }
//             } else {
//                 req.browserType = 'Other';
//                 return next();
//             }   
//         }
//     }

//     else {
//         if (isGoogleChrome) {
//             if (isOTPValidated) {
//                 return next();
//             } else {
//                 return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true });
//             }
//         } else {
//             req.browserType = 'Other';
//             return next();
//         }
//     }
// };

// export default accessControl;

import UAParser from 'ua-parser-js';
import dotenv from "dotenv";

dotenv.config();

const accessControl = (req, res, next) => {
    const userAgentString = req.headers['user-agent'];
    const parser = new UAParser();
    const agent = parser.setUA(userAgentString).getResult();

    const isGoogleChrome = agent.browser.name === 'Chrome';
    const isMobileDevice = agent.device.type === 'mobile';
    const isOTPValidated = req.headers['x-otp-validated'] === process.env.HEADER;
    
    var date = new Date()
    var currentHour = date.getHours()

    req.deviceType = 'Other';

    if (isMobileDevice) {
        req.deviceType = 'Mobile';
        if((currentHour >= 10 && currentHour <= 12)) {
            if (isGoogleChrome) {
                if (isOTPValidated) {
                    return next();
                } else {
                    console.log("currentHour " + currentHour)
                    return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true });
                }
            } else {
                req.browserType = 'Other';
                return next();
            }
        }
        else {
            res.status(403).json({ message: "No access for mobiles after or before 10 AM to 1 PM." })
        }
    }  
};

export default accessControl; 