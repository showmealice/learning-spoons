// Streak 계산 및 배지 관리 클래스
class StreakManager {
    constructor() {
        this.milestones = [7, 14, 30, 60, 90, 180, 365];
        this.badgeEmojis = ['🔥', '💪', '🎯', '🏆', '👑', '💎', '🌟'];
    }

    // 현재 streak 계산
    calculateCurrentStreak() {
        const temptations = storageManager.getTemptations();
        const today = new Date();
        
        if (temptations.length === 0) {
            // 유혹 기록이 없으면 시작일부터 계산
            const stats = storageManager.getStats();
            if (stats && stats.startDate) {
                return this.calculateDaysFromStart(stats.startDate);
            }
            return 0;
        }

        // 유혹 기록이 있으면 마지막 유혹 이후부터 계산
        const sortedTemptations = temptations.sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastTemptation = new Date(sortedTemptations[0].date);
        
        const diffTime = Math.abs(today - lastTemptation);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }

    // 시작일부터의 총 일수 계산
    calculateDaysFromStart(startDate) {
        const today = new Date();
        const start = new Date(startDate);
        
        const diffTime = Math.abs(today - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 달성된 milestone 확인
    getAchievedMilestones() {
        const currentStreak = this.calculateCurrentStreak();
        return this.milestones.filter(milestone => currentStreak >= milestone);
    }

    // 다음 milestone까지 남은 일수
    getNextMilestone() {
        const currentStreak = this.calculateCurrentStreak();
        const nextMilestone = this.milestones.find(milestone => milestone > currentStreak);
        
        if (!nextMilestone) return null;
        
        return {
            days: nextMilestone,
            remaining: nextMilestone - currentStreak,
            emoji: this.badgeEmojis[this.milestones.indexOf(nextMilestone)]
        };
    }

    // 새로운 milestone 달성 확인
    checkNewMilestones() {
        const currentStreak = this.calculateCurrentStreak();
        const achievedMilestones = this.getAchievedMilestones();
        
        // 이전에 달성하지 못했던 milestone이 새로 달성되었는지 확인
        const previousAchievements = this.getPreviousAchievements();
        const newMilestones = achievedMilestones.filter(milestone => 
            !previousAchievements.includes(milestone)
        );
        
        if (newMilestones.length > 0) {
            // 새로운 milestone 달성 시 confetti 효과
            this.triggerConfetti();
            this.saveAchievements(achievedMilestones);
        }
        
        return newMilestones;
    }

    // 이전 달성 기록 가져오기
    getPreviousAchievements() {
        const data = storageManager.getData();
        return data ? (data.achievements || []) : [];
    }

    // 달성 기록 저장
    saveAchievements(achievements) {
        const data = storageManager.getData();
        if (data) {
            data.achievements = achievements;
            storageManager.saveData(data);
        }
    }

    // Confetti 효과 트리거
    triggerConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        // 기존 confetti 제거
        container.innerHTML = '';

        // 새로운 confetti 생성
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti(container);
            }, i * 50);
        }
    }

    // 개별 confetti 생성
    createConfetti(container) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // 랜덤 색상
        const colors = ['#FF6B35', '#2ECC71', '#3498DB', '#F1C40F', '#9B59B6'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // 랜덤 위치
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(confetti);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }

    // Streak 통계 정보
    getStreakStats() {
        const currentStreak = this.calculateCurrentStreak();
        const totalDays = this.calculateTotalDays();
        const achievedMilestones = this.getAchievedMilestones();
        const nextMilestone = this.getNextMilestone();
        
        return {
            currentStreak,
            totalDays,
            achievedMilestones,
            nextMilestone,
            isOnTrack: this.isOnTrack(),
            motivation: this.getMotivationMessage(currentStreak)
        };
    }

    // 총 금주 일수 계산
    calculateTotalDays() {
        const stats = storageManager.getStats();
        if (stats && stats.startDate) {
            return this.calculateDaysFromStart(stats.startDate);
        }
        return 0;
    }

    // 목표 달성 여부 확인
    isOnTrack() {
        const stats = storageManager.getStats();
        if (!stats || !stats.startDate) return false;
        
        const currentStreak = this.calculateCurrentStreak();
        const goalDays = stats.goalDays || 30;
        
        return currentStreak >= goalDays;
    }

    // 동기부여 메시지 생성
    getMotivationMessage(streak) {
        if (streak === 0) {
            return "오늘부터 시작해보세요! 첫 걸음이 가장 중요합니다.";
        } else if (streak < 7) {
            return "잘하고 있어요! 일주일만 더 버티면 첫 번째 milestone입니다.";
        } else if (streak < 30) {
            return "정말 대단해요! 한 달 목표까지 얼마 남지 않았습니다.";
        } else if (streak < 90) {
            return "3개월! 이제 습관이 되고 있어요. 계속 가세요!";
        } else {
            return "정말 놀라워요! 당신은 이미 금주 마스터입니다!";
        }
    }

    // 배지 HTML 생성
    generateBadgeHTML(milestone) {
        const emojiIndex = this.milestones.indexOf(milestone);
        const emoji = emojiIndex >= 0 ? this.badgeEmojis[emojiIndex] : '🏅';
        
        return `<div class="badge">${emoji} ${milestone}일 달성!</div>`;
    }

    // 모든 배지 HTML 생성
    generateAllBadgesHTML() {
        const achievedMilestones = this.getAchievedMilestones();
        return achievedMilestones.map(milestone => this.generateBadgeHTML(milestone)).join('');
    }

    // Streak UI 업데이트
    updateStreakUI() {
        const streakCount = document.getElementById('streak-count');
        const milestoneBadges = document.getElementById('milestone-badges');
        
        if (streakCount) {
            streakCount.textContent = this.calculateCurrentStreak();
        }
        
        if (milestoneBadges) {
            milestoneBadges.innerHTML = this.generateAllBadgesHTML();
        }
        
        // 새로운 milestone 확인
        this.checkNewMilestones();
    }
}

// 전역 인스턴스 생성
const streakManager = new StreakManager();
