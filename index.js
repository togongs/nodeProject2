const express = require('express')
var cookieParser = require('cookie-parser');
const user = require("./routers/user");
const write = require("./routers/write");

const app = express()
app.use(cookieParser());
const router = express.Router();

app.use("/api", express.urlencoded({ extended: false }), router);
// static 이미지 사용
app.use(express.static('public'));

// 미들웨어 사용
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// ejs 작동
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 스키마 연결
const view = require('./schemas/write') // views로 연결
const view2 = require('./schemas/user')
const connect = require("./schemas/index");
connect();

// 라우터에 api 서버 만들기
const writeRouter = require("./routers/write");
const usersRouter = require("./routers/user");
app.use("/api", [writeRouter], [usersRouter]);


// 회원가입 페이지
app.get('/user',(req, res)=>{
    res.render('user')
});

// 로그인 페이지
app.get('/',(req, res)=>{
    res.render('login')
});

// 메인 페이지 (게시글 조회)
app.get('/main',(req, res)=>{
    res.render('main')
});

app.get('/main/data', async (req, res) => {
    // 시간 내림차순 정렬
    // key는 데이터의 이름, value는 1 or -1의 값
        const posts = await view.find({}).sort({_id: -1}) // find 전체값 수신
        res.send({data: posts})
    })

// 게시글 작성 서버
app.get('/write', (req, res) => {
    let num = req.query.name;
    // console.log(num)
    res.render('write', {num})
})

// 게시글 조회 페이지
app.get('/detail', async (req, res) => {
    let id = req.query.writeId
    const users = await view.findOne({_id: id }) // 
    // console.log(users)
    res.render('detail', {users}) // detail.ejs파일을 그리고 detail.ejs파일안에 user값을 객체로 넘겨준다
})

// 게시글 수정 서버
app.get('/revise', (req, res) => {
    res.render('revise')
})

app.listen(3000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});