// 로컬스토리지 기반 데이터 저장 관리
class StorageManager {
    constructor() {
        this.storageKey = 'soberAppData';
        this.defaultData = {
            startDate: null,
            goalDays: 30,
            weeklySpending: 0,
            temptations: [],
            milestones: [],
            lastUpdate: null
        };
        this.data = this.loadData();
    }

    // 데이터 로드
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...this.defaultData, ...parsed };
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }
        return { ...this.defaultData };
    }

    // 데이터 저장
    saveData() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('데이터 저장 실패:', error);
            return false;
        }
    }

    // 금주 시작일 설정
    setStartDate(date) {
        this.data.startDate = date;
        this.saveData();
    }

    // 목표 일수 설정
    setGoalDays(days) {
        this.data.goalDays = days;
        this.saveData();
    }

    // 주간 지출 설정
    setWeeklySpending(amount) {
        this.data.weeklySpending = amount;
        this.saveData();
    }

    // 유혹 기록 추가
    addTemptation(temptationData) {
        const temptation = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...temptationData
        };
        this.data.temptations.push(temptation);
        this.saveData();
        return temptation;
    }

    // 유혹 기록 가져오기
    getTemptations() {
        return this.data.temptations;
    }

    // 이번 주 유혹 횟수
    getWeeklyTemptations() {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        weekStart.setHours(0, 0, 0, 0);
        
        return this.data.temptations.filter(t => {
            const temptationDate = new Date(t.date);
            return temptationDate >= weekStart;
        }).length;
    }

    // 마일스톤 추가
    addMilestone(milestone) {
        this.data.milestones.push({
            id: Date.now(),
            date: new Date().toISOString(),
            ...milestone
        });
        this.saveData();
    }

    // 마일스톤 가져오기
    getMilestones() {
        return this.data.milestones;
    }

    // 금주 일수 계산
    getSoberDays() {
        if (!this.data.startDate) return 0;
        
        const startDate = new Date(this.data.startDate);
        const today = new Date();
        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, diffDays);
    }

    // 절감 금액 계산
    getSavedAmount() {
        if (!this.data.weeklySpending || !this.data.startDate) return 0;
        
        const soberDays = this.getSoberDays();
        const dailySpending = this.data.weeklySpending / 7;
        return Math.floor(soberDays * dailySpending);
    }

    // 데이터 초기화
    resetData() {
        this.data = { ...this.defaultData };
        this.saveData();
    }

    // 전체 데이터 가져오기
    getAllData() {
        return { ...this.data };
    }
}

// 전역 스토리지 매니저 인스턴스
const storage = new StorageManager();