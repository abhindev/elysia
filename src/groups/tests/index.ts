import type { Elysia } from "elysia";
import { checkUrlAndHost } from "../../../lib/checkorigin";

export default function testsGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app
      .post("", async ({ body, set }) => {
        return "data"
      })
      .get("/", async ({request}) => {
        // console.log(request.headers)
        const host:any = request.headers.get('host');
        const isSame = checkUrlAndHost(host)
        
        if(isSame){
          return "data"
        } else {
          return {error: "bad request 400"}
        }
      })
      .get("/:id", async ({ params: { id } }) => {
       return "test id"
      })
  );
}

// import { Wati } from "../../../lib/wati";
// //call the fungtion wati
// const row = JSON.stringify(body)
// const wati = await Wati(row,"916235354432")
// return wati
