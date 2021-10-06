const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const token = req.cookies.user // 쿠키 사용법 다시 봐야함
  // console.log(token)
  try {
    if (token) {
      const decoded = jwt.verify(token, "jcw-secret-key");
      const user = await User.findOne({ nickname: decoded.nickname }).exec()
      res.locals.user = user.nickname; // _id가 아니라 nickname으로 바꿔줘야 로그인정보 중 nickname을 가져옴
    } else {
      res.locals.user = undefined
    }
  } catch (err) {
    res.status(400).send({
    errorMessage: "로그인 후 이용 가능합니다.", })
    return
  }
  next();
}