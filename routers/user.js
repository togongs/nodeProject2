const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) { // 패스워드 검증
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.find({ nickname });
  if (existsUsers.length) { // 닉네임 검증
    res.status(400).send({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).send({});
});

// 로그인 API
router.post("/auth", async (req, res) => {
    const { nickname, password } = req.body;
  
    const user = await User.findOne({ nickname, password }).exec(); // 내 아이디는 하나이니까 findOne 해도됨
  
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
      });
      return;
    }
  
    const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    res.send({
      token,
    });
});

// 내정보조회 API (로그인 체크)
router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
      user: {
        nickname: user.nickname,
      }
    })
});

module.exports = router;