import { Worker } from "bullmq";
import { connection } from "../Queue.config.js";
import { sendMessageToMany } from "../FirebaseAdmin.config.js";
import { TokenUser } from "../../Models/fcmToken.models.js";

export const PushNotificationWorker = new Worker(
  "pushNotificationQueue",
  async (job) => {
    const jobId = job.id;
    console.log("=== PUSH NOTIFICATION JOB START ===");
    console.log("Job ID:", jobId);
    console.log("Job data:", JSON.stringify(job.data, null, 2));

    const {
      senderId,
      receiverId,
      content,
      service,
      sourceId,
      sourceModel,
      payload,
    } = job.data;

    if (
      [
        senderId,
        receiverId,
        content,
        service,
        sourceId,
        sourceModel,
        payload,
      ].some((el) => !el)
    ) {
      throw new Error("all fields are required at push notification queue");
    }

    // Convert receiverId to string for query (in case it's an ObjectId-like object)
    const receiverIdStr = receiverId.toString
      ? receiverId.toString()
      : receiverId;
    console.log("Looking for tokens for user:", receiverIdStr);

    const receivers = await TokenUser.find({ user: receiverIdStr }).select(
      "fcmToken",
    );

    console.log("Found token documents:", receivers.length, receivers);

    if (!receivers || receivers.length === 0) {
      throw new Error(
        `No FCM tokens found for receiver user: ${receiverIdStr} at job id: ${jobId}`,
      );
    }

    const receiversList = receivers.map((t) => t.fcmToken);
    console.log("FCM tokens to send to:", receiversList);

    const response = await sendMessageToMany(
      receiversList,
      JSON.stringify(payload),
      content,
      service,
    );
    console.log("Firebase response:", JSON.stringify(response, null, 2));

    if (!response) {
      throw new Error(
        "sendMessageToMany returned undefined - check FirebaseAdmin.config.js logs",
      );
    }

    if (response.failureCount > 0) {
      console.log(
        "Some messages failed. Responses:",
        JSON.stringify(response.responses, null, 2),
      );
    }

    console.log("=== PUSH NOTIFICATION JOB END ===");
  },
  { connection: connection },
);
