function idCheck(idvalue) { // 함수 선언 (매개변수)
    const userid = /^[A-za-z0-9]{3,}$/
    if(userid.test(idvalue) && idvalue.length >=3) {
        return true
    }
    return false
}

function pwCheck(pwvalue) { // 
    if(pwvalue.length >=4) {
        return true
    }
    return false
}

function confirmCheck(pwvalue, pw2value) { // 비밀번호 확인은 비밀번호와 정확하게 일치해야 합니다.
    if(pwvalue === pw2value) {
        return true
    }
    return false
} 

function pw_idCheck(idvalue, pwvalue) { // 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지가 발생합니다.
    if(!idvalue.includes(pwvalue)) {
        return true
    }
    return false
}

module.exports = { idCheck, pwCheck, confirmCheck, pw_idCheck }