document.addEventListener('DOMContentLoaded', () => {
    // History storage
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    
    // Currency settings
    let currentCurrency = localStorage.getItem('selectedCurrency') || 'none';
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // Currency selector
    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem('selectedCurrency', currentCurrency);
            showToast('Formato alterado com sucesso!');
        });
    }

    // Clear individual input buttons
    document.querySelectorAll('.clear-input-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const inputId = btn.getAttribute('data-clear');
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
                input.focus();
            }
        });
    });

    // ========== BASIC CALCULATION ==========
    const value1Input = document.getElementById('value1');
    const value2Input = document.getElementById('value2');
    const resultElement = document.getElementById('result');
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const copyResultBtn = document.getElementById('copy-result');

    const calculatePercentage = () => {
        const percent = parseFloat(value1Input.value) || 0;
        const number = parseFloat(value2Input.value) || 0;
        const result = (percent / 100) * number;
        
        const formattedResult = formatNumber(result);
        
        resultElement.textContent = formattedResult;
        animateResult(resultElement);
        
        // Add to history
        addToHistory(`${percent}% de ${number}`, formattedResult);
    };

    const setQuickPercentage = (percent) => {
        value1Input.value = percent;
        if (value2Input.value) {
            calculatePercentage();
        } else {
            value2Input.focus();
        }
    };

    const clearBasic = () => {
        value1Input.value = '';
        value2Input.value = '';
        resultElement.textContent = '0,00';
        value1Input.focus();
    };

    calculateBtn.addEventListener('click', calculatePercentage);
    clearBtn.addEventListener('click', clearBasic);
    copyResultBtn.addEventListener('click', () => copyToClipboard(resultElement.textContent));

    [value1Input, value2Input].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculatePercentage();
        });
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setQuickPercentage(btn.getAttribute('data-percent'));
        });
    });

    // ========== INCREASE CALCULATION ==========
    const increaseValue = document.getElementById('increase-value');
    const increasePercent = document.getElementById('increase-percent');
    const increaseResult = document.getElementById('increase-result');
    const increaseInfo = document.getElementById('increase-info');
    const calculateIncreaseBtn = document.getElementById('calculate-increase');
    const clearIncreaseBtn = document.getElementById('clear-increase');
    const copyIncreaseBtn = document.getElementById('copy-increase');

    const calculateIncrease = () => {
        const value = parseFloat(increaseValue.value) || 0;
        const percent = parseFloat(increasePercent.value) || 0;
        const increase = (value * percent) / 100;
        const result = value + increase;
        
        const formattedResult = formatNumber(result);
        const formattedIncrease = formatNumber(increase);
        
        increaseResult.textContent = formattedResult;
        increaseInfo.innerHTML = `<strong>Aumento:</strong> ${formattedIncrease} (+${percent}%)`;
        animateResult(increaseResult);
        
        addToHistory(`${value} + ${percent}%`, formattedResult);
    };

    const clearIncrease = () => {
        increaseValue.value = '';
        increasePercent.value = '';
        increaseResult.textContent = '0,00';
        increaseInfo.innerHTML = '';
        increaseValue.focus();
    };

    calculateIncreaseBtn.addEventListener('click', calculateIncrease);
    clearIncreaseBtn.addEventListener('click', clearIncrease);
    copyIncreaseBtn.addEventListener('click', () => copyToClipboard(increaseResult.textContent));

    [increaseValue, increasePercent].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateIncrease();
        });
    });

    // ========== DECREASE CALCULATION ==========
    const decreaseValue = document.getElementById('decrease-value');
    const decreasePercent = document.getElementById('decrease-percent');
    const decreaseResult = document.getElementById('decrease-result');
    const decreaseInfo = document.getElementById('decrease-info');
    const calculateDecreaseBtn = document.getElementById('calculate-decrease');
    const clearDecreaseBtn = document.getElementById('clear-decrease');
    const copyDecreaseBtn = document.getElementById('copy-decrease');

    const calculateDecrease = () => {
        const value = parseFloat(decreaseValue.value) || 0;
        const percent = parseFloat(decreasePercent.value) || 0;
        const decrease = (value * percent) / 100;
        const result = value - decrease;
        
        const formattedResult = formatNumber(result);
        const formattedDecrease = formatNumber(decrease);
        
        decreaseResult.textContent = formattedResult;
        decreaseInfo.innerHTML = `<strong>Desconto:</strong> ${formattedDecrease} (-${percent}%)`;
        animateResult(decreaseResult);
        
        addToHistory(`${value} - ${percent}%`, formattedResult);
    };

    const clearDecrease = () => {
        decreaseValue.value = '';
        decreasePercent.value = '';
        decreaseResult.textContent = '0,00';
        decreaseInfo.innerHTML = '';
        decreaseValue.focus();
    };

    calculateDecreaseBtn.addEventListener('click', calculateDecrease);
    clearDecreaseBtn.addEventListener('click', clearDecrease);
    copyDecreaseBtn.addEventListener('click', () => copyToClipboard(decreaseResult.textContent));

    [decreaseValue, decreasePercent].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateDecrease();
        });
    });

    // ========== DIFFERENCE CALCULATION ==========
    const diffValue1 = document.getElementById('diff-value1');
    const diffValue2 = document.getElementById('diff-value2');
    const differenceResult = document.getElementById('difference-result');
    const differenceInfo = document.getElementById('difference-info');
    const calculateDifferenceBtn = document.getElementById('calculate-difference');
    const clearDifferenceBtn = document.getElementById('clear-difference');
    const copyDifferenceBtn = document.getElementById('copy-difference');

    const calculateDifference = () => {
        const value1 = parseFloat(diffValue1.value) || 0;
        const value2 = parseFloat(diffValue2.value) || 0;
        
        if (value1 === 0) {
            showToast('Valor inicial não pode ser zero', 'error');
            return;
        }
        
        const difference = value2 - value1;
        const percentDiff = ((difference / value1) * 100);
        
        const formattedPercent = percentDiff.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        const formattedDiff = Math.abs(difference).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        differenceResult.textContent = `${formattedPercent}%`;
        
        const changeType = difference > 0 ? 'Aumento' : 'Diminuição';
        const changeColor = difference > 0 ? '#48bb78' : '#e53e3e';
        differenceInfo.innerHTML = `<strong>${changeType}:</strong> <span style="color: ${changeColor}">${formattedDiff}</span>`;
        animateResult(differenceResult);
        
        addToHistory(`${value1} → ${value2}`, `${formattedPercent}%`);
    };

    const clearDifference = () => {
        diffValue1.value = '';
        diffValue2.value = '';
        differenceResult.textContent = '0,00%';
        differenceInfo.innerHTML = '';
        diffValue1.focus();
    };

    calculateDifferenceBtn.addEventListener('click', calculateDifference);
    clearDifferenceBtn.addEventListener('click', clearDifference);
    copyDifferenceBtn.addEventListener('click', () => copyToClipboard(differenceResult.textContent));

    [diffValue1, diffValue2].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateDifference();
        });
    });

    // ========== HISTORY MANAGEMENT ==========
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    function addToHistory(calculation, result) {
        const historyItem = {
            calculation,
            result,
            timestamp: new Date().toLocaleString('pt-BR')
        };
        
        history.unshift(historyItem);
        if (history.length > 10) history.pop(); // Keep only last 10
        
        localStorage.setItem('calcHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">Nenhum cálculo realizado ainda</p>';
            clearHistoryBtn.style.display = 'none';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <span class="history-text">${item.calculation}</span>
                <span class="history-result">${item.result}</span>
            </div>
        `).join('');
        
        clearHistoryBtn.style.display = 'block';
    }

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        localStorage.removeItem('calcHistory');
        renderHistory();
        showToast('Histórico limpo!');
    });

    // ========== UTILITY FUNCTIONS ==========
    function formatNumber(value) {
        if (currentCurrency === 'none') {
            return value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        
        const currencyMap = {
            'BRL': { locale: 'pt-BR', currency: 'BRL' },
            'USD': { locale: 'en-US', currency: 'USD' },
            'EUR': { locale: 'de-DE', currency: 'EUR' },
            'GBP': { locale: 'en-GB', currency: 'GBP' },
            'JPY': { locale: 'ja-JP', currency: 'JPY' }
        };
        
        const config = currencyMap[currentCurrency];
        if (config) {
            return value.toLocaleString(config.locale, {
                style: 'currency',
                currency: config.currency,
                minimumFractionDigits: currentCurrency === 'JPY' ? 0 : 2,
                maximumFractionDigits: currentCurrency === 'JPY' ? 0 : 2
            });
        }
        
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function animateResult(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'pulse 0.5s';
    }

    function copyToClipboard(text) {
        // Remove formatting for clipboard
        const cleanText = text.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
        
        navigator.clipboard.writeText(cleanText).then(() => {
            showToast('Copiado para a área de transferência!');
        }).catch(() => {
            showToast('Erro ao copiar', 'error');
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.background = type === 'error' ? '#e53e3e' : '#48bb78';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Input validation - allow only numbers and one decimal point
    const allInputs = [
        value1Input, value2Input, increaseValue, increasePercent,
        decreaseValue, decreasePercent, diffValue1, diffValue2
    ];

    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value
                    .replace(/[^0-9.-]/g, '')
                    .replace(/(\..*)\./g, '$1')
                    .replace(/(?!^)-/g, '');
            });
        }
    });

    // Initialize
    renderHistory();
    value1Input.focus();
});
