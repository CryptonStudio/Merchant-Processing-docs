// Глобальное управление API ключом для всех страниц документации
let globalApiKey = '';
let globalEnvironment = 'sandbox';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Загружаем сохраненный API ключ
    const savedApiKey = localStorage.getItem('crypton-api-key');
    const savedEnvironment = localStorage.getItem('crypton-environment') || 'sandbox';

    if (savedApiKey) {
        globalApiKey = savedApiKey;
        const globalApiKeyInput = document.getElementById('global-api-key');
        if (globalApiKeyInput) {
            globalApiKeyInput.value = savedApiKey;
            updateApiKeyStatus();
        }
    }

    globalEnvironment = savedEnvironment;
    const globalEnvironmentSelect = document.getElementById('global-environment');
    if (globalEnvironmentSelect) {
        globalEnvironmentSelect.value = savedEnvironment;
    }

    // Обработчики событий
    const globalApiKeyInput = document.getElementById('global-api-key');
    if (globalApiKeyInput) {
        globalApiKeyInput.addEventListener('input', function (e) {
            globalApiKey = e.target.value;
            localStorage.setItem('crypton-api-key', globalApiKey);
            updateApiKeyStatus();
        });
    }

    const globalEnvironmentSelect = document.getElementById('global-environment');
    if (globalEnvironmentSelect) {
        globalEnvironmentSelect.addEventListener('change', function (e) {
            globalEnvironment = e.target.value;
            localStorage.setItem('crypton-environment', globalEnvironment);
        });
    }
});

function updateApiKeyStatus() {
    const statusElement = document.getElementById('api-key-status');
    if (statusElement) {
        if (globalApiKey) {
            statusElement.textContent = `✅ API 密钥已设置 (${globalApiKey.substring(0, 8)}...)`;
            statusElement.style.color = '#10b981';
        } else {
            statusElement.textContent = '❌ 未设置 API 密钥';
            statusElement.style.color = '#ef4444';
        }
    }
}

function getApiUrl() {
    return globalEnvironment === 'production'
        ? 'https://cp-merch.wsdemo.online/api'
        : 'https://cp-merch-dev.wsdemo.online/api';
}

// Универсальная функция для копирования curl команд
function copyCurlCommand(endpoint, options = {}) {
    if (!globalApiKey) {
        alert('请先设置 API 密钥！');
        return;
    }

    const method = options.method || 'GET';
    const body = options.body || '';
    const url = `${getApiUrl()}/v1${endpoint}`;

    let curlCommand = `curl -X ${method} "${url}" \\\n  -H "X-Api-Key: ${globalApiKey}"`;

    if (method !== 'GET') {
        curlCommand += ` \\\n  -H "Content-Type: application/json"`;
    }

    if (body) {
        curlCommand += ` \\\n  -d '${body}'`;
    }

    navigator.clipboard.writeText(curlCommand).then(() => {
        // Показываем уведомление
        const notification = document.createElement('div');
        notification.textContent = '✅ curl 命令已复制到剪贴板！';
        notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: #10b981; color: white; 
      padding: 12px 20px; border-radius: 6px; 
      z-index: 1000; font-size: 14px;
    `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    });
}

// Универсальная функция для создания div результата
function createResultDiv(id) {
    const resultDiv = document.createElement('div');
    resultDiv.id = id;
    resultDiv.className = 'api-result';
    return resultDiv;
}

// Универсальная функция для отображения результата API
function displayApiResult(resultDiv, response, data) {
    if (response.ok) {
        resultDiv.innerHTML = `
      <div class="success">✅ 请求成功 (${response.status})</div>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    } else {
        resultDiv.innerHTML = `
      <div class="error">❌ API 错误 (${response.status})</div>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    }
}

// Универсальная функция для обработки ошибок
function displayApiError(resultDiv, error) {
    resultDiv.innerHTML = `
    <div class="error">❌ 网络错误</div>
    <pre>错误: ${error.message}</pre>
    <div class="cors-note">
      <strong>如果遇到 CORS 错误:</strong><br>
      使用下面的 curl 命令或在终端/Postman 中测试
    </div>
  `;
}

// Универсальная функция для проверки API ключа
function checkApiKey() {
    if (!globalApiKey) {
        alert('请先设置 API 密钥！');
        return false;
    }
    return true;
}

// Экспорт функций для использования в других скриптах
window.globalApiKey = globalApiKey;
window.globalEnvironment = globalEnvironment;
window.getApiUrl = getApiUrl;
window.copyCurlCommand = copyCurlCommand;
window.createResultDiv = createResultDiv;
window.displayApiResult = displayApiResult;
window.displayApiError = displayApiError;
window.checkApiKey = checkApiKey; 