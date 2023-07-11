import cookie from "js-cookie";
import { RequestData } from "next/dist/server/web/types";

export default function parseCookies(req: RequestData) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}
