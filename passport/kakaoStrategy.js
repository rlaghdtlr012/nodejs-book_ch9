const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    // client ID는 카카오에서 발급해주는 아이디. 노출되지 않아야 하므로 proccess.env.KAKAO_ID로 설정함. 나중에 ID를 발급받아 .env 파일에 넣어야함
    clientID: process.env.KAKAO_ID,
    // callbackURL은 카카오로부터 인증 결과를 받을 라우터 주소.
    callbackURL: '/auth/kakao/callback',
    // 기존에 카카오로 로그인한 사용자가 있는지 조회
    }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        done(null, exUser);
      } else { // 없다면 회원가입을 진행. 카카오에서 인증 후, callbackURL에 적힌 주소로 데이터를 부내줌.
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email, // profile에는 사용자 정보들이 들어있음(카카오에서 보내주는 것)
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser); // 사용자 생성한 뒤 done 함수를 호출.
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};