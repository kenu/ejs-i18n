// app.js
const express = require('express');
const app = express();
const path = require('path');

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 언어 설정을 위한 미들웨어
app.use((req, res, next) => {
  // 쿼리 파라미터나 쿠키에서 언어 설정을 가져옵니다
  req.language = req.query.lang || req.cookies.lang || 'ko';
  next();
});

// 번역을 위한 간단한 객체
const translations = {
  ko: {
    title: '안녕하세요',
    welcome: '환영합니다',
    switchLanguage: '언어 변경'
  },
  en: {
    title: 'Hello',
    welcome: 'Welcome',
    switchLanguage: 'Switch Language'
  }
};

// 루트 라우트
app.get('/', (req, res) => {
  res.render('index', { 
    lang: req.language, 
    t: translations[req.language] 
  });
});

// 서버 시작
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
