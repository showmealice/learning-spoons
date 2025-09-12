-- 소셜피드 앱을 위한 샘플 데이터 삽입 스크립트
-- 이 파일을 supabase-schema.sql 실행 후 Supabase SQL 편집기에서 실행하세요

-- 샘플 사용자 데이터 삽입
INSERT INTO users (username, display_name, avatar_url, bio, location) VALUES
('kimminsoo', '김민수', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '개발자 | 커피 애호가 ☕', '강남구, 서울'),
('leejiun', '이지은', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '디자이너 | 건강한 라이프스타일 🥗', '마포구, 서울'),
('parkjunho', '박준호', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'PM | 팀워크의 중요성을 믿어요 👥', '서초구, 서울'),
('choisujin', '최수진', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '마케터 | 등산과 독서를 좋아해요 🏔️📚', '송파구, 서울'),
('testuser', '테스트사용자', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '새로운 사용자입니다!', '홍대입구역');

-- 샘플 게시물 데이터 삽입
INSERT INTO posts (user_id, image_url, caption, location) 
SELECT 
    u.id,
    p.image_url,
    p.caption,
    p.location
FROM users u
CROSS JOIN (
    VALUES
    ('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=614&h=614&fit=crop', '오늘 회사 끝나고 카페에서 일하느라 시간 가는 줄 몰랐어요 😅', '강남구, 서울'),
    ('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=614&h=614&fit=crop', '건강한 점심 준비했어요 🥗 워킹맘도 건강하게!', '마포구, 서울'),
    ('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=614&h=614&fit=crop', '팀 프로젝트 마감! 모두 수고했어요 👏', '서초구, 서울'),
    ('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=614&h=614&fit=crop', '주말 등산 다녀왔어요 🏔️ 일상에서 벗어나니 마음이 편해져요', '송파구, 서울'),
    ('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=614&h=614&fit=crop', '새로 오픈한 맛집 발견! 🍜 다음에 팀원들과 같이 올 예정', '홍대입구역'),
    ('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=614&h=614&fit=crop', '새로 산 책 읽는 중 📚 추천 도서 있으면 댓글로 알려주세요!', '집')
) AS p(image_url, caption, location)
WHERE u.username IN ('kimminsoo', 'leejiun', 'parkjunho', 'choisujin', 'kimminsoo', 'leejiun');

-- 샘플 댓글 데이터 삽입
INSERT INTO comments (user_id, post_id, content)
SELECT 
    u.id,
    p.id,
    c.content
FROM users u
CROSS JOIN posts p
CROSS JOIN (
    VALUES
    ('저도 자주 그래요! 어떤 카페인가요?'),
    ('집중력이 좋아지는 분위기네요'),
    ('레시피 공유해주세요!'),
    ('색깔이 너무 예쁘네요'),
    ('수고하셨습니다!'),
    ('다음 프로젝트도 화이팅!'),
    ('어디 산인가요? 다음에 같이 가요!'),
    ('사진이 너무 예쁘네요'),
    ('어디 맛집인가요? 추천해주세요!'),
    ('저도 가보고 싶어요'),
    ('저도 이 책 읽어봤어요! 정말 좋았어요'),
    ('다음에 같이 독서모임 해요')
) AS c(content)
WHERE u.username IN ('leejiun', 'parkjunho', 'choisujin', 'kimminsoo', 'leejiun', 'choisujin', 'parkjunho', 'kimminsoo', 'leejiun', 'parkjunho', 'choisujin', 'kimminsoo')
AND p.id IN (SELECT id FROM posts ORDER BY created_at LIMIT 6);

-- 샘플 좋아요 데이터 삽입
INSERT INTO likes (user_id, post_id)
SELECT 
    u.id,
    p.id
FROM users u
CROSS JOIN posts p
WHERE u.username IN ('kimminsoo', 'leejiun', 'parkjunho', 'choisujin', 'testuser')
AND p.id IN (SELECT id FROM posts ORDER BY created_at LIMIT 6)
AND random() < 0.6; -- 60% 확률로 좋아요

-- 샘플 북마크 데이터 삽입
INSERT INTO bookmarks (user_id, post_id)
SELECT 
    u.id,
    p.id
FROM users u
CROSS JOIN posts p
WHERE u.username IN ('kimminsoo', 'leejiun', 'parkjunho', 'choisujin', 'testuser')
AND p.id IN (SELECT id FROM posts ORDER BY created_at LIMIT 6)
AND random() < 0.3; -- 30% 확률로 북마크

-- 샘플 팔로우 데이터 삽입
INSERT INTO follows (follower_id, following_id)
SELECT 
    u1.id,
    u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.username != u2.username
AND u1.username IN ('kimminsoo', 'leejiun', 'parkjunho', 'choisujin', 'testuser')
AND u2.username IN ('kimminsoo', 'leejiun', 'parkjunho', 'choisujin', 'testuser')
AND random() < 0.7; -- 70% 확률로 팔로우

-- 샘플 스토리 데이터 삽입
INSERT INTO stories (user_id, image_url, caption)
SELECT 
    u.id,
    s.image_url,
    s.caption
FROM users u
CROSS JOIN (
    VALUES
    ('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face', '오늘의 모습'),
    ('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face', '새로운 시작'),
    ('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face', '팀 미팅'),
    ('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face', '주말 계획')
) AS s(image_url, caption)
WHERE u.username IN ('kimminsoo', 'leejiun', 'parkjunho', 'choisujin');

-- 데이터 확인을 위한 뷰 생성
CREATE OR REPLACE VIEW post_summary AS
SELECT 
    p.id,
    p.image_url,
    p.caption,
    p.location,
    p.created_at,
    u.username,
    u.display_name,
    u.avatar_url,
    COUNT(DISTINCT l.id) as like_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT b.id) as bookmark_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN bookmarks b ON p.id = b.post_id
GROUP BY p.id, p.image_url, p.caption, p.location, p.created_at, u.username, u.display_name, u.avatar_url
ORDER BY p.created_at DESC;

-- 사용자 통계 뷰 생성
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    u.avatar_url,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT f1.follower_id) as follower_count,
    COUNT(DISTINCT f2.following_id) as following_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN follows f1 ON u.id = f1.following_id
LEFT JOIN follows f2 ON u.id = f2.follower_id
GROUP BY u.id, u.username, u.display_name, u.avatar_url;
