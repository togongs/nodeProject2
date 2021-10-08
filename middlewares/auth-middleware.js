const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const token = req.cookies.user // 쿠키에 저장된 user정보를 가져옴
  // console.log(token)
  try {
    if (token) {
      const decoded = jwt.verify(token, "jcw-secret-key"); // 토큰 대칭동기 인증
      const user = await User.findOne({ nickname: decoded.nickname }).exec()
      res.locals.user = user.nickname; // _id가 아니라 nickname으로 바꿔줘야 로그인정보 중 nickname을 가져옴
    } 
  } catch (err) {
    res.status(400).send({
    errorMessage: "로그인 후 이용 가능합니다.", })
    return
  }
  next();
}