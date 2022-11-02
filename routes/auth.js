const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

// 회원가입 라우터. 기존에 같은 이메일로 가입한 사용자가 있는지 조회한 뒤, 있다면, flash 메시지를 설정하고, 회월가입 페이지로 돌려보낸다.
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    // 가입된 이메일이 없다면, 비밀번호를 암호화하고, 사용자 정보를 생성한다. 회원가입시, 비밀번호는 암호화해서 저장한다.
    const hash = await bcrypt.hash(password, 12); // password를 bcrypt 방식으로 12번 반복하여 암호화한다. 12번 넘어가면 암호화 시간이 오래걸려서 별로임. 12 추천
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 로그인 전략을 수행하는 미들웨어(라우터 미들웨어 안에 들어있음). 전략이 성공하거나 실패하면 authenticate 메서드의 콜백함수가 실행된다.
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

// 로그아웃 라우터. req.logout 메서드는 req.user 객체를 제거하고, req.session.destroy는 req.session 객체의 내용을 제거한다. 제거후, 메인으로 돌아간다/
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});
// GET /auth/kakao로 좁근하면 카카오 로그인 과정 시작.
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/', // 카카오 로그인이 실패했을 때의 리다이렉트 설정
}), (req, res) => {
    res.redirect('/');
})

module.exports = router;