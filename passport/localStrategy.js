// 로그인 로직 : passport-local 모듈에서 Strategy 생성자를 불러와서 사용한다.
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    // localStrategy의 첫번째 인자로 주어진 객체. 로직에 관한 설정을 하는 곳
    passport.use(new LocalStrategy({
        usernameField: 'email', //req.body의 속성명을 적어준다. req.body.email에 email이, req.body.password에 비밀번호가 들어오는데, 이를 email과 password에 각각 넣어줌
        passwordField: 'password',
    }, async ( email, password, done) => { // 실제 전략을 수행하는 async 함수. 세번째 매개변수인 done 함수는 passport.authenticate의 콜백함수이다.
        try{
            const exUser = await User.findOne({ where: { email } }); // 이메일 비교
            if( exUser ) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser); // 비밀번호까지 비교해서 일치한다면, done 함수의 두 번째 인자로 사용자 정보를 넣어 보냄. 첫번째 인자는 서버쪽에서 에러가 발생하였을 때 사용
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'}); // 두번째 인자를 사용하지 않을 때는 로그인에 실패했을때뿐.
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'}); // 세번째 인자를 사용하는 경우는, 이메일이 없거나, 비밀번호를 틀렸을 때의 경우.
            } 
        } catch( error ) {
            console.error(error);
            done(error);
        }
    }));
};