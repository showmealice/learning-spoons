# 팀원 개발 환경 설정 가이드

## 📋 사전 준비사항

### 1. GitHub 계정 생성 및 팀 초대 승인
- GitHub.com에서 계정 생성
- 팀 리더로부터 저장소 초대 승인
- 저장소 URL: https://github.com/showmealice/learning-spoons

### 2. 필요한 도구 설치

#### Windows 사용자:
1. **Git for Windows** 설치
   - https://git-scm.com/download/win
   - 설치 시 기본 설정으로 진행

2. **Visual Studio Code** 설치 (권장)
   - https://code.visualstudio.com/
   - 또는 원하는 코드 에디터 사용

#### Mac 사용자:
1. **Command Line Tools** 설치
   ```bash
   xcode-select --install
   ```

2. **Homebrew** 설치 (선택사항)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Git** 설치
   ```bash
   brew install git
   ```

#### Linux 사용자:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

## 🚀 프로젝트 시작하기

### 1단계: 저장소 클론
```bash
# 원하는 폴더로 이동 (예: Desktop)
cd ~/Desktop

# 저장소 클론
git clone https://github.com/showmealice/learning-spoons.git

# 프로젝트 폴더로 이동
cd learning-spoons
```

### 2단계: 프로젝트 구조 확인
```bash
# 파일 목록 확인
ls -la

# 주요 파일들
# - index.html (메인 페이지)
# - css/style.css (스타일)
# - js/ (JavaScript 파일들)
# - course-management.html (강의 관리)
# - course-registration.html (강의 등록)
```

### 3단계: 로컬에서 실행
```bash
# 간단한 HTTP 서버 실행 (Python 3)
python3 -m http.server 8000

# 또는 Python 2
python -m SimpleHTTPServer 8000

# 또는 Node.js가 있다면
npx http-server
```

브라우저에서 `http://localhost:8000` 접속하여 사이트 확인

## 🔧 개발 워크플로우

### 1. 새 기능 개발 시
```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 새 브랜치 생성
git checkout -b feature/새기능이름

# 3. 코드 수정 작업
# (파일 편집)

# 4. 변경사항 확인
git status
git diff

# 5. 변경사항 추가
git add .

# 6. 커밋
git commit -m "새 기능 추가: 설명"

# 7. 브랜치 푸시
git push origin feature/새기능이름
```

### 2. Pull Request 생성
1. GitHub 웹사이트에서 저장소 접속
2. "Compare & pull request" 버튼 클릭
3. 제목과 설명 작성
4. 팀원들에게 리뷰 요청
5. 승인 후 메인 브랜치에 병합

### 3. 버그 수정 시
```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 버그 수정 브랜치 생성
git checkout -b bugfix/버그설명

# 3. 수정 작업
# (코드 수정)

# 4. 커밋 및 푸시
git add .
git commit -m "버그 수정: 설명"
git push origin bugfix/버그설명
```

## 📁 프로젝트 구조 설명

```
learning-spoons/
├── index.html              # 메인 페이지
├── dashboard.html          # 대시보드
├── course-management.html  # 강의 관리
├── course-registration.html # 강의 등록
├── css/
│   └── style.css          # 스타일시트
├── js/
│   ├── app.js             # 메인 앱 로직
│   ├── config.js          # 설정 파일
│   ├── dashboard.js       # 대시보드 로직
│   ├── course-management.js # 강의 관리 로직
│   └── ...                # 기타 JS 파일들
├── assets/
│   └── icons/             # 아이콘 파일들
└── README.md              # 프로젝트 설명
```

## 🔍 자주 사용하는 Git 명령어

```bash
# 현재 상태 확인
git status

# 변경사항 확인
git diff

# 모든 변경사항 추가
git add .

# 특정 파일만 추가
git add 파일명

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

# 새 브랜치 생성 및 전환
git checkout -b 새브랜치명
```

## 🚨 주의사항

1. **직접 main 브랜치에 커밋하지 마세요**
   - 항상 새 브랜치를 만들어서 작업
   - Pull Request를 통해 코드 리뷰 후 병합

2. **커밋 메시지는 명확하게**
   - "수정" ❌
   - "로그인 기능 추가" ✅

3. **작업 전 항상 최신 코드 가져오기**
   - `git pull origin main` 실행

4. **의존성 파일 확인**
   - `.gitignore`에 있는 파일들은 수정하지 않기

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

### 브랜치 삭제
```bash
# 로컬 브랜치 삭제
git branch -d 브랜치명

# 원격 브랜치 삭제
git push origin --delete 브랜치명
```

## 📞 도움이 필요할 때

- GitHub Issues에 문제 등록
- 팀 채팅방에서 질문
- 코드 리뷰 요청 시 상세한 설명 첨부

---

**Happy Coding! 🎉**
