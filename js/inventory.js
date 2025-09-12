// 인벤토리 관리 클래스
class InventoryManager {
    constructor() {
        this.categories = {
            beer: { name: '맥주', emoji: '🍺', color: 'beer' },
            wine: { name: '와인', emoji: '🍷', color: 'wine' },
            spirits: { name: '증류주', emoji: '🥃', color: 'spirits' },
            soju: { name: '소주', emoji: '🍶', color: 'soju' },
            accessories: { name: '기타 용품', emoji: '🥤', color: 'accessories' }
        };
        
        this.estimatedPrices = {
            beer: 3000,
            wine: 25000,
            spirits: 50000,
            soju: 5000,
            accessories: 10000
        };
        
        this.bindEvents();
        this.loadInventory();
    }

    // 이벤트 바인딩
    bindEvents() {
        const inventoryBtn = document.getElementById('inventory-manager');
        const addItemBtn = document.getElementById('add-item-btn');
        const clearInventoryBtn = document.getElementById('clear-inventory-btn');
        const exportInventoryBtn = document.getElementById('export-inventory-btn');

        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.showInventorySection());
        }

        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.addItem());
        }

        if (clearInventoryBtn) {
            clearInventoryBtn.addEventListener('click', () => this.clearInventory());
        }

        if (exportInventoryBtn) {
            exportInventoryBtn.addEventListener('click', () => this.exportInventory());
        }
    }

    // 인벤토리 섹션 표시
    showInventorySection() {
        const section = document.getElementById('inventory-section');
        if (section) {
            section.style.display = 'block';
            section.classList.add('fade-in');
            
            // 다른 섹션들 숨기기
            this.hideOtherSections();
            
            // 인벤토리 UI 업데이트
            this.updateInventoryUI();
        }
    }

    // 인벤토리 섹션 숨기기
    hideInventorySection() {
        const section = document.getElementById('inventory-section');
        if (section) {
            section.style.display = 'none';
        }
    }

    // 다른 섹션들 숨기기
    hideOtherSections() {
        const sections = [
            'temptation-section',
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

    // 물품 추가
    addItem() {
        const nameInput = document.getElementById('item-name');
        const quantityInput = document.getElementById('item-quantity');
        const typeInput = document.getElementById('item-type');
        const expiryInput = document.getElementById('item-expiry');

        const name = nameInput.value.trim();
        const quantity = parseInt(quantityInput.value) || 1;
        const type = typeInput.value;
        const expiry = expiryInput.value || null;

        if (!name) {
            this.showMessage('물품명을 입력해주세요.', 'error');
            return;
        }

        if (quantity <= 0) {
            this.showMessage('수량은 1개 이상이어야 합니다.', 'error');
            return;
        }

        // 새 물품 생성
        const newItem = {
            id: Date.now().toString(),
            name: name,
            quantity: quantity,
            type: type,
            expiry: expiry,
            addedDate: new Date().toISOString(),
            estimatedPrice: this.estimatedPrices[type] || 10000
        };

        // 인벤토리에 추가
        this.addToInventory(newItem);

        // 폼 초기화
        nameInput.value = '';
        quantityInput.value = '1';
        typeInput.value = 'beer';
        expiryInput.value = '';

        // 성공 메시지
        this.showMessage(`${name}이(가) 인벤토리에 추가되었습니다! 📦`, 'success');

        // UI 업데이트
        this.updateInventoryUI();
    }

    // 인벤토리에 물품 추가
    addToInventory(item) {
        const inventory = this.getInventory();
        inventory.push(item);
        this.saveInventory(inventory);
    }

    // 물품 수정
    editItem(itemId) {
        const inventory = this.getInventory();
        const itemIndex = inventory.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;

        const item = inventory[itemIndex];
        
        // 수정 폼 표시 (간단한 프롬프트 사용)
        const newName = prompt('물품명을 수정하세요:', item.name);
        if (newName === null) return;
        
        const newQuantity = prompt('수량을 수정하세요:', item.quantity);
        if (newQuantity === null) return;
        
        const newType = prompt('카테고리를 수정하세요 (beer/wine/spirits/soju/accessories):', item.type);
        if (newType === null) return;

        // 유효성 검사
        if (!newName.trim() || !this.categories[newType]) {
            this.showMessage('잘못된 입력입니다.', 'error');
            return;
        }

        // 물품 업데이트
        inventory[itemIndex] = {
            ...item,
            name: newName.trim(),
            quantity: parseInt(newQuantity) || 1,
            type: newType,
            estimatedPrice: this.estimatedPrices[newType] || 10000
        };

        this.saveInventory(inventory);
        this.updateInventoryUI();
        this.showMessage('물품이 수정되었습니다! ✏️', 'success');
    }

    // 물품 삭제
    deleteItem(itemId) {
        if (!confirm('정말로 이 물품을 삭제하시겠습니까?')) return;

        const inventory = this.getInventory();
        const filteredInventory = inventory.filter(item => item.id !== itemId);
        
        this.saveInventory(filteredInventory);
        this.updateInventoryUI();
        this.showMessage('물품이 삭제되었습니다! 🗑️', 'success');
    }

    // 인벤토리 전체 삭제
    clearInventory() {
        if (!confirm('정말로 모든 물품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

        this.saveInventory([]);
        this.updateInventoryUI();
        this.showMessage('인벤토리가 모두 비워졌습니다! 🧹', 'success');
    }

    // 인벤토리 데이터 내보내기
    exportInventory() {
        const inventory = this.getInventory();
        if (inventory.length === 0) {
            this.showMessage('내보낼 데이터가 없습니다.', 'info');
            return;
        }

        const data = {
            exportDate: new Date().toISOString(),
            inventory: inventory,
            summary: this.getInventorySummary()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('인벤토리 데이터가 내보내졌습니다! 📤', 'success');
    }

    // 인벤토리 UI 업데이트
    updateInventoryUI() {
        this.updateInventoryList();
        this.updateInventoryStats();
    }

    // 인벤토리 목록 업데이트
    updateInventoryList() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;

        const inventory = this.getInventory();
        
        if (inventory.length === 0) {
            inventoryList.innerHTML = '<p class="empty-inventory">아직 등록된 물품이 없습니다. 첫 번째 물품을 추가해보세요!</p>';
            return;
        }

        const itemsHTML = inventory.map(item => this.generateItemHTML(item)).join('');
        inventoryList.innerHTML = itemsHTML;

        // 이벤트 리스너 다시 바인딩
        this.bindItemEvents();
    }

    // 물품 HTML 생성
    generateItemHTML(item) {
        const category = this.categories[item.type];
        const expiryText = item.expiry ? this.formatExpiryDate(item.expiry) : '유통기한 없음';
        const isExpiringSoon = item.expiry ? this.isExpiringSoon(item.expiry) : false;
        
        return `
            <div class="inventory-item ${isExpiringSoon ? 'expiring-soon' : ''}" data-item-id="${item.id}">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        <span class="item-category category-${category.color}">${category.emoji} ${category.name}</span>
                        <span>수량: ${item.quantity}개</span>
                        <span>추정 가치: ₩${(item.estimatedPrice * item.quantity).toLocaleString()}</span>
                        <span>${expiryText}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="edit-item-btn" onclick="inventoryManager.editItem('${item.id}')">수정</button>
                    <button class="delete-item-btn" onclick="inventoryManager.deleteItem('${item.id}')">삭제</button>
                </div>
            </div>
        `;
    }

    // 물품 이벤트 바인딩
    bindItemEvents() {
        // 물품별 이벤트는 onclick으로 처리되므로 별도 바인딩 불필요
    }

    // 인벤토리 통계 업데이트
    updateInventoryStats() {
        const summary = this.getInventorySummary();
        
        const totalItemsElement = document.getElementById('total-items');
        const totalValueElement = document.getElementById('total-value');
        const expiringSoonElement = document.getElementById('expiring-soon');

        if (totalItemsElement) {
            totalItemsElement.textContent = summary.totalItems;
        }
        
        if (totalValueElement) {
            totalValueElement.textContent = `₩${summary.totalValue.toLocaleString()}`;
        }
        
        if (expiringSoonElement) {
            expiringSoonElement.textContent = summary.expiringSoon;
        }
    }

    // 인벤토리 요약 정보
    getInventorySummary() {
        const inventory = this.getInventory();
        const today = new Date();
        
        let totalItems = 0;
        let totalValue = 0;
        let expiringSoon = 0;

        inventory.forEach(item => {
            totalItems += item.quantity;
            totalValue += item.estimatedPrice * item.quantity;
            
            if (item.expiry && this.isExpiringSoon(item.expiry)) {
                expiringSoon += item.quantity;
            }
        });

        return {
            totalItems,
            totalValue,
            expiringSoon,
            totalCategories: this.getCategoryBreakdown(inventory)
        };
    }

    // 카테고리별 분류
    getCategoryBreakdown(inventory) {
        const breakdown = {};
        
        Object.keys(this.categories).forEach(category => {
            breakdown[category] = 0;
        });

        inventory.forEach(item => {
            if (breakdown[item.type] !== undefined) {
                breakdown[item.type] += item.quantity;
            }
        });

        return breakdown;
    }

    // 유통기한 포맷팅
    formatExpiryDate(expiryDate) {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `만료됨 (${Math.abs(diffDays)}일 전)`;
        } else if (diffDays === 0) {
            return '오늘 만료';
        } else if (diffDays <= 7) {
            return `${diffDays}일 후 만료`;
        } else {
            return expiry.toLocaleDateString('ko-KR');
        }
    }

    // 곧 만료되는지 확인 (7일 이내)
    isExpiringSoon(expiryDate) {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 0 && diffDays <= 7;
    }

    // 인벤토리 데이터 로드
    loadInventory() {
        // storageManager에서 인벤토리 데이터 로드
        const data = storageManager.getData();
        if (!data.inventory) {
            // 기본 인벤토리 데이터 생성
            const defaultInventory = [
                {
                    id: '1',
                    name: '샘플 맥주',
                    quantity: 1,
                    type: 'beer',
                    expiry: null,
                    addedDate: new Date().toISOString(),
                    estimatedPrice: 3000
                }
            ];
            this.saveInventory(defaultInventory);
        }
    }

    // 인벤토리 데이터 가져오기
    getInventory() {
        const data = storageManager.getData();
        return data ? (data.inventory || []) : [];
    }

    // 인벤토리 데이터 저장
    saveInventory(inventory) {
        const data = storageManager.getData();
        if (data) {
            data.inventory = inventory;
            storageManager.saveData(data);
        }
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

    // 인벤토리 분석 리포트
    generateInventoryReport() {
        const summary = this.getInventorySummary();
        const inventory = this.getInventory();
        
        const report = {
            generatedAt: new Date().toISOString(),
            summary: summary,
            recommendations: this.generateRecommendations(summary, inventory),
            categoryAnalysis: this.analyzeCategories(inventory)
        };

        return report;
    }

    // 개인화된 권장사항 생성
    generateRecommendations(summary, inventory) {
        const recommendations = [];

        if (summary.totalValue > 100000) {
            recommendations.push('총 가치가 10만원을 초과합니다. 물품 정리가 필요할 수 있습니다.');
        }

        if (summary.expiringSoon > 0) {
            recommendations.push(`${summary.expiringSoon}개 물품이 곧 만료됩니다. 우선적으로 소비하세요.`);
        }

        const categoryBreakdown = summary.totalCategories;
        if (categoryBreakdown.beer > 10) {
            recommendations.push('맥주가 많이 쌓여있습니다. 적정량을 유지하세요.');
        }

        if (Object.values(categoryBreakdown).every(count => count === 0)) {
            recommendations.push('인벤토리가 비어있습니다. 필요한 물품을 추가해보세요.');
        }

        return recommendations;
    }

    // 카테고리별 분석
    analyzeCategories(inventory) {
        const analysis = {};
        
        Object.keys(this.categories).forEach(category => {
            const items = inventory.filter(item => item.type === category);
            const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalValue = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
            
            analysis[category] = {
                count: items.length,
                totalQuantity,
                totalValue,
                averagePrice: totalQuantity > 0 ? Math.round(totalValue / totalQuantity) : 0
            };
        });

        return analysis;
    }
}

// 전역 인스턴스 생성
const inventoryManager = new InventoryManager();
