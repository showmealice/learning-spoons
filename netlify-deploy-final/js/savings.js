// 비용 절감 계산기 관리 클래스
class SavingsCalculator {
    constructor() {
        this.bindEvents();
    }

    // 이벤트 바인딩
    bindEvents() {
        const calculateBtn = document.getElementById('calculate-savings');
        const calculateSavingsBtn = document.getElementById('calculate-btn');

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.showCalculatorSection());
        }

        if (calculateSavingsBtn) {
            calculateSavingsBtn.addEventListener('click', () => this.calculateSavings());
        }
    }

    // 계산기 섹션 표시
    showCalculatorSection() {
        const section = document.getElementById('calculator-section');
        if (section) {
            section.style.display = 'block';
            section.classList.add('fade-in');
            
            // 다른 섹션들 숨기기
            this.hideOtherSections();
            
            // 기존 입력값 로드
            this.loadSavedValues();
        }
    }

    // 계산기 섹션 숨기기
    hideCalculatorSection() {
        const section = document.getElementById('calculator-section');
        if (section) {
            section.style.display = 'none';
        }
    }

    // 다른 섹션들 숨기기
    hideOtherSections() {
        const sections = [
            'temptation-section',
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

    // 저장된 값 로드
    loadSavedValues() {
        const stats = storageManager.getStats();
        if (stats && stats.weeklyCost) {
            const weeklyCostInput = document.getElementById('weekly-cost');
            if (weeklyCostInput) {
                weeklyCostInput.value = stats.weeklyCost;
            }
        }
    }

    // 절감 금액 계산
    calculateSavings() {
        const weeklyCostInput = document.getElementById('weekly-cost');
        const weeklyCost = parseInt(weeklyCostInput.value) || 0;

        if (weeklyCost <= 0) {
            this.showMessage('올바른 주 평균 비용을 입력해주세요.', 'error');
            return;
        }

        // 주 평균 비용 저장
        storageManager.setWeeklyCost(weeklyCost);

        // 절감 금액 계산
        const stats = storageManager.getStats();
        const totalDays = stats ? stats.totalDays : 0;
        const dailyCost = weeklyCost / 7;
        const totalSavings = Math.floor(dailyCost * totalDays);

        // 결과 표시
        this.displayCalculationResult(totalSavings, weeklyCost, totalDays);
        
        // 성공 메시지
        this.showMessage('절감 금액이 계산되었습니다! 💰', 'success');
    }

    // 계산 결과 표시
    displayCalculationResult(totalSavings, weeklyCost, totalDays) {
        const resultDiv = document.getElementById('calculation-result');
        const calculatedSavings = document.getElementById('calculated-savings');
        
        if (resultDiv && calculatedSavings) {
            // 애니메이션과 함께 금액 표시
            this.animateNumber(calculatedSavings, totalSavings);
            resultDiv.style.display = 'block';
        }

        // 메인 요약 섹션도 업데이트
        this.updateSummarySavings(totalSavings);
    }

    // 숫자 애니메이션
    animateNumber(element, finalValue) {
        const duration = 1000; // 1초
        const startValue = 0;
        const increment = finalValue / (duration / 16); // 60fps
        let currentValue = startValue;

        const animate = () => {
            currentValue += increment;
            if (currentValue < finalValue) {
                element.textContent = `₩${Math.floor(currentValue).toLocaleString()}`;
                requestAnimationFrame(animate);
            } else {
                element.textContent = `₩${finalValue.toLocaleString()}`;
            }
        };

        animate();
    }

    // 요약 섹션 절감 금액 업데이트
    updateSummarySavings(savings) {
        const summarySavings = document.getElementById('savings');
        if (summarySavings) {
            summarySavings.textContent = `₩${savings.toLocaleString()}`;
        }
    }

    // 상세 절감 분석
    getDetailedSavingsAnalysis() {
        const stats = storageManager.getStats();
        if (!stats) return null;

        const weeklyCost = stats.weeklyCost || 0;
        const totalDays = stats.totalDays || 0;
        const dailyCost = weeklyCost / 7;
        const totalSavings = Math.floor(dailyCost * totalDays);

        // 목표 달성률 계산
        const goalSavingsPercent = stats.goalSavingsPercent || 50;
        const monthlyGoal = (weeklyCost * 4) * (goalSavingsPercent / 100);
        const achievementRate = monthlyGoal > 0 ? Math.min((totalSavings / monthlyGoal) * 100, 100) : 0;

        // 예상 연간 절감액
        const yearlySavings = Math.floor(dailyCost * 365);

        // 카테고리별 절감 분석
        const categorySavings = this.calculateCategorySavings(weeklyCost);

        return {
            totalSavings,
            dailySavings: Math.floor(dailyCost),
            weeklySavings: weeklyCost,
            monthlySavings: Math.floor(dailyCost * 30),
            yearlySavings,
            achievementRate: Math.round(achievementRate),
            categorySavings,
            goalSavingsPercent,
            monthlyGoal: Math.floor(monthlyGoal)
        };
    }

    // 카테고리별 절감 분석
    calculateCategorySavings(weeklyCost) {
        // 일반적인 음주 비용 분포 (예시)
        const categories = {
            '술집/바': Math.floor(weeklyCost * 0.6),
            '편의점/마트': Math.floor(weeklyCost * 0.25),
            '기타': Math.floor(weeklyCost * 0.15)
        };

        return categories;
    }

    // 절감 목표 설정 및 추적
    setSavingsGoal(goalPercent) {
        storageManager.setGoalSavingsPercent(goalPercent);
        
        const analysis = this.getDetailedSavingsAnalysis();
        if (analysis) {
            this.showMessage(`절감 목표가 ${goalPercent}%로 설정되었습니다!`, 'success');
        }
    }

    // 절감 추천사항 생성
    generateSavingsRecommendations() {
        const analysis = this.getDetailedSavingsAnalysis();
        if (!analysis) return [];

        const recommendations = [];

        if (analysis.achievementRate < 50) {
            recommendations.push('목표 달성률이 낮습니다. 더 적극적인 금주를 시도해보세요.');
        } else if (analysis.achievementRate < 80) {
            recommendations.push('좋은 진행상황입니다! 목표 달성을 위해 조금만 더 노력해보세요.');
        } else {
            recommendations.push('훌륭합니다! 목표를 초과 달성하고 있습니다.');
        }

        if (analysis.weeklySavings > 100000) {
            recommendations.push('주 평균 비용이 높습니다. 소규모 모임으로 시작해보세요.');
        }

        if (analysis.totalSavings > 1000000) {
            recommendations.push('100만원 이상 절약했습니다! 이 돈으로 하고 싶었던 일을 해보세요.');
        }

        return recommendations;
    }

    // 절감 히스토리 차트 데이터
    getSavingsChartData() {
        const stats = storageManager.getStats();
        if (!stats || !stats.startDate) return null;

        const startDate = new Date(stats.startDate);
        const today = new Date();
        const weeklyCost = stats.weeklyCost || 0;
        const dailyCost = weeklyCost / 7;

        const chartData = [];
        let currentDate = new Date(startDate);

        while (currentDate <= today) {
            const daysSinceStart = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
            const savings = Math.floor(dailyCost * daysSinceStart);
            
            chartData.push({
                date: currentDate.toISOString().split('T')[0],
                savings: savings,
                day: daysSinceStart
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return chartData;
    }

    // 절감 통계 요약
    getSavingsSummary() {
        const analysis = this.getDetailedSavingsAnalysis();
        if (!analysis) return null;

        return {
            totalSavings: analysis.totalSavings,
            achievementRate: analysis.achievementRate,
            nextMilestone: this.getNextSavingsMilestone(analysis.totalSavings),
            recommendations: this.generateSavingsRecommendations()
        };
    }

    // 다음 절감 목표 확인
    getNextSavingsMilestone(currentSavings) {
        const milestones = [10000, 50000, 100000, 500000, 1000000];
        const nextMilestone = milestones.find(milestone => milestone > currentSavings);
        
        if (!nextMilestone) return null;
        
        return {
            amount: nextMilestone,
            remaining: nextMilestone - currentSavings,
            daysToReach: Math.ceil((nextMilestone - currentSavings) / (currentSavings > 0 ? currentSavings / storageManager.getStats().totalDays : 0))
        };
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
const savingsCalculator = new SavingsCalculator();
