// 어드민 기수추가 시스템 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 탭 기능 구현
    initializeTabs();
    
    // AI 버튼 기능 구현
    initializeAIButtons();
    
    // 폼 유효성 검사
    initializeFormValidation();
    
    // 저장 버튼 기능
    initializeSaveButton();
});

// 탭 기능 초기화
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 모든 탭 버튼 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 선택된 탭 활성화
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// AI 버튼 기능 초기화
function initializeAIButtons() {
    // AI SEO 추천 버튼
    const aiSeoButton = document.querySelector('.ai-button');
    if (aiSeoButton) {
        aiSeoButton.addEventListener('click', () => {
            generateSEOKeywords();
        });
    }
    
    // AI 코드 미리보기 버튼
    const aiPreviewButton = document.querySelector('.ai-preview-button');
    if (aiPreviewButton) {
        aiPreviewButton.addEventListener('click', () => {
            generateCodePreview();
        });
    }
}

// SEO 키워드 생성 (AI 시뮬레이션)
function generateSEOKeywords() {
    const seoTextarea = document.getElementById('seoKeywords');
    const courseName = document.getElementById('courseName').value;
    
    if (!courseName.trim()) {
        showNotification('과정명을 먼저 입력해주세요.', 'warning');
        return;
    }
    
    // 로딩 상태 표시
    const originalText = seoTextarea.value;
    seoTextarea.value = 'AI가 키워드를 분석하고 있습니다...';
    seoTextarea.disabled = true;
    
    // AI 처리 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
        const keywords = generateMockSEOKeywords(courseName);
        seoTextarea.value = keywords;
        seoTextarea.disabled = false;
        showNotification('SEO 키워드가 생성되었습니다!', 'success');
    }, 2000);
}

// 코드 미리보기 생성 (AI 시뮬레이션)
function generateCodePreview() {
    const courseName = document.getElementById('courseName').value;
    const courseDescription = document.getElementById('courseDescription').value;
    
    if (!courseName.trim() || !courseDescription.trim()) {
        showNotification('과정명과 설명을 모두 입력해주세요.', 'warning');
        return;
    }
    
    // HTML 코드 생성
    const htmlCode = generateMockHTML(courseName, courseDescription);
    document.getElementById('htmlCode').value = htmlCode;
    
    // CSS 코드 생성
    const cssCode = generateMockCSS();
    document.getElementById('cssCode').value = cssCode;
    
    // HTML 탭으로 이동
    document.querySelector('[data-tab="html"]').click();
    
    showNotification('HTML/CSS 코드가 생성되었습니다!', 'success');
}

// 모의 SEO 키워드 생성
function generateMockSEOKeywords(courseName) {
    const baseKeywords = [
        courseName,
        `${courseName} 과정`,
        `${courseName} 교육`,
        `${courseName} 학습`,
        `${courseName} 온라인`,
        `${courseName} 수강`,
        `${courseName} 강의`,
        `${courseName} 커리큘럼`
    ];
    
    const additionalKeywords = [
        '프로그래밍',
        '개발자',
        '코딩',
        '소프트웨어',
        'IT 교육',
        '실무 프로젝트',
        '포트폴리오',
        '취업 준비'
    ];
    
    return [...baseKeywords, ...additionalKeywords].join(', ');
}

// 모의 HTML 코드 생성
function generateMockHTML(courseName, description) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseName} - 과정 상세</title>
    <meta name="description" content="${description}">
</head>
<body>
    <header class="course-header">
        <h1>${courseName}</h1>
        <p class="course-description">${description}</p>
    </header>
    
    <main class="course-content">
        <section class="course-overview">
            <h2>과정 개요</h2>
            <div class="course-info">
                <div class="info-item">
                    <span class="label">수강 기간:</span>
                    <span class="value">12주</span>
                </div>
                <div class="info-item">
                    <span class="label">수강료:</span>
                    <span class="value">₩1,200,000</span>
                </div>
            </div>
        </section>
        
        <section class="course-curriculum">
            <h2>커리큘럼</h2>
            <ul class="curriculum-list">
                <li>1주차: ${courseName} 기초</li>
                <li>2주차: 핵심 개념 학습</li>
                <li>3주차: 실습 프로젝트</li>
            </ul>
        </section>
    </main>
</body>
</html>`;
}

// 모의 CSS 코드 생성
function generateMockCSS() {
    return `/* 과정 페이지 스타일 */
.course-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 20px;
    text-align: center;
}

.course-header h1 {
    font-size: 2.5rem;
    margin-bottom: 16px;
    font-weight: 700;
}

.course-description {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
}

.course-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.course-overview, .course-curriculum {
    background: white;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.course-overview h2, .course-curriculum h2 {
    color: #1e293b;
    margin-bottom: 24px;
    font-size: 1.5rem;
}

.course-info {
    display: grid;
    gap: 16px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
}

.label {
    font-weight: 600;
    color: #374151;
}

.value {
    color: #667eea;
    font-weight: 500;
}

.curriculum-list {
    list-style: none;
    padding: 0;
}

.curriculum-list li {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
}

.curriculum-list li:last-child {
    border-bottom: none;
}

@media (max-width: 768px) {
    .course-header h1 {
        font-size: 2rem;
    }
    
    .course-content {
        padding: 20px;
    }
    
    .course-overview, .course-curriculum {
        padding: 24px;
    }
}`;
}

// 폼 유효성 검사 초기화
function initializeFormValidation() {
    const inputs = document.querySelectorAll('.input-field, .textarea-field');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

// 필드 유효성 검사
function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, '이 필드는 필수입니다.');
        return false;
    }
    
    if (field.id === 'courseName' && value.length < 2) {
        showFieldError(field, '과정명은 최소 2자 이상이어야 합니다.');
        return false;
    }
    
    if (field.id === 'courseDescription' && value.length < 10) {
        showFieldError(field, '과정 설명은 최소 10자 이상이어야 합니다.');
        return false;
    }
    
    return true;
}

// 필드 에러 표시
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
}

// 필드 에러 제거
function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    field.style.boxShadow = 'none';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// 저장 버튼 초기화
function initializeSaveButton() {
    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            saveCourse();
        });
    }
}

// 과정 저장
function saveCourse() {
    const courseName = document.getElementById('courseName').value.trim();
    const courseDescription = document.getElementById('courseDescription').value.trim();
    const seoKeywords = document.getElementById('seoKeywords').value.trim();
    const htmlCode = document.getElementById('htmlCode').value.trim();
    const cssCode = document.getElementById('cssCode').value.trim();
    
    // 필수 필드 검증
    if (!courseName || !courseDescription) {
        showNotification('과정명과 설명은 필수 입력 항목입니다.', 'error');
        return;
    }
    
    // 저장 처리 시뮬레이션
    const saveButton = document.querySelector('.save-button');
    saveButton.disabled = true;
    saveButton.textContent = '저장 중...';
    
    setTimeout(() => {
        // 실제로는 API 호출로 데이터 저장
        const courseData = {
            name: courseName,
            description: courseDescription,
            seoKeywords: seoKeywords,
            htmlCode: htmlCode,
            cssCode: cssCode,
            createdAt: new Date().toISOString()
        };
        
        console.log('저장된 과정 데이터:', courseData);
        
        saveButton.disabled = false;
        saveButton.textContent = '저장하기';
        
        // 성공 모달 표시
        showSuccessModal();
        
        // 폼 초기화
        resetForm();
    }, 1500);
}

// 폼 초기화
function resetForm() {
    document.getElementById('courseName').value = '';
    document.getElementById('courseDescription').value = '';
    document.getElementById('seoKeywords').value = '';
    document.getElementById('htmlCode').value = '';
    document.getElementById('cssCode').value = '';
    
    // HTML 탭으로 이동
    document.querySelector('[data-tab="html"]').click();
}

// 성공 모달 표시
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
}

// 성공 모달 닫기
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// 등록된 기수 보기 페이지로 이동
function viewRegisteredBatches() {
    // 메인 페이지 숨기기
    document.querySelector('.container').style.display = 'none';
    
    // 기수 목록 페이지 표시
    document.getElementById('batchListPage').classList.remove('hidden');
    
    // 모달 닫기
    closeSuccessModal();
}

// 메인 페이지로 돌아가기
function goBackToMain() {
    // 기수 목록 페이지 숨기기
    document.getElementById('batchListPage').classList.add('hidden');
    
    // 메인 페이지 표시
    document.querySelector('.container').style.display = 'block';
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // 타입별 색상
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // DOM에 추가
    document.body.appendChild(notification);
    
    // 애니메이션 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}
