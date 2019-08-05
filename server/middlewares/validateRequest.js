import jwt from 'jsonwebtoken';
// eslint-disable-next-line
export default (req, res, next) => {
  try {
    const { url, headers } = req;
    if (url.includes('oauth')) return next();

    const { authorization } = headers;
    const token = authorization.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      if (decoded) {
        return next();
      }
      res.status(422).send({
        message: 'Sorry, invalid token',
      });
    } else {
      res.status(422).send({
        message: 'Sorry, token is missing',
      });
    }
  } catch (err) {
    res.status(422).send({
      message: 'Sorry, invalid token',
    });
  }
};
