import admin from "firebase-admin";
import serviceAccount from "../Config/firebase-admin-private-key.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendMessageToMany = async (
  receiversList,
  payload,
  content,
  serviceName,
) => {
  const message = {
    tokens: receiversList,
    notification: {
      title: serviceName,
      body: content,
    },
    data: {
      type: serviceName,
      payload: payload,
    },
  };
  console.log(
    "sendMessageToMany - sending message:",
    JSON.stringify(message, null, 2),
  );

  const response = await admin.messaging().sendEachForMulticast(message);
  console.log("Success:", response.successCount);
  console.log("Failed:", response.failureCount);

  if (response.failureCount > 0) {
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.log(`Token ${idx} failed:`, resp.error?.message || resp.error);
      }
    });
  }

  return response;
};
