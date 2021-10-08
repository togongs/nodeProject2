const express = require("express");
const write = require("../schemas/write");
const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();
router.use((req, res, next) => {
  next();
});

//게시물 조회 api
router.get("/write", async (req, res, next) => {
  try {
    const { category } = req.query;
    const writes = await write.find({ category }).sort("-writeId");
    res.json({ writes: writes });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//게시물 하나 조회 api
// params 를 썼을때와 query를 썼을때 /: 유무??
router.get("/write/:writeId", async (req, res) => {
  const { writeId } = req.params;
  const writes = await write.findOne({ _id: writeId }); // _id 는 objectId
  res.json({ detail: writes });
});

// 게시물 작성 api
router.post("/write", async (req, res) => {
  const { title, name, content, pw } = req.body;
  var today = new Date();
  var date = today.toLocaleString();
  // var writeId =

  // const isExist = await write.find({ writeId });
  // if (isExist.length == 0) {
  await write.create({ title, name, content, date, pw });
  // }
  res.send({ result: "success" });
});

// 게시물 삭제 api
router.delete("/write/:writeId", async (req, res) => {
  const { writeId } = req.params;
  const { pw } = req.body; // body는 수많은 데이터를 가지고 있고 그 중 pw라는 데이터를 가져온다.
  //  console.log(writeId, pw)
  // 몽구스를 사용한다
  const isWrite = await write.findOne({ _id: writeId }); // find와 findOne의 차이점 알아보자. 몽고디비 findOne 찾아보기
  // console.log(isWrite)
  // if (isWrite.length > 0) { // 객체라 길이 필요 없으니 지워줌
  if (pw === isWrite["pw"]) {
    await write.deleteOne({ writeId }); // 왜 되는거지???
    // { 키 : 값}
    res.send({ result: "success" });
  } else {
    res.send({ result: "err" });
  }
});

// 게시물 수정 api
router.patch("/write/:writeId", async (req, res) => {
  const { writeId } = req.params;
  const { title, name, content, pw } = req.body;
  // console.log(writeId, title, name, content, pw)
  const isWrite = await write.findOne({ _id: writeId });
  // console.log(isWrite, writeId, pw)
  // if (isWrite.length > 0) {
  if (pw === isWrite["pw"]) {
    await write.updateOne({ _id: writeId }, { $set: { title, name, content } });
    res.send({ result: "success" });
  } else {
    res.send({ result: "err" });
  }
});
// 댓글 가져오기
router.get("/comment/:boardId", async (req, res) => {
  const { boardId } = req.params;
  const comments = await Comment.find({ postId: boardId }); // 디비컬럼명: 변수명
  // console.log(comments)
  res.send({ comments: comments });
});

// 댓글등록 (로그인 필요)
router.post("/comment/:boardId", authMiddleware, async (req, res) => {
  const { boardId } = req.params; // 고유한 게시글id가 있어야 게시글 마다 구분하여 댓글을 넣을 수 있다.
  const { comment } = req.body;
  // console.log(comment) // comment가 안 온 이유는 ajax에서 문제였다....

  await Comment.create({
    comment: comment,
    nickname: res.locals.user,
    postId: boardId,
  });
  res.send({ result: "success" });
});

// 댓글 수정 (로그인 필요)
router.patch("/comment/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;

  const isComment = await Comment.findOne({ objId: commentId }); //ㅇ

  console.log(commentId, isComment.objId);

  if (commentId === isComment.objId) {
    await Comment.updateOne({ objId: commentId }, { $set: { comment } });
    res.send({ result: "success" });
  } else {
    res.status(400).send({ result: "err" });
  }
});

// 댓글 삭제 ()          // 2번 (변수)로 맞춰줌
router.delete("/comment/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  // 내가 쓴 글 아니면 못지우게 하는 작업
  const comment = await Comment.findOne({ objId: commentId }); // find는 배열로. findOne은 첫번째 하나만 객체로 가져옴
  if (commentId === comment.objId) {
    await Comment.deleteOne({ objId: commentId });
    res.send({ result: "success" });
  } else {
    res.status(400).send({ result: "err" });
  }
});

module.exports = router;
