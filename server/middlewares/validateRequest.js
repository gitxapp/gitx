import jwt from "jsonwebtoken";
import { checkTokenExpiredOrNot } from "../utils/githubapi";

// eslint-disable-next-line
export default async (req, res, next) => {
  try {
    const { url, headers } = req;
    if (url.includes("oauth") || url.includes("user/all")) return next();

    const { authorization } = headers;
    const token = authorization.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      if (decoded) {
        req.user = decoded;
      }
      if (url.includes("note")) {
        const tokenExpired = await checkTokenExpiredOrNot({
          accessToken: decoded.accessToken,
        });
        if (!tokenExpired) {
          res.status(401).send({
            status: 401,
            message:
              "Sorry, your GitX token has expired, please do login again.",
            logout: true,
          });
        }
        return next();
      }
      res.status(422).send({
        message: "Sorry, invalid token",
      });
    } else {
      res.status(422).send({
        message: "Sorry, token is missing",
      });
    }
  } catch (err) {
    res.status(422).send({
      message: "Sorry, invalid token",
    });
  }
};
