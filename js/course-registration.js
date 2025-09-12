// 강의 등록 JavaScript - 단일 페이지 스크롤 방식

document.addEventListener('DOMContentLoaded', function() {
    initializeCourseRegistration();
});

function initializeCourseRegistration() {
    console.log('initializeCourseRegistration called');
    
    // 자동완성 초기화
    initializeAutocomplete();
    
    // 해시태그 에디터 초기화
    initializeHashtagEditor();
    
    // 네비게이션 초기화
    initializeNavigation();
    
    // 저장 기능 초기화
    initializeSaveFunctions();
    
    // AI 제안 기능 초기화
    initializeAISuggestions();
    
    // 과거 코스 불러오기 초기화
    initializePastCourseModal();
    
    // 자동저장 초기화
    initializeAutoSave();
    
    // 파일 다운로드 초기화
    initializeFileDownloads();
}

// 자동완성 데이터
const autocompleteData = {
    courseManager: ['홍길동', '김기획', '이담당', '박매니저', '최책임'],
    instructor: ['김강사', '이선생', '박교수', '최멘토', '정강사'],
    productSearch: ['쿠폰형', '권한형', '정기권', '패키지', '키트포함']
};

// 자동완성 초기화
function initializeAutocomplete() {
    Object.keys(autocompleteData).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const dropdown = document.getElementById(fieldId + 'Dropdown');
        
        if (input && dropdown) {
            setupAutocomplete(input, dropdown, autocompleteData[fieldId]);
        }
    });
}

// 자동완성 설정
function setupAutocomplete(input, dropdown, suggestions) {
    let isOpen = false;
    
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const filtered = suggestions.filter(s => 
            s.toLowerCase().includes(query)
        ).slice(0, 8);
        
        if (filtered.length > 0 && query.length > 0) {
            showDropdown(dropdown, filtered, input);
            isOpen = true;
        } else {
            hideDropdown(dropdown);
            isOpen = false;
        }
    });
    
    input.addEventListener('focus', function() {
        if (this.value.trim().length > 0) {
            const query = this.value.toLowerCase().trim();
            const filtered = suggestions.filter(s => 
                s.toLowerCase().includes(query)
            ).slice(0, 8);
            
            if (filtered.length > 0) {
                showDropdown(dropdown, filtered, input);
                isOpen = true;
            }
        }
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => {
            hideDropdown(dropdown);
            isOpen = false;
        }, 150);
    });
    
    // 키보드 네비게이션
    input.addEventListener('keydown', function(e) {
        if (!isOpen) return;
        
        const items = dropdown.querySelectorAll('.autocomplete-item');
        const activeItem = dropdown.querySelector('.autocomplete-item.active');
        let activeIndex = -1;
        
        if (activeItem) {
            activeIndex = Array.from(items).indexOf(activeItem);
        }
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            updateActiveItem(items, activeIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            updateActiveItem(items, activeIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeItem) {
                selectItem(activeItem, input);
                hideDropdown(dropdown);
                isOpen = false;
            }
        } else if (e.key === 'Escape') {
            hideDropdown(dropdown);
            isOpen = false;
        }
    });
}

// 드롭다운 표시
function showDropdown(dropdown, items, input) {
    dropdown.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = item;
        div.addEventListener('click', () => {
            selectItem(div, input);
            hideDropdown(dropdown);
        });
        dropdown.appendChild(div);
    });
    
    dropdown.classList.add('show');
}

// 드롭다운 숨기기
function hideDropdown(dropdown) {
    dropdown.classList.remove('show');
    dropdown.innerHTML = '';
}

// 아이템 선택
function selectItem(item, input) {
    input.value = item.textContent;
    input.dispatchEvent(new Event('change'));
}

// 활성 아이템 업데이트
function updateActiveItem(items, activeIndex) {
    items.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}

// 해시태그 에디터 초기화
function initializeHashtagEditor() {
    const hashtagInput = document.getElementById('hashtagInput');
    const hashtagTags = document.getElementById('hashtagTags');
    const aiSuggestBtn = document.getElementById('aiSuggestKeywords');
    
    // 유틸리티 함수들
    const normalize = (s) => s.normalize('NFC');
    const stripHash = (s) => (s.startsWith('#') ? s.slice(1) : s);
    const isEmpty = (s) => normalize(s).trim().length === 0;
    
    let chips = [];
    let isComposing = false;
    
    function exists(key) {
        return chips.some(c => c.key.toLowerCase() === key.toLowerCase());
    }
    
    function commit(raw) {
        const trimmed = raw.trim();
        if (isEmpty(trimmed)) return;
        const key = normalize(stripHash(trimmed));
        if (exists(key)) return;
        chips.push({ key });
        renderTags();
    }
    
    function addTag(tag) {
        commit(tag);
    }
    
    function removeTag(key) {
        chips = chips.filter(c => c.key !== key);
        renderTags();
    }
    
    function renderTags() {
        hashtagTags.innerHTML = '';
        chips.forEach(chip => {
            const tagElement = document.createElement('span');
            tagElement.className = 'hashtag-tag';
            tagElement.innerHTML = `#${chip.key}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'hashtag-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => removeTag(chip.key));
            
            tagElement.appendChild(removeBtn);
            hashtagTags.appendChild(tagElement);
        });
    }
    
    // 입력 이벤트 처리
    hashtagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.isComposing && !isComposing) {
            e.preventDefault();
            commit(this.value);
            this.value = '';
        }
        if (e.key === 'Backspace' && this.value === '' && chips.length > 0) {
            chips = chips.slice(0, -1);
            renderTags();
        }
    });
    
    // 한글 입력 처리
    hashtagInput.addEventListener('compositionstart', () => {
        isComposing = true;
    });
    
    hashtagInput.addEventListener('compositionend', () => {
        isComposing = false;
    });
    
    // AI 추천
    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener('click', function() {
            const aiSuggestions = ['입문', '실무', '포트폴리오', '프로젝트', '취업준비', '기초', '심화', '마스터'];
            aiSuggestions.forEach(tag => addTag(tag));
        });
    }
    
    // 전역 함수로 등록 (AI 제안에서 사용)
    window.removeTag = removeTag;
    window.addTag = addTag;
}

// 네비게이션 초기화
function initializeNavigation() {
    // 스크롤 시 현재 섹션 하이라이트
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.step-section');
        const navButtons = document.querySelectorAll('.nav-btn');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(getSectionName(currentSection))) {
                btn.classList.add('active');
            }
        });
    });
}

// 섹션 이름 매핑
function getSectionName(sectionId) {
    const mapping = {
        'step1': '기본정보',
        'step2': '기수/기간',
        'step3': '교육방식/키워드',
        'step4': '가격/상품',
        'step5': '콘텐츠/리뷰',
        'step6': '검토/완료'
    };
    return mapping[sectionId] || '';
}

// 섹션으로 스크롤
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// 저장 기능 초기화
function initializeSaveFunctions() {
    const tempSaveBtn = document.getElementById('tempSaveBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (tempSaveBtn) {
        tempSaveBtn.addEventListener('click', tempSave);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAll);
    }
}

// 임시저장
function tempSave() {
    const formData = collectFormData();
    
    // 로컬 스토리지에 저장
    localStorage.setItem('courseDraft', JSON.stringify(formData));
    
    showNotification('임시저장이 완료되었습니다.', 'success');
}

// 최종 저장
function saveAll() {
    console.log("저장 버튼 클릭 - 강의 방식 검증 시작");
    
    // 강의 방식 선택 검증 (먼저 실행)
    if (!ensureLectureMethodSelected()) {
        console.log("강의 방식 검증 실패 - 저장 중단");
        return; // 강의 방식 미선택 시 저장 중단
    }
    
    console.log("강의 방식 검증 통과 - 다른 필드 검증 시작");
    
    const formData = collectFormData();
    
    // 유효성 검사
    const errors = validateFormWithErrors(formData);
    if (errors.length > 0) {
        console.log("다른 필드 검증 실패:", errors);
        showErrorModal(errors);
        return;
    }
    
    console.log("모든 검증 통과 - 성공 모달 표시");
    // 검증 통과 시 성공 모달 표시
    showSuccessModal();
}

// 강의 방식 선택 검증 (React 코드를 바닐라로 변환)
function ensureLectureMethodSelected() {
    const el = document.getElementById("lectureMethod");
    if (!el) {
        console.log("lectureMethod element not found");
        return true; // 필드가 없으면 통과(다른 페이지 영향 방지)
    }

    const allowed = ["online", "offline", "hybrid"];
    const currentValue = el.value;
    const invalid = currentValue === "" || !allowed.includes(currentValue);
    
    console.log("강의 방식 검증:", { currentValue, invalid, allowed });

    const err = document.getElementById("lectureMethod-error");
    if (invalid) {
        el.setAttribute("aria-invalid", "true");
        if (err) {
            err.classList.remove("hidden");
            err.style.display = "block";
        }

        // 오류 포커스: 스크롤 + 커서 이동
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
            el.focus({ preventScroll: true });
            el.style.borderColor = "#ef4444";
        }, 250);

        console.log("강의 방식 검증 실패 - 저장 중단");
        return false; // 저장 중단
    } else {
        el.setAttribute("aria-invalid", "false");
        if (err) {
            err.classList.add("hidden");
            err.style.display = "none";
        }
        el.style.borderColor = "";
        console.log("강의 방식 검증 성공");
        return true; // 저장 계속
    }
}

// 필수값 검증 (에러 배열 반환)
function validateFormWithErrors(formData) {
    const requiredFields = [
        { field: 'courseName', name: '코스명' },
        { field: 'courseCode', name: '코스코드' },
        { field: 'courseManager', name: '기획담당자' },
        { field: 'batchName', name: '기수명' },
        { field: 'batchCode', name: '기수코드' },
        { field: 'studyPeriod', name: '수강기한' },
        { field: 'instructor', name: '강사' },
        { field: 'deliveryType', name: '교육방식' },
        { field: 'price', name: '가격' }
    ];
    
    const errors = [];
    for (const { field, name } of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push({ name: field, message: `${name}을(를) 입력해주세요.` });
        }
    }
    
    return errors;
}

// 첫 번째 에러 요소 찾기
function getFirstErrorElement(errors) {
    if (!errors || errors.length === 0) return null;
    const firstError = errors[0].name;
    return document.getElementById(firstError) || 
           document.querySelector(`[data-field="${firstError}"]`);
}

// 에러 필드로 포커스 이동
function focusErrorElement(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        if (element.focus) {
            element.focus({ preventScroll: true });
        }
    }, 300);
}

// 에러 모달 표시
function showErrorModal(errors) {
    const modal = createChoiceModal({
        title: '필수 항목이 비어있어요',
        description: '어떻게 진행할까요?',
        options: [
            {
                key: 'temp',
                label: '임시저장',
                action: () => {
                    tempSave();
                    closeModal();
                }
            },
            {
                key: 'focus',
                label: '에러 포커스',
                action: () => {
                    const element = getFirstErrorElement(errors);
                    focusErrorElement(element);
                    closeModal();
                }
            }
        ]
    });
    
    document.body.appendChild(modal);
}

// 성공 모달 표시
function showSuccessModal() {
    const modal = createChoiceModal({
        title: '검증을 통과했어요',
        description: '저장하시겠어요, 아니면 더 수정할까요?',
        options: [
            {
                key: 'save',
                label: '저장',
                action: async () => {
                    await performSave();
                    closeModal();
                }
            },
            {
                key: 'edit',
                label: '더 수정하기',
                action: () => closeModal()
            }
        ]
    });
    
    document.body.appendChild(modal);
}

// 실제 저장 수행
async function performSave() {
    const formData = collectFormData();
    
    // 실제 저장 로직 (API 호출 등)
    console.log('최종 저장:', formData);
    
    // 로컬 스토리지에서 임시저장 데이터 제거
    localStorage.removeItem('courseDraft');
    
    showNotification('강의가 등록되었습니다.', 'success');
    
    // 강의 관리 페이지로 이동
    setTimeout(() => {
        window.location.href = 'course-management.html';
    }, 1500);
}

// 선택 모달 생성
function createChoiceModal({ title, description, options }) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/40" onclick="closeModal()"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 class="text-lg font-semibold">${title}</h3>
            ${description ? `<p class="mt-2 text-sm text-gray-600">${description}</p>` : ''}
            <div class="mt-5 flex gap-3 justify-end">
                ${options.map(option => `
                    <button 
                        class="rounded-xl border px-4 py-2 hover:bg-gray-50"
                        onclick="handleModalAction('${option.key}')"
                    >
                        ${option.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // 옵션 액션들을 전역으로 저장
    window.modalActions = {};
    options.forEach(option => {
        window.modalActions[option.key] = option.action;
    });
    
    return modal;
}

// 모달 액션 처리
function handleModalAction(key) {
    if (window.modalActions && window.modalActions[key]) {
        window.modalActions[key]();
    }
}

// 모달 닫기
function closeModal() {
    const modal = document.querySelector('.fixed.inset-0.z-\\[100\\]');
    if (modal) {
        modal.remove();
    }
    window.modalActions = null;
}

// 폼 데이터 수집
function collectFormData() {
    return {
        // 기본정보
        courseMethod: document.getElementById('lectureMethod')?.value || '',
        courseName: document.getElementById('courseName')?.value || '',
        courseCode: document.getElementById('courseCode')?.value || '',
        courseManager: document.getElementById('courseManager')?.value || '',
        
        // 기수/기간
        batchName: document.getElementById('batchName')?.value || '',
        batchCode: document.getElementById('batchCode')?.value || '',
        difficulty: document.querySelector('input[name="difficulty"]:checked')?.value || '',
        studyPeriod: document.getElementById('studyPeriod')?.value || '',
        instructor: document.getElementById('instructor')?.value || '',
        
        // 교육방식/키워드
        deliveryType: document.getElementById('deliveryType')?.value || '',
        keywords: getHashtagTags(),
        
        // 가격/상품
        price: document.getElementById('price')?.value || '',
        productSearch: document.getElementById('productSearch')?.value || '',
        
        // 콘텐츠/리뷰
        contentOverview: document.getElementById('contentOverview')?.value || '',
        reviews: document.getElementById('reviews')?.value || '',
        
        // 메타데이터
        savedAt: new Date().toISOString()
    };
}

// 해시태그 태그 가져오기
function getHashtagTags() {
    const tagElements = document.querySelectorAll('.hashtag-tag');
    return Array.from(tagElements).map(el => {
        const text = el.textContent;
        return text.replace('#', '').replace('×', '').trim();
    });
}

// 폼 유효성 검사 (기존 호환성을 위해 유지)
function validateForm(formData) {
    const errors = validateFormWithErrors(formData);
    return errors.length === 0;
}

// AI 제안 기능 초기화
function initializeAISuggestions() {
    const aiButtons = document.querySelectorAll('.ai-button');
    
    aiButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = this.id.replace('aiSuggest', '').toLowerCase();
            suggestStepFields(step);
        });
    });
}

// 단계별 AI 제안
function suggestStepFields(step) {
    const suggestions = {
        step1: {
            courseMethod: '온라인'
        },
        step2: {
            batchName: '1기',
            batchCode: 'BATCH001',
            studyPeriod: '90',
            instructor: '김강사'
        },
        step3: {
            deliveryType: '강의',
            keywords: ['입문', '실무', '포트폴리오']
        },
        step4: {
            price: '299000'
        }
    };
    
    const stepSuggestions = suggestions[step];
    if (stepSuggestions) {
        Object.keys(stepSuggestions).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input && !input.value) {
                input.value = stepSuggestions[fieldId];
                input.dispatchEvent(new Event('change'));
            }
        });
        
        // 키워드가 있는 경우 해시태그에 추가
        if (stepSuggestions.keywords) {
            stepSuggestions.keywords.forEach(keyword => {
                if (typeof window.addTag === 'function') {
                    window.addTag(keyword);
                }
            });
        }
        
        showNotification('AI 제안이 적용되었습니다.', 'success');
    }
}

// 과거 코스 불러오기 모달 초기화
function initializePastCourseModal() {
    const loadPastCourseBtn = document.getElementById('loadPastCourse');
    const modal = document.getElementById('pastCourseModal');
    const closeBtn = document.getElementById('closePastCourseModal');
    const searchBtn = document.getElementById('searchPastCourse');
    
    if (loadPastCourseBtn && modal) {
        loadPastCourseBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('pastCourseSearch');
            const query = searchInput.value.trim();
            
            if (query) {
                searchPastCourses(query);
            } else {
                showNotification('검색어를 입력해주세요.', 'warning');
            }
        });
    }
}

// 과거 코스 검색
function searchPastCourses(query) {
    // 모의 데이터
    const pastCourses = [
        { id: 1, name: '웹 개발 기초 과정', code: 'WEB001', manager: '홍길동' },
        { id: 2, name: 'Python 프로그래밍', code: 'PYTHON001', manager: '김기획' },
        { id: 3, name: '데이터 분석 기초', code: 'DATA001', manager: '이담당' }
    ];
    
    const filtered = pastCourses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase())
    );
    
    const listContainer = document.getElementById('pastCourseList');
    if (listContainer) {
        if (filtered.length > 0) {
            listContainer.innerHTML = filtered.map(course => `
                <div class="past-course-item" onclick="loadPastCourse(${course.id})">
                    <h4>${course.name}</h4>
                    <p>코드: ${course.code} | 담당자: ${course.manager}</p>
                </div>
            `).join('');
        } else {
            listContainer.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
        }
    }
}

// 과거 코스 불러오기
function loadPastCourse(courseId) {
    // 모의 데이터
    const courseData = {
        1: {
            courseName: '웹 개발 기초 과정',
            courseCode: 'WEB001',
            courseManager: '홍길동',
            deliveryType: '강의',
            price: '299000'
        },
        2: {
            courseName: 'Python 프로그래밍',
            courseCode: 'PYTHON001',
            courseManager: '김기획',
            deliveryType: '부트캠프',
            price: '399000'
        },
        3: {
            courseName: '데이터 분석 기초',
            courseCode: 'DATA001',
            courseManager: '이담당',
            deliveryType: '프로젝트',
            price: '199000'
        }
    };
    
    const data = courseData[courseId];
    if (data) {
        // 폼에 데이터 채우기
        Object.keys(data).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                input.value = data[fieldId];
                input.dispatchEvent(new Event('change'));
            }
        });
        
        // 모달 닫기
        const modal = document.getElementById('pastCourseModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        showNotification('과거 코스 데이터가 불러와졌습니다.', 'success');
    }
}

// 자동저장 초기화
function initializeAutoSave() {
    // 폼 변경 시 자동저장
    const form = document.querySelector('.registration-form-single');
    if (form) {
        form.addEventListener('input', debounce(function() {
            tempSave();
        }, 2000));
    }
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 파일 다운로드 초기화
function initializeFileDownloads() {
    const downloadProductsBtn = document.getElementById('downloadProducts');
    
    if (downloadProductsBtn) {
        downloadProductsBtn.addEventListener('click', function() {
            downloadProductsCSV();
        });
    }
}

// 상품 CSV 다운로드
function downloadProductsCSV() {
    const csvContent = generateProductsCSV();
    downloadCSV(csvContent, '상품목록.csv');
}

// 상품 CSV 생성
function generateProductsCSV() {
    const headers = ['상품명', '타입', '가격', '설명'];
    const rows = [
        ['쿠폰형', '쿠폰', '50000', '할인 쿠폰'],
        ['권한형', '권한', '100000', '접근 권한'],
        ['정기권', '정기', '200000', '정기 구독'],
        ['패키지', '패키지', '300000', '패키지 상품'],
        ['키트포함', '키트', '150000', '키트 포함']
    ];
    
    const csvRows = [headers.join(','), ...rows.map(row => row.join(','))];
    return csvRows.join('\n');
}

// CSV 다운로드
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

// 페이지 로드 시 임시저장 데이터 복원
window.addEventListener('load', function() {
    const draftData = localStorage.getItem('courseDraft');
    if (draftData) {
        try {
            const courseData = JSON.parse(draftData);
            restoreFormData(courseData);
        } catch (error) {
            console.error('Failed to restore course draft:', error);
            localStorage.removeItem('courseDraft');
        }
    }
});

// 폼 데이터 복원
function restoreFormData(data) {
    Object.keys(data).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input && data[fieldId]) {
            input.value = data[fieldId];
        }
    });
    
    // 라디오 버튼 처리
    if (data.difficulty) {
        const radio = document.querySelector(`input[name="difficulty"][value="${data.difficulty}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
    
    showNotification('임시저장된 데이터가 복원되었습니다.', 'info');
}
