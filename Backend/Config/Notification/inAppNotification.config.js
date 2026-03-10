import { Notification } from "../../Models/notification.model.js";
import { getGlobalNamespace } from "../../server/globalNameSpace.js";
import { connection } from "../Queue.config.js";
import { Worker } from "bullmq";
import { notificationDLQ } from "../DLQ.config.js";
// inApp notification - works on socket connection only
export const inAppNotificationWorker = new Worker(
  "inAppNotificationQueue",
  async (job) => {
    // checking all data coming or not

    try {
      const globalNameSpace = getGlobalNamespace();
      const {
        payload,
        receiverChannel,
        eventName,
        senderId,
        receiverId,
        service,
        sourceId,
        sourceModel,
        content,
      } = job.data;
      if (
        [
          payload,
          receiverChannel,
          eventName,
          senderId,
          receiverId,
          service,
          sourceId,
          sourceModel,
          content,
        ].some((el) => !el)
      )
        throw new Error("all parameters are not available");
      //    creating db entry

      const notification = await Notification.create({
        content: content,
        sender: senderId,
        receiver: receiverId,
        service: service,
        sourceId: sourceId,
        sourceModel: sourceModel,
      });
      if (!notification)
        throw new Error("notification not created at the moment");
      globalNameSpace.to(receiverChannel).emit(eventName, payload);
    } catch (error) {
      console.error("error in sending notification", error);
      throw error;
    }
  },
  { connection: connection },
);

inAppNotificationWorker.on("failed", async (job, error) => {
  if (job.attemptsMade === job.opts.attempts) {
    console.log(
      " job retries exhausted , now moving job to dead latter queue , job id::",
      job.id,
      "the error is::",
      error,
    );
    await notificationDLQ.add("failed-notification", {
      originalJobId: job.id,
      data: job.data,
      error: error.message,
      failedAt: new Date(),
    });
  }
});
