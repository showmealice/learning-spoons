# 🌍 환경변수 설정 가이드

이 문서는 소셜피드 앱의 환경변수 설정 방법을 설명합니다.

## 📋 목차

1. [환경변수 파일 구조](#1-환경변수-파일-구조)
2. [환경별 설정](#2-환경별-설정)
3. [설정 방법](#3-설정-방법)
4. [보안 고려사항](#4-보안-고려사항)
5. [문제 해결](#5-문제-해결)

## 1. 환경변수 파일 구조

### 1.1 주요 파일들

```
project-root/
├── env.config.js          # 환경변수 설정 파일
├── js/
│   ├── config.js          # Supabase 설정 및 초기화
│   └── app.js             # 메인 애플리케이션
└── index.html             # HTML 메인 파일
```

### 1.2 환경변수 종류

#### Supabase 설정
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_ANON_KEY`: 익명 API 키

#### 앱 설정
- `APP_NAME`: 애플리케이션 이름
- `APP_VERSION`: 버전 정보
- `APP_ENV`: 현재 환경 (development/staging/production)

#### 데이터베이스 설정
- `DB_HOST`: 데이터베이스 호스트
- `DB_PORT`: 데이터베이스 포트
- `DB_NAME`: 데이터베이스 이름

#### 인증 설정
- `AUTH_ENABLE_ANONYMOUS`: 익명 인증 활성화 여부
- `AUTH_ENABLE_EMAIL`: 이메일 인증 활성화 여부
- `AUTH_ENABLE_PHONE`: 전화번호 인증 활성화 여부

#### API 설정
- `API_TIMEOUT`: API 요청 타임아웃 (ms)
- `API_RETRY_ATTEMPTS`: 재시도 횟수

#### 이미지 설정
- `IMAGE_MAX_SIZE`: 최대 이미지 크기 (bytes)
- `IMAGE_ALLOWED_TYPES`: 허용된 이미지 형식
- `UNSPLASH_API_URL`: Unsplash 이미지 API URL

## 2. 환경별 설정

### 2.1 Development (개발 환경)

```javascript
development: {
    DEBUG_MODE: true,
    LOG_LEVEL: 'debug',
    API_TIMEOUT: 60000,  // 60초
    FEATURES: {
        REAL_TIME: true,
        FILE_UPLOAD: false,
        PUSH_NOTIFICATIONS: false,
        ANALYTICS: false
    }
}
```

**특징:**
- 디버그 모드 활성화
- 상세한 로그 출력
- 긴 API 타임아웃
- 기본 기능만 활성화

### 2.2 Staging (스테이징 환경)

```javascript
staging: {
    DEBUG_MODE: true,
    LOG_LEVEL: 'info',
    API_TIMEOUT: 30000,  // 30초
    FEATURES: {
        REAL_TIME: true,
        FILE_UPLOAD: false,
        PUSH_NOTIFICATIONS: false,
        ANALYTICS: false
    }
}
```

**특징:**
- 제한적인 디버그 모드
- 정보 수준 로그
- 중간 API 타임아웃
- 프로덕션과 유사한 설정

### 2.3 Production (프로덕션 환경)

```javascript
production: {
    DEBUG_MODE: false,
    LOG_LEVEL: 'warn',
    API_TIMEOUT: 15000,  // 15초
    FEATURES: {
        REAL_TIME: true,
        FILE_UPLOAD: true,
        PUSH_NOTIFICATIONS: true,
        ANALYTICS: true
    }
}
```

**특징:**
- 디버그 모드 비활성화
- 경고 수준 로그만
- 짧은 API 타임아웃
- 모든 고급 기능 활성화

## 3. 설정 방법

### 3.1 자동 환경 감지

앱은 자동으로 현재 환경을 감지합니다:

```javascript
const getCurrentEnv = () => {
    if (typeof window !== 'undefined') {
        // 브라우저 환경
        return window.location.hostname === 'localhost' ? 'development' : 'production';
    }
    // Node.js 환경
    return process.env.NODE_ENV || 'development';
};
```

**환경 감지 규칙:**
- `localhost` → `development`
- 그 외 도메인 → `production`

### 3.2 수동 환경 설정

특정 환경을 강제로 설정하려면:

```javascript
// 브라우저 콘솔에서
window.FORCE_ENV = 'staging';

// 또는 HTML에서
<script>
    window.FORCE_ENV = 'staging';
</script>
```

### 3.3 환경변수 오버라이드

개별 환경변수를 오버라이드하려면:

```javascript
// 브라우저 콘솔에서
window.ENV_OVERRIDE = {
    API_TIMEOUT: 45000,
    DEBUG_MODE: true
};
```

## 4. 보안 고려사항

### 4.1 API 키 보안

⚠️ **중요**: `SUPABASE_ANON_KEY`는 공개 가능하지만, `service_role` 키는 절대 공개하지 마세요!

```javascript
// ✅ 안전함 (공개 가능)
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// ❌ 위험함 (절대 공개하지 마세요!)
SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 4.2 환경별 보안 설정

#### Development
- 모든 로그 활성화
- 디버그 정보 표시
- 느슨한 보안 정책

#### Production
- 민감한 정보 숨김
- 엄격한 보안 정책
- 에러 메시지 최소화

### 4.3 CORS 설정

Supabase 대시보드에서 허용 도메인을 설정하세요:

1. **Settings** → **API** 클릭
2. **Config** 섹션에서 **CORS** 설정
3. 허용할 도메인 추가:
   - `http://localhost:8000` (개발용)
   - `https://yourdomain.com` (프로덕션용)

## 5. 문제 해결

### 5.1 일반적인 오류들

#### "환경변수가 누락되었습니다" 오류
```javascript
❌ 필수 환경변수가 누락되었습니다: ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
```

**해결 방법:**
1. `env.config.js` 파일이 제대로 로드되었는지 확인
2. HTML에서 스크립트 순서 확인
3. 브라우저 콘솔에서 오류 메시지 확인

#### "Supabase 라이브러리를 불러올 수 없습니다" 오류
```javascript
❌ Supabase 라이브러리를 불러올 수 없습니다.
```

**해결 방법:**
1. `index.html`에 Supabase 스크립트가 포함되었는지 확인
2. 인터넷 연결 상태 확인
3. CDN 서버 상태 확인

#### 환경 감지 실패
```javascript
🌍 현재 환경: undefined
```

**해결 방법:**
1. `getCurrentEnv()` 함수 확인
2. 수동으로 환경 설정:
   ```javascript
   window.FORCE_ENV = 'development';
   ```

### 5.2 디버깅 팁

#### 1. 환경변수 상태 확인
```javascript
// 브라우저 콘솔에서
console.log('현재 설정:', window.getConfig());
console.log('Supabase 클라이언트:', window.SupabaseConfig.supabase);
```

#### 2. 연결 테스트
```javascript
// 브라우저 콘솔에서
window.SupabaseConfig.testConnection();
```

#### 3. 설정 유효성 검사
```javascript
// 브라우저 콘솔에서
window.SupabaseConfig.validateEnvironment();
```

### 5.3 로그 레벨 조정

```javascript
// 브라우저 콘솔에서
window.ENV_OVERRIDE = {
    LOG_LEVEL: 'debug'  // 'debug', 'info', 'warn', 'error'
};
```

## 🔧 고급 설정

### 커스텀 환경변수 추가

```javascript
// env.config.js에 추가
const ENV_CONFIG = {
    // ... 기존 설정 ...
    
    // 커스텀 설정
    CUSTOM_FEATURE: true,
    EXTERNAL_API_URL: 'https://api.example.com',
    
    // 환경별 커스텀 설정
    ENV_SPECIFIC: {
        development: {
            CUSTOM_FEATURE: false,
            EXTERNAL_API_URL: 'https://dev-api.example.com'
        },
        production: {
            CUSTOM_FEATURE: true,
            EXTERNAL_API_URL: 'https://api.example.com'
        }
    }
};
```

### 동적 설정 변경

```javascript
// 런타임에 설정 변경
window.updateConfig = (key, value) => {
    if (window.ENV_CONFIG) {
        window.ENV_CONFIG[key] = value;
        console.log(`설정이 업데이트되었습니다: ${key} = ${value}`);
    }
};

// 사용 예시
window.updateConfig('API_TIMEOUT', 45000);
```

## 📚 추가 리소스

- [Supabase 환경변수 가이드](https://supabase.com/docs/guides/environment-variables)
- [JavaScript 환경변수 모범 사례](https://12factor.net/config)
- [브라우저 환경변수 설정](https://webpack.js.org/guides/environment-variables/)

---

**🎉 환경변수 설정이 완료되었습니다!**

이제 앱이 환경에 따라 자동으로 적절한 설정을 적용하고, 보안과 성능을 최적화할 수 있습니다.
