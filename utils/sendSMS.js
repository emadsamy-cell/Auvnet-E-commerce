const ultramsg = require('ultramsg-whatsapp-api');

const sendSMS = async (to, message) => {
  try {
    const api = new ultramsg(process.env.ULTRAMSG_INSTANCE_ID,process.env.ULTRAMSG_API_KEY)
    await api.sendChatMessage(to,message);
    console.log("Message sent successfully....")
    return {
      success: true,
      message: "SMS sent successfully",
      statusCode: 200,
    }
  } catch (error) {
    console.log("Error sending message: ", error);
    return {
      success: false,
      message: "Failed to send SMS",
      statusCode: 500,
      error: "Failed to send SMS"
    }
  }
};

module.exports = sendSMS;

//******************************************** TWILIO ************************************** */
// const twilio = require("twilio");

// // Twilio Account SID and Auth Token from your Twilio Console
// const accountSid = "AC39245e673e222479b7abbe434b19a4f2"; // Your Account SID
// const authToken = "572b7e1cbc96f8b9a6eca10c4f0c26f7"; // Your Auth Token

// // Create a Twilio client
// const client = new twilio(accountSid, authToken);

// // Function to send SMS
// const sendSMS = async (to, message) => {
//   try {
//     const response = await client.messages.create({
//       body: message, // The message content
//       from: "+12672143834", // Your Twilio phone number
//       to: to, // Recipient's phone number
//     });

//     console.log("Message sent: ", response);
//     return response;
//   } catch (error) {
//     console.log("Error sending message: ", error);
//     throw new Error("Failed to send message!", { cause: 500 });
//   }
// };

// module.exports = sendSMS;
//******************************************************************************************** */


// ***************************************** VONAGE ********************************************
// const { Vonage } = require("@vonage/server-sdk");

// const vonage = new Vonage({
//   apiKey: "f56c8573",
//   apiSecret: "vvH6yDjm9YlQVzEc",
// });

// const sendSMS = async (recipient, message) => {
//   try {
//     const res = await vonage.sms.send({
//       to: recipient,
//       from: "AUVNET_Ecommerce",
//       text: message,
//     });
//     console.log(`Message sent successfully to number: ${recipient}....`, res);
//     return true;
//   } catch (error) {
//     throw new Error("Failed to send message!", { cause: 500 });
//   }
// };
// module.exports = sendSMS;
//******************************************************************************************** */