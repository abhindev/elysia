import type { Elysia } from "elysia";
import { Message } from "../../../schema/messageSchema";

interface BodyType {}

export default function orderGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app
    .onError(({ code, error }) => {
      return new Response(error.toString());
    })
      .get("", async () => {
        const messages = await Message.find();
        return messages.reverse();
      })
      .post("", async ({ body, set }) => {
        const order = new Message(body);
        await order.save();
        return order;
      })
      .get("/:id", async ({ params: { id } }) => {
        const message = await Message.findOne({ messageId: id });
        if (!message) {
          return {
            error: "not found",
          };
        }
        return message;
      })
      .put("/:id", async ({ params: { id }, body }) => {
        const updatemessage = await Message.findOneAndUpdate(
          { messageId: id },
          { $set: body as BodyType },
          { new: true }
        );
        return updatemessage;
      })
  );
}
