const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router(); // 익스프레스 라우터를 router로 쓰겠다

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    // 패스워드 검증
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.find({ nickname });
  if (existsUsers.length) {
    // 닉네임 검증
    res.status(400).send({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).send({});
});

// 로그인 API (쿠키사용법 다시 봐야함)
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname }).exec(); // 내 아이디는 하나이니까 findOne 해도됨
  if (user) {
    if (user.password === password) {
      const token = jwt.sign({ nickname: user.nickname }, "jcw-secret-key");
      res.cookie("user", token);
      res.send({ token });
    } else {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
      });
    }
  } else {
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
    });
  }
});

module.exports = router;
