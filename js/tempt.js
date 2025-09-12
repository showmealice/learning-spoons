// 유혹 기록 관리 클래스
class TemptationManager {
    constructor() {
        this.bindEvents();
    }

    // 이벤트 바인딩
    bindEvents() {
        const recordBtn = document.getElementById('record-temptation');
        const yesBtn = document.getElementById('yes-temptation');
        const noBtn = document.getElementById('no-temptation');

        if (recordBtn) {
            recordBtn.addEventListener('click', () => this.showTemptationSection());
        }

        if (yesBtn) {
            yesBtn.addEventListener('click', () => this.recordTemptation());
        }

        if (noBtn) {
            noBtn.addEventListener('click', () => this.hideTemptationSection());
        }
    }

    // 유혹 기록 섹션 표시
    showTemptationSection() {
        const section = document.getElementById('temptation-section');
        if (section) {
            section.style.display = 'block';
            section.classList.add('fade-in');
            
            // 다른 섹션들 숨기기
            this.hideOtherSections();
        }
    }

    // 유혹 기록 섹션 숨기기
    hideTemptationSection() {
        const section = document.getElementById('temptation-section');
        if (section) {
            section.style.display = 'none';
        }
    }

    // 다른 섹션들 숨기기
    hideOtherSections() {
        const sections = [
            'calculator-section',
            'coaching-section',
            'settings-panel'
        ];

        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // 유혹 기록 추가
    recordTemptation() {
        const today = new Date();
        const todayString = today.toDateString();
        
        // 오늘 이미 기록했는지 확인
        if (storageManager.hasTemptationOnDate(today)) {
            this.showMessage('오늘은 이미 유혹을 기록했습니다.', 'info');
            return;
        }

        // 유혹 기록 저장
        if (storageManager.addTemptation()) {
            this.showMessage('유혹을 기록했습니다. 힘내세요! 💪', 'success');
            
            // UI 업데이트
            this.updateTemptationUI();
            streakManager.updateStreakUI();
            
            // 섹션 숨기기
            this.hideTemptationSection();
        } else {
            this.showMessage('기록 저장에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    }

    // 유혹 기록 UI 업데이트
    updateTemptationUI() {
        const temptationCount = storageManager.getTemptationCount();
        
        // 유혹 횟수를 요약 섹션에 표시 (선택사항)
        // 필요에 따라 추가 UI 업데이트 로직 구현
    }

    // 유혹 통계 가져오기
    getTemptationStats() {
        const temptations = storageManager.getTemptations();
        const today = new Date();
        
        // 최근 7일간의 유혹 기록
        const last7Days = temptations.filter(temptation => {
            const temptationDate = new Date(temptation.date);
            const diffTime = Math.abs(today - temptationDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        });

        // 월별 유혹 기록
        const monthlyStats = this.getMonthlyStats(temptations);
        
        return {
            total: temptations.length,
            last7Days: last7Days.length,
            monthlyStats,
            averagePerWeek: this.calculateAveragePerWeek(temptations)
        };
    }

    // 월별 통계 계산
    getMonthlyStats(temptations) {
        const monthlyData = {};
        
        temptations.forEach(temptation => {
            const date = new Date(temptation.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }
            monthlyData[monthKey]++;
        });
        
        return monthlyData;
    }

    // 주 평균 유혹 횟수 계산
    calculateAveragePerWeek(temptations) {
        if (temptations.length === 0) return 0;
        
        const firstTemptation = new Date(temptations[0].date);
        const today = new Date();
        const totalWeeks = Math.ceil((today - firstTemptation) / (1000 * 60 * 60 * 24 * 7));
        
        return totalWeeks > 0 ? (temptations.length / totalWeeks).toFixed(1) : temptations.length;
    }

    // 유혹 패턴 분석
    analyzeTemptationPatterns() {
        const temptations = storageManager.getTemptations();
        
        if (temptations.length === 0) {
            return {
                message: '아직 유혹 기록이 없습니다.',
                pattern: 'none'
            };
        }

        // 요일별 패턴 분석
        const dayOfWeekStats = this.getDayOfWeekStats(temptations);
        
        // 시간대별 패턴 분석
        const timeOfDayStats = this.getTimeOfDayStats(temptations);
        
        // 가장 유혹이 많은 요일과 시간
        const mostTemptingDay = this.getMostTemptingDay(dayOfWeekStats);
        const mostTemptingTime = this.getMostTemptingTime(timeOfDayStats);
        
        return {
            dayOfWeekStats,
            timeOfDayStats,
            mostTemptingDay,
            mostTemptingTime,
            recommendation: this.generateRecommendation(mostTemptingDay, mostTemptingTime)
        };
    }

    // 요일별 통계
    getDayOfWeekStats(temptations) {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const stats = {};
        
        dayNames.forEach(day => {
            stats[day] = 0;
        });
        
        temptations.forEach(temptation => {
            const date = new Date(temptation.date);
            const dayName = dayNames[date.getDay()];
            stats[dayName]++;
        });
        
        return stats;
    }

    // 시간대별 통계
    getTimeOfDayStats(temptations) {
        const timeSlots = {
            '새벽 (00-06)': 0,
            '아침 (06-12)': 0,
            '점심 (12-18)': 0,
            '저녁 (18-24)': 0
        };
        
        temptations.forEach(temptation => {
            const date = new Date(temptation.date);
            const hour = date.getHours();
            
            if (hour >= 0 && hour < 6) {
                timeSlots['새벽 (00-06)']++;
            } else if (hour >= 6 && hour < 12) {
                timeSlots['아침 (06-12)']++;
            } else if (hour >= 12 && hour < 18) {
                timeSlots['점심 (12-18)']++;
            } else {
                timeSlots['저녁 (18-24)']++;
            }
        });
        
        return timeSlots;
    }

    // 가장 유혹이 많은 요일
    getMostTemptingDay(dayStats) {
        let maxDay = null;
        let maxCount = 0;
        
        Object.entries(dayStats).forEach(([day, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxDay = day;
            }
        });
        
        return { day: maxDay, count: maxCount };
    }

    // 가장 유혹이 많은 시간대
    getMostTemptingTime(timeStats) {
        let maxTime = null;
        let maxCount = 0;
        
        Object.entries(timeStats).forEach(([time, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxTime = time;
            }
        });
        
        return { time: maxTime, count: maxCount };
    }

    // 개인화된 권장사항 생성
    generateRecommendation(mostTemptingDay, mostTemptingTime) {
        const recommendations = [];
        
        if (mostTemptingDay.count > 0) {
            recommendations.push(`${mostTemptingDay.day}요일에 특히 주의하세요.`);
        }
        
        if (mostTemptingTime.count > 0) {
            recommendations.push(`${mostTemptingTime.time}에 유혹이 많습니다.`);
        }
        
        if (recommendations.length === 0) {
            recommendations.push('규칙적인 패턴을 유지하고 있습니다. 잘하고 있어요!');
        }
        
        return recommendations;
    }

    // 메시지 표시
    showMessage(text, type = 'info') {
        // 기존 메시지 제거
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 새 메시지 생성
        const message = document.createElement('div');
        message.className = `message ${type}-message`;
        message.textContent = text;
        
        // 메시지 삽입
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(message, container.firstChild);
            
            // 3초 후 자동 제거
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 3000);
        }
    }
}

// 전역 인스턴스 생성
const temptationManager = new TemptationManager();
