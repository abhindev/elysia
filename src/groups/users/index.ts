import type { Elysia } from "elysia";

import { User } from "../../../schema/userSchema";

const users = await User.find();

interface BodyType {
    
  }

export default function usersGroups(app: Elysia, prefix: string) {
    return app.group(prefix, (app) =>
      app
        .get("", () => users)
        .onError(({ code, error }) => {
          return new Response(error.toString());
        })
        .get("/:uid", async ({ params: { uid } }) => {
          const user = await User.findOne({ uid: uid });
          if (!user) {
            return {
              error: "user not found",
            };
          }
          return(user);
        })
        .post("", async ({ body }) => {
          // create new product
          const user = new User(body);
          await user.save();
          return user;
        })
        .put("/:uid",async ({params:{uid}, body}) => {
           console.log(body)
            // create new product
            const updateduser = await User.findOneAndUpdate({ uid }, { $set: body as BodyType }, { new: true });
            return updateduser;
          })
    );
  }
  