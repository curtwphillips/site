const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if (!req.headers['authorization']) {
      return res.status(403).send('An authorization header is required for authentication');
    }

    // split on space for Bearer <token>, not required
    const tokenArr = req.headers['authorization'].split(" ");
    const token = tokenArr[tokenArr.length - 1];

    if (!token) {
      return res.status(403).send('A token is required for authentication');
    }

    try {
      // verify token is still active
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send('Invalid token');
    }

    return next();
}

module.exports = verifyToken;