# 🚀 Supabase 설정 가이드

이 문서는 소셜피드 앱을 Supabase와 연동하기 위한 단계별 설정 가이드를 제공합니다.

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 스키마 설정](#2-데이터베이스-스키마-설정)
3. [샘플 데이터 삽입](#3-샘플-데이터-삽입)
4. [인증 설정](#4-인증-설정)
5. [RLS 정책 확인](#5-rls-정책-확인)
6. [앱 테스트](#6-앱-테스트)

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 계정 생성
1. [Supabase 공식 사이트](https://supabase.com)에 접속
2. "Start your project" 버튼 클릭
3. GitHub 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "New Project" 버튼 클릭
2. 조직 선택 (없으면 새로 생성)
3. 프로젝트 정보 입력:
   - **Name**: `social-feed-app` (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정 (기억해두세요!)
   - **Region**: `Northeast Asia (Tokyo)` (한국에서 가장 빠름)
4. "Create new project" 클릭

### 1.3 프로젝트 대기
- 데이터베이스 생성에 약 1-2분 소요
- "Project is ready" 메시지가 나타날 때까지 대기

## 2. 데이터베이스 스키마 설정

### 2.1 SQL 편집기 접속
1. 프로젝트 대시보드에서 왼쪽 메뉴의 **SQL Editor** 클릭
2. "New query" 버튼 클릭

### 2.2 스키마 실행
1. `supabase-schema.sql` 파일의 내용을 복사
2. SQL 편집기에 붙여넣기
3. "Run" 버튼 클릭하여 실행

### 2.3 실행 결과 확인
- 모든 테이블이 성공적으로 생성되었는지 확인
- 오류가 있다면 오류 메시지 확인 후 수정

## 3. 샘플 데이터 삽입

### 3.1 샘플 데이터 실행
1. SQL 편집기에서 새 쿼리 생성
2. `sample-data.sql` 파일의 내용을 복사
3. SQL 편집기에 붙여넣기
4. "Run" 버튼 클릭하여 실행

### 3.2 데이터 확인
1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 각 테이블을 클릭하여 데이터가 제대로 삽입되었는지 확인:
   - `users`: 5명의 사용자
   - `posts`: 6개의 게시물
   - `comments`: 여러 개의 댓글
   - `likes`: 좋아요 데이터
   - `bookmarks`: 북마크 데이터
   - `follows`: 팔로우 관계
   - `stories`: 스토리 데이터

## 4. 인증 설정

### 4.1 인증 설정 확인
1. 왼쪽 메뉴에서 **Authentication** → **Settings** 클릭
2. **Enable email confirmations** 체크 해제 (개발용)
3. **Enable phone confirmations** 체크 해제 (개발용)

### 4.2 익명 인증 활성화
1. **Authentication** → **Providers** 클릭
2. **Anonymous** 섹션에서 **Enable anonymous sign-ins** 체크
3. **Save** 버튼 클릭

## 5. RLS 정책 확인

### 5.1 RLS 활성화 상태 확인
1. **Table Editor**에서 각 테이블 클릭
2. **RLS** 컬럼이 **Enabled**로 표시되는지 확인

### 5.2 정책 확인
1. 각 테이블의 **Policies** 탭 클릭
2. 다음 정책들이 모두 생성되었는지 확인:
   - `Users are viewable by everyone`
   - `Posts are viewable by everyone`
   - `Likes are viewable by everyone`
   - `Comments are viewable by everyone`
   - `Bookmarks are viewable by owner`
   - `Follows are viewable by everyone`
   - `Stories are viewable by everyone`

## 6. 앱 테스트

### 6.1 프로젝트 정보 확인
1. **Settings** → **API** 클릭
2. 다음 정보를 확인:
   - **Project URL**: `https://[project-id].supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 6.2 앱 실행
1. 로컬 서버 실행:
   ```bash
   cd project-root
   python3 -m http.server 8000
   ```
2. 브라우저에서 `http://localhost:8000` 접속
3. 개발자 도구 콘솔에서 오류 메시지 확인

### 6.3 기능 테스트
- ✅ 피드 로딩
- ✅ 좋아요 버튼 클릭
- ✅ 댓글 작성
- ✅ 북마크 토글
- ✅ 검색 기능
- ✅ 무한 스크롤

## 🔧 문제 해결

### 일반적인 오류들

#### 1. "relation does not exist" 오류
- **원인**: 테이블이 생성되지 않음
- **해결**: `supabase-schema.sql` 다시 실행

#### 2. "permission denied" 오류
- **원인**: RLS 정책 설정 문제
- **해결**: RLS 정책 다시 확인 및 수정

#### 3. "invalid input syntax for type uuid" 오류
- **원인**: UUID 형식 문제
- **해결**: 데이터 타입 확인 및 수정

#### 4. 인증 오류
- **원인**: 익명 인증이 비활성화됨
- **해결**: Authentication → Providers에서 Anonymous 활성화

### 디버깅 팁

1. **브라우저 콘솔 확인**: JavaScript 오류 메시지 확인
2. **Supabase 로그 확인**: Logs 섹션에서 API 호출 로그 확인
3. **네트워크 탭 확인**: API 요청/응답 상태 확인
4. **RLS 정책 테스트**: SQL 편집기에서 직접 쿼리 실행

## 📱 추가 기능 구현

### 향후 개발 가능한 기능들

1. **사용자 인증**
   - 이메일/비밀번호 로그인
   - 소셜 로그인 (Google, GitHub)
   - 프로필 관리

2. **실시간 기능**
   - 실시간 좋아요/댓글 알림
   - 실시간 채팅
   - 실시간 피드 업데이트

3. **파일 업로드**
   - 이미지 업로드 (Storage API)
   - 프로필 사진 변경
   - 게시물 이미지 관리

4. **고급 검색**
   - 해시태그 검색
   - 위치 기반 검색
   - 사용자 검색

## 🔒 보안 고려사항

### 프로덕션 환경 설정

1. **환경 변수 사용**
   ```bash
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

2. **도메인 제한**
   - Supabase 대시보드에서 허용 도메인 설정
   - CORS 정책 설정

3. **API 키 보안**
   - `anon` 키는 공개 가능하지만 `service_role` 키는 절대 공개하지 마세요
   - RLS 정책으로 데이터 접근 제어

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase 커뮤니티](https://github.com/supabase/supabase/discussions)

## 🆘 도움 요청

문제가 발생하면 다음을 확인해주세요:

1. **오류 메시지 전체 복사**
2. **브라우저 콘솔 로그**
3. **Supabase 로그**
4. **사용 중인 브라우저와 버전**

---

**🎉 축하합니다! 이제 Supabase와 연동된 소셜피드 앱이 완성되었습니다!**

모든 설정이 완료되면 실제 데이터베이스에서 데이터를 저장하고 불러올 수 있는 완전한 소셜 앱을 경험할 수 있습니다.
