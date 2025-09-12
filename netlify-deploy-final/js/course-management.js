// 강의 관리 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCourseManagement();
});

function initializeCourseManagement() {
    console.log('initializeCourseManagement called');
    // 강의 목록 로드
    loadCourses();
    
    // 검색 기능 초기화
    initializeSearch();
    
    // 필터 기능 초기화
    initializeFilters();
    
    // 정렬 기능 초기화
    initializeSorting();
    
    // 페이지네이션 초기화
    initializePagination();
    
    // 강의 액션 버튼 이벤트
    initializeCourseActions();
    
    // 새 강의 등록 버튼 이벤트
    initializeNewCourseButton();
    
    // 휴지통 메뉴 이벤트
    initializeTrashMenu();
    
    // AI 강의 추천 버튼 이벤트
    initializeAICourseSuggest();
    
    // 엑셀 다운로드 버튼 이벤트
    initializeExcelDownload();
    
    // 임시저장된 강의 데이터 복원
    restoreCourseDraft();
}

// 삭제된 강의 목록을 저장할 전역 변수
let deletedCourses = [];

// 아코디언 상태 관리
let expandedCourseId = null;

// 강의 목록 로드
function loadCourses() {
    console.log('loadCourses function called');
    // 실제로는 API에서 데이터를 가져와야 하지만, 여기서는 모의 데이터 사용
    const courses = [
        {
            id: 1,
            title: '웹 개발 기초 과정',
            description: 'HTML, CSS, JavaScript를 활용한 웹 개발의 기초를 배우는 과정입니다.',
            thumbnail: 'https://via.placeholder.com/200x120/667eea/ffffff?text=웹개발',
            status: 'active',
            students: 1247,
            rating: 4.9,
            price: 120000,
            date: '2024-12-15',
            category: 'web',
            cohorts: [
                {
                    id: '1-1',
                    courseId: 1,
                    name: '1기 (2024년 12월)',
                    students: 45,
                    price: 120000,
                    startDate: '2024-12-15',
                    endDate: '2025-01-15',
                    status: 'completed',
                    progress: 100
                },
                {
                    id: '1-2',
                    courseId: 1,
                    name: '2기 (2025년 1월)',
                    students: 32,
                    price: 120000,
                    startDate: '2025-01-20',
                    endDate: '2025-02-20',
                    status: 'ongoing',
                    progress: 75
                }
            ]
        },
        {
            id: 2,
            title: 'Python 프로그래밍',
            description: '파이썬을 활용한 프로그래밍 기초와 실무 활용법을 학습합니다.',
            thumbnail: 'https://via.placeholder.com/200x120/764ba2/ffffff?text=Python',
            status: 'active',
            students: 892,
            rating: 4.8,
            price: 150000,
            date: '2024-12-14',
            category: 'data',
            cohorts: [
                {
                    id: '2-1',
                    courseId: 2,
                    name: '1기 (2024년 12월)',
                    students: 28,
                    price: 150000,
                    startDate: '2024-12-14',
                    endDate: '2025-01-14',
                    status: 'completed',
                    progress: 100
                }
            ]
        },
        {
            id: 3,
            title: '데이터 분석 기초',
            description: '엑셀과 SQL을 활용한 데이터 분석의 기초를 학습합니다.',
            thumbnail: 'https://via.placeholder.com/200x120/f093fb/ffffff?text=데이터분석',
            status: 'active',
            students: 756,
            rating: 4.7,
            price: 180000,
            date: '2024-12-13',
            category: 'data',
            cohorts: [
                {
                    id: '3-1',
                    courseId: 3,
                    name: '1기 (2024년 12월)',
                    students: 35,
                    price: 180000,
                    startDate: '2024-12-13',
                    endDate: '2025-01-13',
                    status: 'ongoing',
                    progress: 80
                }
            ]
        },
        {
            id: 4,
            title: 'React 마스터 클래스',
            description: 'React의 고급 기능과 최신 패턴을 학습하는 심화 과정입니다.',
            thumbnail: 'https://via.placeholder.com/200x120/4facfe/ffffff?text=React',
            status: 'draft',
            students: 0,
            rating: null,
            price: 200000,
            date: '2024-12-12',
            category: 'web',
            cohorts: []
        },
        {
            id: 5,
            title: 'UI/UX 디자인',
            description: '사용자 경험을 고려한 인터페이스 디자인을 학습합니다.',
            thumbnail: 'https://via.placeholder.com/200x120/43e97b/ffffff?text=UI/UX',
            status: 'inactive',
            students: 521,
            rating: 4.6,
            price: 160000,
            date: '2024-12-10',
            category: 'design',
            cohorts: []
        }
    ];
    
    // 강의 목록 렌더링
    console.log('About to render courses:', courses.length);
    renderCourses(courses);
    
    // 전역 변수에 저장
    window.coursesData = courses;
    window.filteredCourses = courses;
    console.log('Courses loaded and rendered successfully');
}

// 강의 목록 렌더링
function renderCourses(courses) {
    const courseList = document.querySelector('.course-list');
    if (!courseList) {
        console.error('Course list container not found');
        return;
    }
    
    if (!courses || courses.length === 0) {
        courseList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>강의가 없습니다</h3>
                <p>검색 조건에 맞는 강의를 찾을 수 없습니다.</p>
                <button class="btn-primary" onclick="location.href='course-registration.html'">새 강의 등록</button>
            </div>
        `;
        return;
    }
    
    console.log('Rendering courses:', courses.length);
    
    courseList.innerHTML = courses.map(course => `
        <div class="course-group" data-course-id="${course.id}">
            <div class="course-header">
                <div class="course-checkbox" onclick="event.stopPropagation();">
                    <input type="checkbox" class="course-select" data-course-id="${course.id}" id="course-${course.id}">
                    <label for="course-${course.id}" class="checkbox-label"></label>
                </div>
                <div class="course-info">
                    <button class="course-title-button" onclick="toggleCourseAccordion(${course.id})" aria-expanded="${expandedCourseId === course.id}">
                        <span class="course-title-text">${course.title}</span>
                        <span class="accordion-icon">${expandedCourseId === course.id ? '▾' : '▸'}</span>
                    </button>
                    <div class="course-meta">
                        <span class="meta-item">📚 코스코드: ${course.category.toUpperCase()}${course.id.toString().padStart(3, '0')}</span>
                        <span class="meta-item">👥 총 수강생: ${course.students.toLocaleString()}명</span>
                        <span class="meta-item">💰 평균 가격: ₩${course.price.toLocaleString()}</span>
                        <span class="meta-item">📅 등록일: ${course.date}</span>
                    </div>
                </div>
                <div class="course-actions" onclick="event.stopPropagation();">
                    <button class="btn-secondary btn-sm" onclick="showCourseDetailModal(${course.id}, 'edit')">수정</button>
                    <button class="btn-outline btn-sm" onclick="showCourseDetailModal(${course.id}, 'view')">정보 확인</button>
                    <button class="btn-danger btn-sm" onclick="deleteCourse(${course.id})">삭제</button>
                </div>
            </div>
            
            ${course.cohorts && course.cohorts.length > 0 ? `
                <div class="batch-list ${expandedCourseId === course.id ? 'expanded' : 'collapsed'}" style="display: ${expandedCourseId === course.id ? 'block' : 'none'};">
                    ${course.cohorts.filter(cohort => cohort.status !== 'deleted').map(cohort => `
                        <div class="batch-item">
                            <div class="batch-checkbox">
                                <input type="checkbox" class="batch-select" data-batch-id="${cohort.id}" id="batch-${cohort.id}">
                                <label for="batch-${cohort.id}" class="checkbox-label"></label>
                            </div>
                            <div class="batch-info">
                                <h4 class="batch-title">${cohort.name}</h4>
                                <div class="batch-meta">
                                    <span class="meta-item">👥 ${cohort.students}명</span>
                                    <span class="meta-item">💰 ₩${cohort.price.toLocaleString()}</span>
                                    <span class="meta-item">📅 ${cohort.startDate} ~ ${cohort.endDate}</span>
                                </div>
                                <div class="progress-indicator">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${cohort.progress}%"></div>
                                    </div>
                                    <span class="progress-text">${cohort.status === 'completed' ? '완료' : cohort.status === 'ongoing' ? '진행중' : '예정'} (${cohort.progress}%)</span>
                                </div>
                            </div>
                            <div class="batch-actions">
                                <button class="btn-secondary btn-sm" onclick="editBatch(${course.id}, ${cohort.id.split('-')[1]})">수정</button>
                                <button class="btn-outline btn-sm" onclick="previewBatch(${course.id}, ${cohort.id.split('-')[1]})">정보 확인</button>
                                <button class="btn-danger btn-sm" onclick="deleteBatch(${course.id}, ${cohort.id.split('-')[1]})">삭제</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'active': '활성',
        'inactive': '비활성',
        'draft': '초안'
    };
    return statusMap[status] || status;
}

// 검색 기능 초기화
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
}

// 검색 실행
function performSearch(query) {
    if (!window.coursesData) return;
    
    const filtered = window.coursesData.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
    );
    
    window.filteredCourses = filtered;
    renderCourses(filtered);
    updatePagination();
}

// 필터 기능 초기화
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

// 필터 적용
function applyFilters() {
    if (!window.coursesData) return;
    
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = window.coursesData;
    
    // 카테고리 필터
    if (categoryFilter && categoryFilter.value) {
        filtered = filtered.filter(course => course.category === categoryFilter.value);
    }
    
    // 상태 필터
    if (statusFilter && statusFilter.value) {
        filtered = filtered.filter(course => course.status === statusFilter.value);
    }
    
    window.filteredCourses = filtered;
    renderCourses(filtered);
    updatePagination();
}

// 정렬 기능 초기화
function initializeSorting() {
    const sortBy = document.getElementById('sortBy');
    if (!sortBy) return;
    
    sortBy.addEventListener('change', function() {
        sortCourses(this.value);
    });
}

// 강의 정렬
function sortCourses(sortBy) {
    if (!window.filteredCourses) return;
    
    const sorted = [...window.filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'popular':
                return b.students - a.students;
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            default:
                return 0;
        }
    });
    
    window.filteredCourses = sorted;
    renderCourses(sorted);
}

// 페이지네이션 초기화
function initializePagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    pagination.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.textContent);
            if (!isNaN(page)) {
                goToPage(page);
            } else if (e.target.textContent === '이전') {
                goToPreviousPage();
            } else if (e.target.textContent === '다음') {
                goToNextPage();
            }
        }
    });
}

// 페이지 이동
function goToPage(page) {
    // 실제로는 페이지네이션 로직 구현
    console.log('페이지 이동:', page);
    updatePagination();
}

// 이전 페이지
function goToPreviousPage() {
    console.log('이전 페이지');
}

// 다음 페이지
function goToNextPage() {
    console.log('다음 페이지');
}

// 페이지네이션 업데이트
function updatePagination() {
    // 실제로는 페이지네이션 로직 구현
    console.log('페이지네이션 업데이트');
}

// 강의 액션 버튼 이벤트 초기화
function initializeCourseActions() {
    // 이벤트는 HTML에서 onclick으로 처리
}

// 강의 수정
function editCourse(courseId) {
    // 실제로는 수정 페이지로 이동하거나 모달 표시
    console.log('강의 수정:', courseId);
    showNotification('강의 수정 기능은 준비 중입니다.', 'info');
}

// 강의 미리보기
function previewCourse(courseId) {
    // 실제로는 미리보기 페이지로 이동
    console.log('강의 미리보기:', courseId);
    showNotification('강의 미리보기 기능은 준비 중입니다.', 'info');
}

// 강의 삭제 (soft-delete)
function deleteCourse(courseId) {
    const course = window.coursesData?.find(c => c.id === courseId);
    if (!course) return;
    
    if (confirm(`"${course.title}" 강의를 삭제하시겠습니까?`)) {
        // soft-delete: 상태를 'deleted'로 변경
        course.status = 'deleted';
        course.deletedAt = new Date().toISOString();
        
        // 삭제된 강의 목록에 추가
        deletedCourses.push(course);
        
        // 화면에서 제거
        const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
        if (courseCard) {
            courseCard.remove();
        }
        
        // 삭제된 강의 보기 버튼 표시
        showDeletedCoursesButton();
        
        showNotification('강의가 삭제되었습니다.', 'success');
    }
}

// 삭제 모달 표시
function showDeleteModal(course) {
    const modal = document.getElementById('deleteModal');
    if (!modal) return;
    
    // 모달 내용 업데이트
    const modalBody = modal.querySelector('.modal-body p');
    if (modalBody) {
        modalBody.textContent = `"${course.title}" 강의를 정말로 삭제하시겠습니까?`;
    }
    
    // 확인 버튼 이벤트
    const confirmBtn = document.getElementById('confirmDelete');
    if (confirmBtn) {
        confirmBtn.onclick = () => confirmDelete(course.id);
    }
    
    // 취소 버튼 이벤트
    const cancelBtn = document.getElementById('cancelDelete');
    if (cancelBtn) {
        cancelBtn.onclick = closeDeleteModal;
    }
    
    // 닫기 버튼 이벤트
    const closeBtn = document.getElementById('closeDeleteModal');
    if (closeBtn) {
        closeBtn.onclick = closeDeleteModal;
    }
    
    modal.classList.add('show');
}

// 삭제 확인
function confirmDelete(courseId) {
    // 실제로는 API 호출
    console.log('강의 삭제:', courseId);
    
    // 로컬 데이터에서 제거
    if (window.coursesData) {
        window.coursesData = window.coursesData.filter(c => c.id !== courseId);
        window.filteredCourses = window.filteredCourses.filter(c => c.id !== courseId);
        renderCourses(window.filteredCourses);
    }
    
    closeDeleteModal();
    showNotification('강의가 삭제되었습니다.', 'success');
}

// 삭제 모달 닫기
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('show');
    }
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

// 삭제된 강의 보기 버튼 표시
function showDeletedCoursesButton() {
    let button = document.getElementById('deletedCoursesBtn');
    if (!button) {
        button = document.createElement('button');
        button.id = 'deletedCoursesBtn';
        button.className = 'btn-secondary';
        button.innerHTML = '🗑️ 삭제된 강의 보기';
        button.onclick = showDeletedCoursesModal;
        
        // 헤더 액션에 추가
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(button);
        }
    }
    button.style.display = 'flex';
}

// 삭제된 강의 모달 표시
function showDeletedCoursesModal() {
    const modal = document.getElementById('deletedCoursesModal');
    if (modal) {
        modal.style.display = 'flex';
        loadDeletedCourses();
    }
}

// 삭제된 강의 목록 로드
function loadDeletedCourses() {
    const modalBody = document.getElementById('deletedCoursesList');
    if (!modalBody) return;
    
    if (deletedCourses.length === 0) {
        modalBody.innerHTML = '<p class="text-center text-gray-500">삭제된 강의가 없습니다.</p>';
        return;
    }
    
    modalBody.innerHTML = deletedCourses.map(course => `
        <div class="deleted-course-item">
            <div class="course-info">
                <h4>${course.title}</h4>
                <p class="text-sm text-gray-500">삭제일: ${new Date(course.deletedAt).toLocaleString()}</p>
            </div>
            <div class="course-actions">
                <button class="btn-secondary btn-sm" onclick="restoreCourse(${course.id})">복원</button>
                <button class="btn-danger btn-sm" onclick="permanentDeleteCourse(${course.id})">영구삭제</button>
            </div>
        </div>
    `).join('');
}

// 강의 복원
function restoreCourse(courseId) {
    const course = deletedCourses.find(c => c.id === courseId);
    if (!course) return;
    
    if (confirm(`"${course.title}" 강의를 복원하시겠습니까?`)) {
        // 상태를 'active'로 복원
        course.status = 'active';
        delete course.deletedAt;
        
        // 삭제된 강의 목록에서 제거
        deletedCourses = deletedCourses.filter(c => c.id !== courseId);
        
        // 강의 목록에 다시 추가
        renderCourses(window.coursesData.filter(c => c.status === 'active'));
        
        showNotification('강의가 복원되었습니다.', 'success');
        loadDeletedCourses(); // 모달 새로고침
    }
}

// 강의 영구 삭제
function permanentDeleteCourse(courseId) {
    if (confirm('정말로 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        // 삭제된 강의 목록에서 완전 제거
        deletedCourses = deletedCourses.filter(c => c.id !== courseId);
        
        // 원본 데이터에서도 제거
        if (window.coursesData) {
            window.coursesData = window.coursesData.filter(c => c.id !== courseId);
        }
        
        showNotification('강의가 영구 삭제되었습니다.', 'success');
        loadDeletedCourses(); // 모달 새로고침
    }
}

// 삭제된 강의 모달 닫기
function closeDeletedCoursesModal() {
    const modal = document.getElementById('deletedCoursesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 강의 상세 모달 표시 (미리보기/수정)
function showCourseDetailModal(courseId, mode = 'view') {
    const course = window.coursesData?.find(c => c.id === courseId);
    if (!course) return;
    
    const modal = document.getElementById('courseDetailModal');
    const title = document.getElementById('courseDetailTitle');
    const content = document.getElementById('courseDetailContent');
    const footer = document.getElementById('courseDetailFooter');
    
    if (!modal) return;
    
    // 제목 설정
    title.textContent = mode === 'view' ? '강의 미리보기' : '강의 수정';
    
    if (mode === 'view') {
        // 미리보기 모드
        content.innerHTML = `
            <div class="course-detail-view">
                <div class="detail-section">
                    <h4>기본 정보</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>강의명</label>
                            <span>${course.title}</span>
                        </div>
                        <div class="detail-item">
                            <label>설명</label>
                            <span>${course.description}</span>
                        </div>
                        <div class="detail-item">
                            <label>카테고리</label>
                            <span>${course.category}</span>
                        </div>
                        <div class="detail-item">
                            <label>상태</label>
                            <span class="status-badge ${course.status}">${getStatusText(course.status)}</span>
                        </div>
                        <div class="detail-item">
                            <label>수강생 수</label>
                            <span>${course.students.toLocaleString()}명</span>
                        </div>
                        <div class="detail-item">
                            <label>가격</label>
                            <span>₩${course.price.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <label>등록일</label>
                            <span>${course.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        footer.innerHTML = `
            <button class="btn-secondary" onclick="closeCourseDetailModal()">닫기</button>
        `;
    } else {
        // 수정 모드
        content.innerHTML = `
            <div class="course-detail-edit">
                <form id="courseEditForm">
                    <div class="form-group">
                        <label for="editTitle">강의명</label>
                        <input type="text" id="editTitle" value="${course.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="editDescription">설명</label>
                        <textarea id="editDescription" rows="3" required>${course.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editCategory">카테고리</label>
                        <select id="editCategory">
                            <option value="web" ${course.category === 'web' ? 'selected' : ''}>웹 개발</option>
                            <option value="mobile" ${course.category === 'mobile' ? 'selected' : ''}>모바일</option>
                            <option value="data" ${course.category === 'data' ? 'selected' : ''}>데이터 분석</option>
                            <option value="ai" ${course.category === 'ai' ? 'selected' : ''}>AI/ML</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editPrice">가격</label>
                        <input type="number" id="editPrice" value="${course.price}" required>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">상태</label>
                        <select id="editStatus">
                            <option value="active" ${course.status === 'active' ? 'selected' : ''}>활성</option>
                            <option value="inactive" ${course.status === 'inactive' ? 'selected' : ''}>비활성</option>
                        </select>
                    </div>
                </form>
            </div>
        `;
        
        footer.innerHTML = `
            <button class="btn-secondary" onclick="closeCourseDetailModal()">취소</button>
            <button class="btn-primary" onclick="saveCourseEdit(${courseId})">저장</button>
        `;
    }
    
    modal.style.display = 'flex';
}

// 강의 상세 모달 닫기
function closeCourseDetailModal() {
    const modal = document.getElementById('courseDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 강의 수정 저장
function saveCourseEdit(courseId) {
    const course = window.coursesData?.find(c => c.id === courseId);
    if (!course) return;
    
    // 폼 데이터 수집
    const formData = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        category: document.getElementById('editCategory').value,
        price: parseInt(document.getElementById('editPrice').value),
        status: document.getElementById('editStatus').value
    };
    
    // 유효성 검사
    if (!formData.title || !formData.description || !formData.price) {
        showNotification('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    // 강의 정보 업데이트
    Object.assign(course, formData);
    
    // 화면 새로고침
    renderCourses(window.coursesData.filter(c => c.status === 'active'));
    
    showNotification('강의 정보가 수정되었습니다.', 'success');
    closeCourseDetailModal();
}

// 기수 수정
function editBatch(courseId, batchId) {
    console.log('기수 수정:', courseId, batchId);
    showNotification('기수 수정 기능은 준비 중입니다.', 'info');
}

// 기수 미리보기
function previewBatch(courseId, batchId) {
    console.log('기수 미리보기:', courseId, batchId);
    showNotification('기수 미리보기 기능은 준비 중입니다.', 'info');
}

// 새 강의 등록 버튼 초기화
function initializeNewCourseButton() {
    const newCourseBtn = document.getElementById('newCourseBtn');
    if (newCourseBtn) {
        newCourseBtn.addEventListener('click', function() {
            // 인라인 등록 패널 표시 및 스크롤
            showRegistrationPanel();
        });
    }
}

// 휴지통 메뉴 초기화
function initializeTrashMenu() {
    const trashMenu = document.getElementById('trashMenu');
    if (trashMenu) {
        trashMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showDeletedCoursesModal();
        });
    }
    
    // 삭제된 강의 모달 닫기
    const closeDeletedCoursesModal = document.getElementById('closeDeletedCoursesModal');
    if (closeDeletedCoursesModal) {
        closeDeletedCoursesModal.addEventListener('click', hideDeletedCoursesModal);
    }
}

// 삭제된 강의 보기 모달 표시
function showDeletedCoursesModal() {
    const modal = document.getElementById('deletedCoursesModal');
    if (modal) {
        renderDeletedCourses();
        modal.style.display = 'flex';
    }
}

// 삭제된 강의 보기 모달 숨기기
function hideDeletedCoursesModal() {
    const modal = document.getElementById('deletedCoursesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 삭제된 강의 목록 렌더링
function renderDeletedCourses() {
    const deletedCoursesList = document.getElementById('deletedCoursesList');
    if (!deletedCoursesList) return;
    
    if (deletedCourses.length === 0) {
        deletedCoursesList.innerHTML = `
            <div class="empty-state">
                <p>삭제된 강의가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    deletedCoursesList.innerHTML = deletedCourses.map(course => `
        <div class="deleted-course-item">
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <div class="course-meta">
                    <span class="meta-item">카테고리: ${course.category}</span>
                    <span class="meta-item">삭제일시: ${course.deletedAt || '방금 전'}</span>
                </div>
            </div>
            <div class="course-actions">
                <button class="btn-secondary btn-sm" onclick="restoreCourse(${course.id})">복원</button>
                <button class="btn-danger btn-sm" onclick="permanentDeleteCourse(${course.id})">영구삭제</button>
            </div>
        </div>
    `).join('');
}

// 강의 복원
function restoreCourse(courseId) {
    if (confirm('이 강의를 복원하시겠습니까?')) {
        // deletedCourses에서 제거
        const courseIndex = deletedCourses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
            const course = deletedCourses[courseIndex];
            course.status = 'active';
            delete course.deletedAt;
            
            // courses 배열에 다시 추가
            courses.push(course);
            
            // deletedCourses에서 제거
            deletedCourses.splice(courseIndex, 1);
            
            // 목록 다시 렌더링
            renderCourses(courses);
            renderDeletedCourses();
            
            showNotification('강의가 복원되었습니다.', 'success');
        }
    }
}

// 강의 영구 삭제
function permanentDeleteCourse(courseId) {
    if (confirm('이 강의를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        // deletedCourses에서 완전 제거
        const courseIndex = deletedCourses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
            deletedCourses.splice(courseIndex, 1);
            renderDeletedCourses();
            showNotification('강의가 영구 삭제되었습니다.', 'success');
        }
    }
}

// AI 강의 추천 버튼 초기화
function initializeAICourseSuggest() {
    const aiSuggestBtn = document.getElementById('aiCourseSuggest');
    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener('click', showAICourseSuggestModal);
    }
}

// AI 강의 추천 모달 표시
function showAICourseSuggestModal() {
    // 기존 모달 제거
    const existingModal = document.querySelector('.ai-suggest-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 생성
    const modal = document.createElement('div');
    modal.className = 'ai-suggest-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>AI 강의 추천</h3>
                    <button class="close-btn" onclick="closeAICourseSuggestModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ai-suggest-content">
                        <p>AI가 분석한 강의 추천 결과입니다.</p>
                        <div class="suggested-courses">
                            <div class="suggested-course">
                                <h4>웹 개발 기초 과정</h4>
                                <p>수강생 수: 1,247명 | 평점: 4.9/5</p>
                                <span class="suggest-reason">인기 상승 중</span>
                            </div>
                            <div class="suggested-course">
                                <h4>데이터 분석 마스터 클래스</h4>
                                <p>수강생 수: 892명 | 평점: 4.8/5</p>
                                <span class="suggest-reason">트렌드 매칭</span>
                            </div>
                            <div class="suggested-course">
                                <h4>React 고급 개발</h4>
                                <p>수강생 수: 756명 | 평점: 4.7/5</p>
                                <span class="suggest-reason">기술 수요 증가</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="closeAICourseSuggestModal()">확인</button>
                </div>
            </div>
        </div>
    `;
    
    // 스타일 적용
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
    `;
    
    const modalOverlay = modal.querySelector('.modal-overlay');
    modalOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 2rem;
    `;
    
    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.style.cssText = `
        padding: 1.5rem 2rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: center;
    `;
    
    const suggestedCourses = modal.querySelector('.suggested-courses');
    suggestedCourses.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    `;
    
    const suggestedCourse = modal.querySelectorAll('.suggested-course');
    suggestedCourse.forEach(course => {
        course.style.cssText = `
            padding: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #f8fafc;
        `;
    });
    
    document.body.appendChild(modal);
}

// AI 강의 추천 모달 닫기
function closeAICourseSuggestModal() {
    const modal = document.querySelector('.ai-suggest-modal');
    if (modal) {
        modal.remove();
    }
}

// 엑셀 다운로드 버튼 초기화
function initializeExcelDownload() {
    const exportBtn = document.getElementById('exportExcel');
    if (exportBtn) {
        exportBtn.addEventListener('click', showExcelDownloadModal);
        // 초기에는 비활성화
        exportBtn.disabled = true;
        exportBtn.style.opacity = '0.5';
        exportBtn.style.pointerEvents = 'none';
    }
    
    // 체크박스 변경 이벤트 리스너 추가
    document.addEventListener('change', updateExcelDownloadButton);
}

// 엑셀 다운로드 버튼 상태 업데이트
function updateExcelDownloadButton() {
    const exportBtn = document.getElementById('exportExcel');
    if (!exportBtn) return;
    
    const checkedBoxes = document.querySelectorAll('.course-select:checked, .batch-select:checked');
    
    if (checkedBoxes.length > 0) {
        exportBtn.disabled = false;
        exportBtn.style.opacity = '1';
        exportBtn.style.pointerEvents = 'auto';
    } else {
        exportBtn.disabled = true;
        exportBtn.style.opacity = '0.5';
        exportBtn.style.pointerEvents = 'none';
    }
}

// 엑셀 다운로드 모달 표시
function showExcelDownloadModal() {
    const checkedBoxes = document.querySelectorAll('.course-select:checked, .batch-select:checked');
    if (checkedBoxes.length === 0) return;
    
    // 선택된 강의/기수 정보 수집
    const selectedItems = [];
    checkedBoxes.forEach(checkbox => {
        const courseId = checkbox.dataset.courseId || checkbox.dataset.batchId;
        const courseElement = checkbox.closest('.course-group, .batch-item');
        const title = courseElement.querySelector('.course-title, .batch-title')?.textContent || '알 수 없음';
        const type = checkbox.classList.contains('course-select') ? '강의' : '기수';
        selectedItems.push({ id: courseId, title, type });
    });
    
    // 기존 모달 제거
    const existingModal = document.querySelector('.excel-download-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 생성
    const modal = document.createElement('div');
    modal.className = 'excel-download-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>선택한 강의를 엑셀로 내려받습니다</h3>
                    <button class="close-btn" onclick="closeExcelDownloadModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>다음 ${selectedItems.length}개 항목이 다운로드됩니다:</p>
                    <div class="selected-items">
                        ${selectedItems.map(item => `
                            <div class="selected-item">
                                <span class="item-type">${item.type}</span>
                                <span class="item-title">${item.title}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeExcelDownloadModal()">취소</button>
                    <button class="btn-primary" onclick="downloadExcel()">확인</button>
                </div>
            </div>
        </div>
    `;
    
    // 스타일 적용
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
    `;
    
    const modalOverlay = modal.querySelector('.modal-overlay');
    modalOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 2rem;
    `;
    
    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.style.cssText = `
        padding: 1.5rem 2rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: center;
        gap: 1rem;
    `;
    
    const selectedItemsContainer = modal.querySelector('.selected-items');
    selectedItemsContainer.style.cssText = `
        margin-top: 1rem;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    const selectedItem = modal.querySelectorAll('.selected-item');
    selectedItem.forEach(item => {
        item.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: #f8fafc;
            border-radius: 4px;
            margin-bottom: 0.5rem;
        `;
    });
    
    document.body.appendChild(modal);
}

// 엑셀 다운로드 모달 닫기
function closeExcelDownloadModal() {
    const modal = document.querySelector('.excel-download-modal');
    if (modal) {
        modal.remove();
    }
}

// 엑셀 파일 다운로드 실행
function downloadExcel() {
    const checkedBoxes = document.querySelectorAll('.course-select:checked, .batch-select:checked');
    const selectedItems = [];
    
    checkedBoxes.forEach(checkbox => {
        const courseId = checkbox.dataset.courseId || checkbox.dataset.batchId;
        const courseElement = checkbox.closest('.course-group, .batch-item');
        const title = courseElement.querySelector('.course-title, .batch-title')?.textContent || '알 수 없음';
        const type = checkbox.classList.contains('course-select') ? '강의' : '기수';
        const students = courseElement.querySelector('.meta-item')?.textContent || '';
        const price = courseElement.querySelectorAll('.meta-item')[1]?.textContent || '';
        const date = courseElement.querySelectorAll('.meta-item')[2]?.textContent || '';
        
        selectedItems.push({
            id: courseId,
            title,
            type,
            students,
            price,
            date
        });
    });
    
    // CSV 데이터 생성
    const csvContent = generateCSV(selectedItems);
    
    // 파일 다운로드
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `강의목록_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    closeExcelDownloadModal();
    showNotification('엑셀 파일이 다운로드되었습니다.', 'success');
}

// CSV 데이터 생성
function generateCSV(data) {
    const headers = ['ID', '타입', '제목', '수강생', '가격', '날짜'];
    const csvRows = [headers.join(',')];
    
    data.forEach(item => {
        const row = [
            item.id,
            item.type,
            `"${item.title}"`,
            `"${item.students}"`,
            `"${item.price}"`,
            `"${item.date}"`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// 아코디언 토글 함수
function toggleCourseAccordion(courseId) {
    console.log('toggleCourseAccordion called with courseId:', courseId);
    
    const courseGroup = document.querySelector(`[data-course-id="${courseId}"]`);
    if (!courseGroup) {
        console.error('Course group not found for courseId:', courseId);
        return;
    }
    
    const batchList = courseGroup.querySelector('.batch-list');
    const accordionIcon = courseGroup.querySelector('.accordion-icon');
    const titleButton = courseGroup.querySelector('.course-title-button');
    
    if (!batchList || !accordionIcon || !titleButton) {
        console.error('Batch list, accordion icon, or title button not found');
        return;
    }
    
    // 현재 상태 확인 (기본적으로 숨겨져 있음)
    const isExpanded = batchList.style.display === 'block' || batchList.classList.contains('expanded');
    
    if (isExpanded) {
        // 접기
        batchList.style.display = 'none';
        batchList.classList.remove('expanded');
        batchList.classList.add('collapsed');
        accordionIcon.textContent = '▸';
        titleButton.setAttribute('aria-expanded', 'false');
    } else {
        // 펼치기
        batchList.style.display = 'block';
        batchList.classList.remove('collapsed');
        batchList.classList.add('expanded');
        accordionIcon.textContent = '▾';
        titleButton.setAttribute('aria-expanded', 'true');
    }
    
    console.log('Accordion toggled. New state:', !isExpanded ? 'expanded' : 'collapsed');
}

// 기수 삭제 함수 (soft-delete)
function deleteBatch(courseId, batchId) {
    if (confirm(`기수를 삭제하시겠습니까?`)) {
        console.log(`Deleting batch ${batchId} from course ${courseId}`);
        
        // 데이터에서 soft-delete 처리
        if (window.coursesData) {
            const course = window.coursesData.find(c => c.id === courseId);
            if (course && course.cohorts) {
                const cohort = course.cohorts.find(c => c.id === `${courseId}-${batchId}`);
                if (cohort) {
                    cohort.status = 'deleted';
                    cohort.deletedAt = new Date().toISOString();
                }
            }
        }
        
        // DOM에서 제거
        const batchElement = document.querySelector(`[data-batch-id="${courseId}-${batchId}"]`);
        if (batchElement) {
            batchElement.remove();
            showNotification('기수가 삭제되었습니다.', 'success');
        }
    }
}

// 기수 미리보기 함수
function previewBatch(courseId, batchId) {
    console.log(`Previewing batch ${batchId} from course ${courseId}`);
    showBatchDetailModal(courseId, batchId, 'view');
}

// 기수 수정 함수
function editBatch(courseId, batchId) {
    console.log(`Editing batch ${batchId} from course ${courseId}`);
    showBatchDetailModal(courseId, batchId, 'edit');
}

// 기수 상세 모달 표시
function showBatchDetailModal(courseId, batchId, mode) {
    // 기존 모달 제거
    const existingModal = document.querySelector('.batch-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 데이터 준비
    const batchData = {
        id: `${courseId}-${batchId}`,
        name: `${batchId}기`,
        students: batchId === 1 ? 45 : 32,
        price: 120000,
        startDate: '2024-12-15',
        endDate: '2025-01-15',
        status: batchId === 1 ? 'completed' : 'ongoing',
        progress: batchId === 1 ? 100 : 75
    };
    
    // 새 모달 생성
    const modal = document.createElement('div');
    modal.className = 'batch-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>기수 ${mode === 'edit' ? '수정' : '정보 확인'}</h3>
                    <button class="close-btn" onclick="closeBatchDetailModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>기수명</label>
                            <input type="text" value="${batchData.name}" ${mode === 'view' ? 'readonly' : ''} class="input-field">
                        </div>
                        <div class="detail-item">
                            <label>수강생 수</label>
                            <input type="number" value="${batchData.students}" ${mode === 'view' ? 'readonly' : ''} class="input-field">
                        </div>
                        <div class="detail-item">
                            <label>가격</label>
                            <input type="number" value="${batchData.price}" ${mode === 'view' ? 'readonly' : ''} class="input-field">
                        </div>
                        <div class="detail-item">
                            <label>시작일</label>
                            <input type="date" value="${batchData.startDate}" ${mode === 'view' ? 'readonly' : ''} class="input-field">
                        </div>
                        <div class="detail-item">
                            <label>종료일</label>
                            <input type="date" value="${batchData.endDate}" ${mode === 'view' ? 'readonly' : ''} class="input-field">
                        </div>
                        <div class="detail-item">
                            <label>상태</label>
                            <select ${mode === 'view' ? 'disabled' : ''} class="input-field">
                                <option value="scheduled" ${batchData.status === 'scheduled' ? 'selected' : ''}>예정</option>
                                <option value="ongoing" ${batchData.status === 'ongoing' ? 'selected' : ''}>진행중</option>
                                <option value="completed" ${batchData.status === 'completed' ? 'selected' : ''}>완료</option>
                            </select>
                        </div>
                        <div class="detail-item">
                            <label>진행률</label>
                            <input type="range" min="0" max="100" value="${batchData.progress}" ${mode === 'view' ? 'disabled' : ''} class="input-field">
                            <span>${batchData.progress}%</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    ${mode === 'edit' ? 
                        '<button class="btn-primary" onclick="saveBatchChanges()">저장</button>' : 
                        '<button class="btn-primary" onclick="closeBatchDetailModal()">확인</button>'
                    }
                    <button class="btn-secondary" onclick="closeBatchDetailModal()">${mode === 'edit' ? '취소' : '닫기'}</button>
                </div>
            </div>
        </div>
    `;
    
    // 스타일 적용
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
    `;
    
    const modalOverlay = modal.querySelector('.modal-overlay');
    modalOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 2rem;
    `;
    
    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.style.cssText = `
        padding: 1.5rem 2rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: center;
        gap: 1rem;
    `;
    
    const detailGrid = modal.querySelector('.detail-grid');
    detailGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    `;
    
    const detailItem = modal.querySelectorAll('.detail-item');
    detailItem.forEach(item => {
        item.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
    });
    
    document.body.appendChild(modal);
}

// 기수 상세 모달 닫기
function closeBatchDetailModal() {
    const modal = document.querySelector('.batch-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// 기수 변경사항 저장
function saveBatchChanges() {
    console.log('Saving batch changes');
    showNotification('기수 정보가 저장되었습니다.', 'success');
    closeBatchDetailModal();
}

// 등록 패널 표시
function showRegistrationPanel() {
    const panel = document.getElementById('registrationPanel');
    if (panel) {
        panel.style.display = 'block';
        // 부드러운 스크롤
        requestAnimationFrame(() => {
            panel.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    }
}

// 등록 패널 닫기
function closeRegistrationPanel() {
    const panel = document.getElementById('registrationPanel');
    if (panel) {
        panel.style.display = 'none';
        // 폼 초기화
        const form = document.getElementById('registrationForm');
        if (form) {
            form.reset();
        }
    }
}

// 강의 임시저장
function saveCourseDraft() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const courseData = {
        title: form.querySelector('input[placeholder="강의명"]').value,
        category: form.querySelector('input[placeholder="카테고리"]').value,
        instructor: form.querySelector('input[placeholder="담당 강사"]').value,
        description: form.querySelector('textarea').value,
        price: form.querySelector('input[placeholder="가격 (원)"]').value,
        format: form.querySelector('select').value
    };
    
    // 로컬 스토리지에 저장
    localStorage.setItem('courseDraft', JSON.stringify(courseData));
    
    showNotification('강의가 임시저장되었습니다.', 'success');
}

// 강의 등록 완료
function registerCourse() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    // 폼 유효성 검사
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const courseData = {
        id: Date.now(), // 임시 ID
        title: form.querySelector('input[placeholder="강의명"]').value,
        category: form.querySelector('input[placeholder="카테고리"]').value,
        instructor: form.querySelector('input[placeholder="담당 강사"]').value,
        description: form.querySelector('textarea').value,
        price: parseInt(form.querySelector('input[placeholder="가격 (원)"]').value),
        format: form.querySelector('select').value,
        status: 'draft',
        students: 0,
        rating: null,
        date: new Date().toISOString().split('T')[0],
        cohorts: []
    };
    
    // 기존 강의 목록에 추가
    if (window.coursesData) {
        window.coursesData.unshift(courseData);
        window.filteredCourses = window.coursesData;
        renderCourses(window.filteredCourses);
    }
    
    // 로컬 스토리지에서 임시저장 데이터 제거
    localStorage.removeItem('courseDraft');
    
    showNotification('강의가 등록되었습니다.', 'success');
    closeRegistrationPanel();
}

// 임시저장된 강의 데이터 복원
function restoreCourseDraft() {
    const draftData = localStorage.getItem('courseDraft');
    if (draftData) {
        try {
            const courseData = JSON.parse(draftData);
            const form = document.getElementById('registrationForm');
            if (form) {
                form.querySelector('input[placeholder="강의명"]').value = courseData.title || '';
                form.querySelector('input[placeholder="카테고리"]').value = courseData.category || '';
                form.querySelector('input[placeholder="담당 강사"]').value = courseData.instructor || '';
                form.querySelector('textarea').value = courseData.description || '';
                form.querySelector('input[placeholder="가격 (원)"]').value = courseData.price || '';
                form.querySelector('select').value = courseData.format || '';
            }
        } catch (error) {
            console.error('Failed to restore course draft:', error);
            localStorage.removeItem('courseDraft');
        }
    }
}
