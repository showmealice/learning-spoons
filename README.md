# Learning Spoons Project

이 프로젝트는 Netlify로 배포된 `iridescent-biscochitos-56024b.netlify.app`의 소스 코드입니다.

## 🎯 프로젝트 개요

Learning Spoons는 교육 과정을 관리하는 웹 애플리케이션입니다. 강의 관리, 등록, 대시보드 등의 기능을 제공합니다.

## ✨ 주요 기능

- **대시보드**: 전체 현황 및 통계 확인
- **강의 관리**: 강의 정보 등록, 수정, 삭제
- **강의 등록**: 새로운 강의 등록 및 관리
- **반응형 디자인**: 모든 기기에서 최적화된 경험

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: 순수 CSS (커스텀 디자인)
- **Backend**: Supabase (PostgreSQL + 실시간 API)
- **배포**: Netlify
- **버전 관리**: Git & GitHub

## 📁 프로젝트 구조

```
learning-spoons/
├── index.html                    # 메인 페이지
├── dashboard.html                # 대시보드
├── course-management.html        # 강의 관리
├── course-registration.html      # 강의 등록
├── maindashboard.html           # 메인 대시보드
├── css/
│   └── style.css               # 스타일시트
├── js/
│   ├── app.js                  # 메인 앱 로직
│   ├── config.js               # 설정 파일
│   ├── dashboard.js            # 대시보드 로직
│   ├── course-management.js    # 강의 관리 로직
│   ├── course-registration.js  # 강의 등록 로직
│   ├── inventory.js            # 재고 관리
│   ├── savings.js              # 저축 관리
│   ├── storage.js              # 저장소 관리
│   ├── streak.js               # 연속 기록
│   └── tempt.js                # 임시 기능
├── assets/
│   └── icons/                  # 아이콘 파일들
├── netlify-deploy-final/       # Netlify 배포용 파일
├── sample-data.sql             # 샘플 데이터
├── supabase-schema.sql         # 데이터베이스 스키마
├── SUPABASE_SETUP.md           # Supabase 설정 가이드
├── ENVIRONMENT_SETUP.md        # 환경변수 설정 가이드
├── TEAM_SETUP_GUIDE.md         # 팀원 개발 환경 설정 가이드
└── README.md                   # 프로젝트 설명서
```

## 🚀 시작하기

### 팀원들을 위한 빠른 시작

1. **저장소 클론**
   ```bash
   git clone https://github.com/showmealice/learning-spoons.git
   cd learning-spoons
   ```

2. **로컬에서 실행**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # 또는 Python 2
   python -m SimpleHTTPServer 8000
   
   # 또는 Node.js
   npx http-server
   ```

3. **브라우저에서 확인**
   - `http://localhost:8000` 접속
   - `http://localhost:8000/dashboard.html` (대시보드)
   - `http://localhost:8000/course-management.html` (강의 관리)

### 상세한 개발 환경 설정

팀원들을 위한 자세한 설정 가이드는 **[TEAM_SETUP_GUIDE.md](./TEAM_SETUP_GUIDE.md)**를 참고하세요.

## 🔧 개발 워크플로우

### 1. 새 기능 개발
```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 새 브랜치 생성
git checkout -b feature/새기능이름

# 3. 코드 수정 작업
# (파일 편집)

# 4. 변경사항 커밋
git add .
git commit -m "새 기능 추가: 설명"

# 5. 브랜치 푸시
git push origin feature/새기능이름
```

### 2. Pull Request 생성
1. GitHub 웹사이트에서 저장소 접속
2. "Compare & pull request" 버튼 클릭
3. 제목과 설명 작성
4. 팀원들에게 리뷰 요청
5. 승인 후 메인 브랜치에 병합

## 🌐 배포 정보

- **배포 URL**: https://iridescent-biscochitos-56024b.netlify.app
- **배포 플랫폼**: Netlify
- **자동 배포**: GitHub main 브랜치와 연동

## 📱 페이지별 기능

### 1. 메인 페이지 (`index.html`)
- 프로젝트 소개 및 네비게이션
- 주요 기능 안내

### 2. 대시보드 (`dashboard.html`)
- 전체 현황 대시보드
- 통계 및 차트
- 빠른 액션 버튼

### 3. 강의 관리 (`course-management.html`)
- 강의 목록 조회
- 강의 정보 수정/삭제
- 강의 상태 관리

### 4. 강의 등록 (`course-registration.html`)
- 새로운 강의 등록
- 강의 정보 입력 폼
- 유효성 검사

## 🔍 자주 사용하는 Git 명령어

```bash
# 현재 상태 확인
git status

# 변경사항 확인
git diff

# 모든 변경사항 추가
git add .

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push origin 브랜치명

# 최신 코드 가져오기
git pull origin main

# 브랜치 목록 확인
git branch

# 브랜치 전환
git checkout 브랜치명
```

## 🚨 주의사항

1. **직접 main 브랜치에 커밋하지 마세요**
   - 항상 새 브랜치를 만들어서 작업
   - Pull Request를 통해 코드 리뷰 후 병합

2. **커밋 메시지는 명확하게**
   - "수정" ❌
   - "강의 등록 폼 유효성 검사 추가" ✅

3. **작업 전 항상 최신 코드 가져오기**
   - `git pull origin main` 실행

## 🆘 문제 해결

### Git 인증 오류
```bash
# Personal Access Token 사용
# GitHub → Settings → Developer settings → Personal access tokens
# 토큰 생성 후 비밀번호 대신 사용
```

### 충돌 해결
```bash
# 충돌 발생 시
git status
# 충돌 파일 수정 후
git add .
git commit -m "충돌 해결"
```

## 📞 도움이 필요할 때

- GitHub Issues에 문제 등록
- 팀 채팅방에서 질문
- 코드 리뷰 요청 시 상세한 설명 첨부

## 🤝 기여하기

1. 이 저장소를 포크
2. 새로운 기능 브랜치 생성
3. 변경사항 커밋
4. Pull Request 생성

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

**Happy Coding! 🎉**
