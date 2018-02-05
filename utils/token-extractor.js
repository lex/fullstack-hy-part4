const getTokenFrom = (request, response, next) => {
  const authorization = request.get("authorization");
  request.token =
    authorization && authorization.toLowerCase().startsWith("bearer ")
      ? (request.token = authorization.substring(7))
      : null;
  next();
};

module.exports = getTokenFrom;
