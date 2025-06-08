// API Demo Functions
// Only run on client side
if (typeof window !== 'undefined') {
    const API_BASE_URL = 'https://cp-merch-dev.wsdemo.online/api/v1';

    // Utility function to get API key
    function getApiKey() {
        const apiKeyInput = document.getElementById('api-key');
        if (!apiKeyInput) {
            alert('Пожалуйста, введите API ключ в поле выше');
            return null;
        }
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return null;
        }
        return apiKey;
    }

    // Utility function to make API requests
    async function makeApiRequest(endpoint, options = {}) {
        const apiKey = getApiKey();
        if (!apiKey) return;

        const url = `${API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();

            return {
                success: response.ok,
                status: response.status,
                data: data,
                headers: Object.fromEntries(response.headers.entries())
            };
        } catch (error) {
            // Handle CORS and network errors
            let errorMessage = error.message;
            if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
                errorMessage = `CORS Error: Браузер блокирует запрос из-за политики безопасности.
      
Попробуйте один из способов:
1. Используйте расширение браузера для отключения CORS (например, "CORS Unblock")
2. Скопируйте curl команду выше и выполните в терминале
3. Используйте Postman или другой API клиент
4. Добавьте домен localhost в CORS настройки сервера

Curl команда для копирования:
curl -X ${finalOptions.method || 'GET'} "${url}" \\
  -H "X-Api-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json"${finalOptions.body ? ` \\
  -d '${finalOptions.body}'` : ''}`;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    // Show result in demo container
    function showResult(container, result) {
        let resultDiv = container.querySelector('.demo-result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.className = 'demo-result';
            container.appendChild(resultDiv);
        }

        if (result.success) {
            resultDiv.className = 'demo-result success';
            resultDiv.textContent = `✅ Успех (${result.status})\n\n${JSON.stringify(result.data, null, 2)}`;
        } else {
            resultDiv.className = 'demo-result error';
            if (result.error) {
                resultDiv.textContent = `❌ ${result.error}`;
            } else {
                resultDiv.textContent = `❌ Ошибка API (${result.status})\n\n${JSON.stringify(result.data, null, 2)}`;
            }
        }
    }

    // Generate curl command for copying
    function generateCurlCommand(endpoint, options = {}) {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.log('No API key provided');
            return '';
        }

        const url = `${API_BASE_URL}${endpoint}`;
        const method = options.method || 'GET';

        let curlCommand = `curl -X ${method} "${url}" \\\n  -H "X-Api-Key: ${apiKey}" \\\n  -H "Content-Type: application/json"`;

        if (options.body) {
            curlCommand += ` \\\n  -d '${options.body}'`;
        }

        console.log('Generated curl command:', curlCommand);
        return curlCommand;
    }

    // Copy curl command to clipboard
    function copyCurlCommand(endpoint, options = {}) {
        const curlCommand = generateCurlCommand(endpoint, options);
        if (!curlCommand) {
            alert('Пожалуйста, введите API ключ сначала!');
            return;
        }

        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(curlCommand).then(() => {
                alert('✅ Curl команда скопирована в буфер обмена!');
            }).catch((err) => {
                console.error('Clipboard API failed:', err);
                fallbackCopyTextToClipboard(curlCommand);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyTextToClipboard(curlCommand);
        }
    }

    // Fallback copy function
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert('✅ Curl команда скопирована в буфер обмена!');
            } else {
                showCurlCommand(text);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showCurlCommand(text);
        }

        document.body.removeChild(textArea);
    }

    // Show curl command in a modal if copying fails
    function showCurlCommand(curlCommand) {
        const modal = document.createElement('div');
        modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

        const content = document.createElement('div');
        content.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
  `;

        content.innerHTML = `
    <h3>Скопируйте curl команду:</h3>
    <textarea readonly style="width: 100%; height: 200px; font-family: monospace; font-size: 12px;">${curlCommand}</textarea>
    <br><br>
    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Закрыть</button>
  `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Select text in textarea
        const textarea = content.querySelector('textarea');
        textarea.select();
    }

    // Show loading state
    function showLoading(button) {
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = '<span class="demo-loading"></span>Загрузка...';
        return originalText;
    }

    // Hide loading state
    function hideLoading(button, originalText) {
        button.disabled = false;
        button.textContent = originalText;
    }

    // Test get profile
    async function testGetProfile() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const result = await makeApiRequest('/merchant/profile', {
            method: 'GET'
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Test update profile
    async function testUpdateProfile() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const result = await makeApiRequest('/merchant/profile', {
            method: 'PUT',
            body: JSON.stringify({
                name: 'Demo Store Updated',
                webhook_url: 'https://demo.example.com/webhook'
            })
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Test get stats
    async function testGetStats() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const period = document.getElementById('stats-period')?.value || 'month';
        const currency = document.getElementById('stats-currency')?.value || '';

        let endpoint = `/merchant/stats?period=${period}`;
        if (currency) {
            endpoint += `&currency=${currency}`;
        }

        const result = await makeApiRequest(endpoint, {
            method: 'GET'
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Test create API key
    async function testCreateApiKey() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const name = document.getElementById('key-name')?.value || 'Demo API Key';
        const permissionsSelect = document.getElementById('key-permissions');
        const permissions = permissionsSelect ?
            Array.from(permissionsSelect.selectedOptions).map(option => option.value) :
            ['read'];

        const result = await makeApiRequest('/merchant/api-keys', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                permissions: permissions,
                expires_at: '2025-12-31T23:59:59Z'
            })
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Test webhook
    async function testWebhook() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const result = await makeApiRequest('/merchant/webhooks/test', {
            method: 'POST',
            body: JSON.stringify({
                event: 'payment.completed',
                test_data: {
                    payment_id: 'pay_demo_123',
                    amount: '0.00100000',
                    currency: 'BTC'
                }
            })
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Test get payment settings
    async function testGetPaymentSettings() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const result = await makeApiRequest('/merchant/settings/payments', {
            method: 'GET'
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Test get API keys
    async function testGetApiKeys() {
        const button = event.target;
        const container = button.closest('.api-demo');
        const originalText = showLoading(button);

        const result = await makeApiRequest('/merchant/api-keys', {
            method: 'GET'
        });

        hideLoading(button, originalText);
        showResult(container, result);
    }

    // Функции для тестирования API инвойсов
    window.testCreateInvoice = async function () {
        const apiKey = document.getElementById('api-key')?.value;
        const currency = document.getElementById('invoice-currency')?.value || 'eth';
        const amount = parseFloat(document.getElementById('invoice-amount')?.value) || 0.001;

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currency: currency,
                    amount: amount,
                    externalId: `demo_${Date.now()}`
                })
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Инвойс создан успешно!', result);
            } else {
                displayError('❌ Ошибка создания инвойса', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    window.testGetInvoices = async function () {
        const apiKey = document.getElementById('api-key')?.value;
        const page = document.getElementById('invoices-page')?.value || 1;
        const perPage = document.getElementById('invoices-perPage')?.value || 20;
        const currency = document.getElementById('invoices-currency')?.value || '';

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        try {
            let url = `${API_BASE_URL}/invoices/getAll?page=${page}&perPage=${perPage}`;
            if (currency) {
                url += `&currency=${currency}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Список инвойсов получен!', result);
            } else {
                displayError('❌ Ошибка получения списка инвойсов', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    window.testGetInvoice = async function () {
        const apiKey = document.getElementById('api-key')?.value;
        const invoiceId = document.getElementById('invoice-id')?.value;

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        if (!invoiceId) {
            alert('Пожалуйста, введите ID инвойса');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices?id=${invoiceId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Информация об инвойсе получена!', result);
            } else {
                displayError('❌ Ошибка получения инвойса', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    window.testGetInvoiceByExternalId = async function () {
        const apiKey = document.getElementById('api-key')?.value;
        const externalId = document.getElementById('external-id')?.value;

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        if (!externalId) {
            alert('Пожалуйста, введите внешний ID');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices/getByExternalId?externalId=${externalId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Инвойс по внешнему ID получен!', result);
            } else {
                displayError('❌ Ошибка получения инвойса по внешнему ID', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    window.testGetSummary = async function () {
        const apiKey = document.getElementById('api-key')?.value;

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices/summary`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Сводка получена!', result);
            } else {
                displayError('❌ Ошибка получения сводки', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    window.testChangeInvoiceStatus = async function () {
        const apiKey = document.getElementById('api-key')?.value;
        const invoiceId = document.getElementById('status-invoice-id')?.value;
        const status = document.getElementById('new-status')?.value;

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        if (!invoiceId) {
            alert('Пожалуйста, введите ID инвойса');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    invoiceId: invoiceId,
                    status: status
                })
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Статус инвойса изменен!', result);
            } else {
                displayError('❌ Ошибка изменения статуса', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    window.testGetInvoiceSettings = async function () {
        const apiKey = document.getElementById('api-key')?.value;

        if (!apiKey) {
            alert('Пожалуйста, введите API ключ');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices/configureSettings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                displayResult('✅ Настройки инвойсов получены!', result);
            } else {
                displayError('❌ Ошибка получения настроек', result);
            }
        } catch (error) {
            handleNetworkError(error);
        }
    };

    // Функция для отображения результатов
    function displayResult(message, data) {
        console.log(message, data);

        // Создаем элемент для отображения результата
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
    margin-top: 10px;
    padding: 15px;
    background: #e8f5e8;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  `;

        resultDiv.innerHTML = `
    <strong style="color: #4CAF50;">${message}</strong><br><br>
    <code>${JSON.stringify(data, null, 2)}</code>
  `;

        // Находим ближайший demo-controls и добавляем результат
        const demoControls = document.querySelector('.api-demo .demo-controls');
        if (demoControls) {
            // Удаляем предыдущий результат
            const existingResult = demoControls.querySelector('.api-result');
            if (existingResult) {
                existingResult.remove();
            }

            resultDiv.className = 'api-result';
            demoControls.appendChild(resultDiv);
        }
    }

    function displayError(message, error) {
        console.error(message, error);

        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
    margin-top: 10px;
    padding: 15px;
    background: #ffe8e8;
    border: 1px solid #f44336;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  `;

        errorDiv.innerHTML = `
    <strong style="color: #f44336;">${message}</strong><br><br>
    <code>${JSON.stringify(error, null, 2)}</code>
  `;

        const demoControls = document.querySelector('.api-demo .demo-controls');
        if (demoControls) {
            const existingResult = demoControls.querySelector('.api-result');
            if (existingResult) {
                existingResult.remove();
            }

            errorDiv.className = 'api-result';
            demoControls.appendChild(errorDiv);
        }
    }

    function handleNetworkError(error) {
        console.error('Network error:', error);

        let errorMessage = '❌ Ошибка сети';
        let suggestion = '';

        if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            suggestion = `
<br><br><strong>Возможные решения:</strong>
<ul>
  <li>Используйте кнопку "📋 Копировать curl" для получения готовой команды</li>
  <li>Выполните команду в терминале или используйте Postman</li>
  <li>Установите расширение браузера для отключения CORS</li>
</ul>`;
        }

        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
    margin-top: 10px;
    padding: 15px;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
  `;

        errorDiv.innerHTML = `
    <strong style="color: #856404;">${errorMessage}</strong><br>
    <em>Детали: ${error.message}</em>
    ${suggestion}
  `;

        const demoControls = document.querySelector('.api-demo .demo-controls');
        if (demoControls) {
            const existingResult = demoControls.querySelector('.api-result');
            if (existingResult) {
                existingResult.remove();
            }

            errorDiv.className = 'api-result';
            demoControls.appendChild(errorDiv);
        }
    }

    // Initialize demo when page loads
    document.addEventListener('DOMContentLoaded', function () {
        // Add global styles for better UX
        const style = document.createElement('style');
        style.textContent = `
    .api-demo {
      transition: all 0.3s ease;
    }
    .api-demo:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `;
        document.head.appendChild(style);

        // Auto-focus on API key input if empty
        const apiKeyInput = document.getElementById('api-key');
        if (apiKeyInput && !apiKeyInput.value) {
            setTimeout(() => {
                apiKeyInput.focus();
            }, 1000);
        }
    });

    // Export functions for global access
    window.testGetProfile = testGetProfile;
    window.testUpdateProfile = testUpdateProfile;
    window.testGetStats = testGetStats;
    window.testCreateApiKey = testCreateApiKey;
    window.testWebhook = testWebhook;
    window.testGetPaymentSettings = testGetPaymentSettings;
    window.testGetApiKeys = testGetApiKeys;
    window.copyCurlCommand = copyCurlCommand;
    window.generateCurlCommand = generateCurlCommand;
    window.fallbackCopyTextToClipboard = fallbackCopyTextToClipboard;
    window.showCurlCommand = showCurlCommand;
    window.testCreateInvoice = testCreateInvoice;
    window.testGetInvoices = testGetInvoices;
    window.testGetInvoice = testGetInvoice;
    window.testGetInvoiceByExternalId = testGetInvoiceByExternalId;
    window.testGetSummary = testGetSummary;
    window.testChangeInvoiceStatus = testChangeInvoiceStatus;
    window.testGetInvoiceSettings = testGetInvoiceSettings;

    // Addresses API functions
    async function testCreateAddress() {
        const button = document.querySelector('button[onclick="testCreateAddress()"]');
        const originalText = button.textContent;
        showLoading(button);

        const network = document.getElementById('address-network')?.value || 'ethereum';
        const coin = document.getElementById('address-coin')?.value || '';

        const body = { network };
        if (coin) body.coin = coin;

        const result = await makeApiRequest('/addresses', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetAddress() {
        const button = document.querySelector('button[onclick="testGetAddress()"]');
        const originalText = button.textContent;
        showLoading(button);

        const address = document.getElementById('get-address')?.value || '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87';

        const result = await makeApiRequest(`/addresses/${address}`);

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetHotWallet() {
        const button = document.querySelector('button[onclick="testGetHotWallet()"]');
        const originalText = button.textContent;
        showLoading(button);

        const network = document.getElementById('hot-wallet-network')?.value || 'ethereum';

        const result = await makeApiRequest(`/addresses/hot-wallet/${network}`);

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testRegisterServiceWallet() {
        const button = document.querySelector('button[onclick="testRegisterServiceWallet()"]');
        const originalText = button.textContent;
        showLoading(button);

        const network = document.getElementById('service-network')?.value || 'ethereum';
        const type = document.getElementById('service-type')?.value || 'cold';
        const address = document.getElementById('service-address')?.value || '';

        const body = { network, type };
        if (address) body.address = address;

        const result = await makeApiRequest('/addresses/service-wallets', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetGreyList() {
        const button = document.querySelector('button[onclick="testGetGreyList()"]');
        const originalText = button.textContent;
        showLoading(button);

        const result = await makeApiRequest('/addresses/grey-list');

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    // Networks API functions
    async function testGetNetworks() {
        const button = document.querySelector('button[onclick="testGetNetworks()"]');
        const originalText = button.textContent;
        showLoading(button);

        const result = await makeApiRequest('/networks');

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetNetwork() {
        const button = document.querySelector('button[onclick="testGetNetwork()"]');
        const originalText = button.textContent;
        showLoading(button);

        const network = document.getElementById('network-slug')?.value || 'ethereum';

        const result = await makeApiRequest(`/networks/${network}`);

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetLastBlock() {
        const button = document.querySelector('button[onclick="testGetLastBlock()"]');
        const originalText = button.textContent;
        showLoading(button);

        const network = document.getElementById('block-network')?.value || 'ethereum';

        const result = await makeApiRequest(`/networks/last-number-block/${network}`);

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetAllLastBlocks() {
        const button = document.querySelector('button[onclick="testGetAllLastBlocks()"]');
        const originalText = button.textContent;
        showLoading(button);

        const result = await makeApiRequest('/networks/last-number-blocks');

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testStakeTron() {
        const button = document.querySelector('button[onclick="testStakeTron()"]');
        const originalText = button.textContent;
        showLoading(button);

        const amount = document.getElementById('stake-amount')?.value || '1000';
        const resource = document.getElementById('stake-resource')?.value || 'ENERGY';

        const result = await makeApiRequest('/networks/tron/stake', {
            method: 'POST',
            body: JSON.stringify({ amount, resource })
        });

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetTronResources() {
        const button = document.querySelector('button[onclick="testGetTronResources()"]');
        const originalText = button.textContent;
        showLoading(button);

        const result = await makeApiRequest('/networks/tron/resources');

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    // Withdraws API functions
    async function testInitiateWithdraw() {
        const button = document.querySelector('button[onclick="testInitiateWithdraw()"]');
        const originalText = button.textContent;
        showLoading(button);

        const network = document.getElementById('withdraw-network')?.value || 'ethereum';
        const amount = document.getElementById('withdraw-amount')?.value || '100';

        const body = {
            network,
            coin: 'usdt',
            address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
            amount
        };

        const result = await makeApiRequest('/withdraws', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    async function testGetWithdrawalRequests() {
        const button = document.querySelector('button[onclick="testGetWithdrawalRequests()"]');
        const originalText = button.textContent;
        showLoading(button);

        const page = document.getElementById('requests-page')?.value || '1';
        const limit = document.getElementById('requests-limit')?.value || '10';
        const status = document.getElementById('requests-status')?.value || '';

        let endpoint = `/withdraws/requests?page=${page}&limit=${limit}`;
        if (status) endpoint += `&status=${status}`;

        const result = await makeApiRequest(endpoint);

        hideLoading(button, originalText);
        showResult(button.closest('.api-demo'), result);
    }

    // Export new functions
    window.testCreateAddress = testCreateAddress;
    window.testGetAddress = testGetAddress;
    window.testGetHotWallet = testGetHotWallet;
    window.testRegisterServiceWallet = testRegisterServiceWallet;
    window.testGetGreyList = testGetGreyList;
    window.testGetNetworks = testGetNetworks;
    window.testGetNetwork = testGetNetwork;
    window.testGetLastBlock = testGetLastBlock;
    window.testGetAllLastBlocks = testGetAllLastBlocks;
    window.testStakeTron = testStakeTron;
    window.testGetTronResources = testGetTronResources;
    window.testInitiateWithdraw = testInitiateWithdraw;
    window.testGetWithdrawalRequests = testGetWithdrawalRequests;
} 