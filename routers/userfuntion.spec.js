const { idCheck, pwCheck, confirmCheck, pw_idCheck } = require('./userfunction');

test('아이디는 3자 이상, 알파벳대소문자, 숫자로 구성되어야 한다.', () => {
    expect(idCheck("111")).toEqual(true)
    expect(idCheck("Dd3")).toEqual(true)
    expect(idCheck("p#$")).toEqual(false)
    expect(idCheck("00")).toEqual(false)
    expect(idCheck("한글은안되지")).toEqual(false)
})

test('비밀번호는 최소 4자 이상이어야 한다.', () => {
    expect(pwCheck("1111")).toEqual(true)
    expect(pwCheck("222")).toEqual(false)
    expect(pwCheck("")).toEqual(false)
})

test('비밀번호 확인은 비밀번호와 정확하게 일치 해야한다', () => {
    expect(confirmCheck("aa11", "aa11")).toEqual(true)
    expect(confirmCheck("asdasd1", "asdasd2")).toEqual(false)
    expect(confirmCheck("123@@", "123@@")).toEqual(true)
})

test('비밀번호가 아이디에 포함되지 않아야한다.', () => {
    expect(pw_idCheck("123aa","456bb")).toEqual(true)
    expect(pw_idCheck("asdffgg","asdff")).toEqual(false)
    expect(pw_idCheck("666655","6666")).toEqual(false)
})