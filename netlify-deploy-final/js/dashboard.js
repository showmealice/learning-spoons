// 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // 통계 데이터 로드
    loadDashboardStats();
    
    // 차트 초기화 제거됨
    
    // 최근 활동 로드
    loadRecentActivity();
    
    // 캘린더 기능 초기화
    initializeCalendar();
    
    // 새로고침 버튼 이벤트
    const refreshBtn = document.querySelector('.btn-secondary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }
}

// 대시보드 통계 로드
function loadDashboardStats() {
    // 실제로는 API에서 데이터를 가져와야 하지만, 여기서는 모의 데이터 사용
    const stats = {
        totalCourses: 24,
        totalStudents: 1247,
        monthlyRevenue: 12450000,
        averageRating: 4.8
    };
    
    // 통계 업데이트
    updateStatValue('totalCourses', stats.totalCourses);
    updateStatValue('totalStudents', stats.totalStudents.toLocaleString());
    updateStatValue('monthlyRevenue', '₩' + stats.monthlyRevenue.toLocaleString());
    updateStatValue('averageRating', stats.averageRating);
}

// 통계 값 업데이트 (애니메이션과 함께)
function updateStatValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // 숫자 애니메이션
    if (typeof value === 'number') {
        animateNumber(element, 0, value, 1000);
    } else {
        element.textContent = value;
    }
}

// 숫자 애니메이션
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/* 차트 관련 함수들 제거됨 */

/* KPI 차트 함수 제거됨 */

// 수강생 증가 차트 초기화
function initializeStudentChart() {
    const chartBars = document.querySelectorAll('.chart-bars .bar');
    const chartData = [120, 150, 180, 160, 200, 220]; // 6개월 데이터
    
    chartBars.forEach((bar, index) => {
        if (chartData[index]) {
            const percentage = (chartData[index] / 250) * 100; // 최대값 250으로 정규화
            bar.style.height = percentage + '%';
            
            // 호버 효과
            bar.addEventListener('mouseenter', function() {
                showTooltip(this, chartData[index] + '명');
            });
            
            bar.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        }
    });
    
    // 차트 컨트롤 버튼 이벤트
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 실제로는 여기서 다른 데이터를 로드해야 함
            console.log('차트 기간 변경:', this.textContent);
        });
    });
}

// 툴팁 표시
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        transform: translateX(-50%);
        bottom: 100%;
        margin-bottom: 0.5rem;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
}

// 툴팁 숨기기
function hideTooltip() {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 최근 활동 로드
function loadRecentActivity() {
    // 실제로는 API에서 데이터를 가져와야 하지만, 여기서는 모의 데이터 사용
    const activities = [
        {
            icon: '📚',
            text: '새로운 강의 "Node.js 백엔드 개발"이 등록되었습니다.',
            time: '2시간 전'
        },
        {
            icon: '👥',
            text: '89명의 새로운 수강생이 가입했습니다.',
            time: '4시간 전'
        },
        {
            icon: '💬',
            text: '"웹 개발 기초 과정"에 새로운 리뷰가 등록되었습니다.',
            time: '6시간 전'
        },
        {
            icon: '💰',
            text: '이번 주 수익이 목표를 달성했습니다.',
            time: '1일 전'
        }
    ];
    
    // 활동 목록 업데이트
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// 대시보드 새로고침
function refreshDashboard() {
    const refreshBtn = document.querySelector('.btn-secondary');
    const originalText = refreshBtn.textContent;
    
    // 로딩 상태 표시
    refreshBtn.textContent = '새로고침 중...';
    refreshBtn.disabled = true;
    
    // 실제로는 API 호출
    setTimeout(() => {
        loadDashboardStats();
        loadRecentActivity();
        
        // 버튼 상태 복원
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
        
        // 성공 메시지 표시
        showNotification('대시보드가 새로고침되었습니다.', 'success');
    }, 1500);
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

// 실시간 업데이트 (선택사항)
function startRealTimeUpdates() {
    // 30초마다 통계 업데이트
    setInterval(() => {
        // 실제로는 WebSocket이나 Server-Sent Events 사용
        console.log('실시간 업데이트 체크...');
    }, 30000);
}

// 캘린더 기능 초기화
function initializeCalendar() {
    const calendarBtn = document.getElementById('calendarBtn');
    const calendarModal = document.getElementById('calendarModal');
    const closeCalendarModal = document.getElementById('closeCalendarModal');
    const openGoogleCalendar = document.getElementById('openGoogleCalendar');
    const syncCalendar = document.getElementById('syncCalendar');
    
    // 캘린더 버튼 클릭 이벤트
    if (calendarBtn) {
        calendarBtn.addEventListener('click', function() {
            if (calendarModal) {
                calendarModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // 모달 닫기 이벤트
    if (closeCalendarModal) {
        closeCalendarModal.addEventListener('click', function() {
            if (calendarModal) {
                calendarModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // 모달 외부 클릭 시 닫기
    if (calendarModal) {
        calendarModal.addEventListener('click', function(e) {
            if (e.target === calendarModal) {
                calendarModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // 구글 캘린더 열기
    if (openGoogleCalendar) {
        openGoogleCalendar.addEventListener('click', function() {
            window.open('https://calendar.google.com', '_blank');
        });
    }
    
    // 캘린더 동기화
    if (syncCalendar) {
        syncCalendar.addEventListener('click', function() {
            syncCalendar.textContent = '동기화 중...';
            syncCalendar.disabled = true;
            
            // 실제로는 API 호출
            setTimeout(() => {
                syncCalendar.textContent = '동기화 완료';
                syncCalendar.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    syncCalendar.textContent = '동기화';
                    syncCalendar.disabled = false;
                    syncCalendar.style.backgroundColor = '';
                }, 2000);
                
                showNotification('캘린더가 동기화되었습니다.', 'success');
            }, 2000);
        });
    }
}

// 페이지 로드 시 실시간 업데이트 시작
// startRealTimeUpdates();
