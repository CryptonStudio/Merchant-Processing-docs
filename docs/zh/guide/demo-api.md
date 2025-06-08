# 演示 API

在这里您可以直接测试我们的 API 端点，无需编写代码。

## API 基础信息

- **测试环境**: 'https://api-sandbox.crypton.studio'
- **生产环境**: 'https://api.crypton.studio'

::: warning 注意
以下演示使用测试环境。在生产环境中，请使用您的真实 API 密钥。
:::

## 身份验证

&lt;div class="api-demo"&gt;
  &lt;h3&gt;API 密钥设置&lt;/h3&gt;
  &lt;div class="form-group"&gt;
    &lt;label for="apiKey"&gt;API 密钥:&lt;/label&gt;
    &lt;input type="text" id="apiKey" placeholder="输入您的 API 密钥" value="ck_test_demo_key_12345"&gt;
  &lt;/div&gt;
  &lt;div class="form-group"&gt;
    &lt;label for="environment"&gt;环境:&lt;/label&gt;
    &lt;select id="environment"&gt;
      &lt;option value="sandbox"&gt;测试环境&lt;/option&gt;
      &lt;option value="production"&gt;生产环境&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
&lt;/div&gt;

## 1. 获取商户信息

&lt;div class="api-demo"&gt;
  &lt;h3&gt;GET /v1/merchant&lt;/h3&gt;
  &lt;p&gt;获取当前商户的基本信息。&lt;/p&gt;
  
  &lt;button onclick="testMerchantInfo()" class="btn-primary"&gt;测试 API&lt;/button&gt;
  
  &lt;div class="response-container"&gt;
    &lt;h4&gt;响应:&lt;/h4&gt;
    &lt;pre id="merchantResponse"&gt;点击上方按钮测试 API&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

## 2. 获取支持的网络

&lt;div class="api-demo"&gt;
  &lt;h3&gt;GET /v1/networks&lt;/h3&gt;
  &lt;p&gt;获取平台支持的所有区块链网络。&lt;/p&gt;
  
  &lt;button onclick="testNetworks()" class="btn-primary"&gt;测试 API&lt;/button&gt;
  
  &lt;div class="response-container"&gt;
    &lt;h4&gt;响应:&lt;/h4&gt;
    &lt;pre id="networksResponse"&gt;点击上方按钮测试 API&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

## 3. 获取支持的币种

&lt;div class="api-demo"&gt;
  &lt;h3&gt;GET /v1/coins&lt;/h3&gt;
  &lt;p&gt;获取平台支持的所有加密货币。&lt;/p&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="networkFilter"&gt;网络筛选 (可选):&lt;/label&gt;
    &lt;select id="networkFilter"&gt;
      &lt;option value=""&gt;所有网络&lt;/option&gt;
      &lt;option value="ethereum"&gt;Ethereum&lt;/option&gt;
      &lt;option value="bitcoin"&gt;Bitcoin&lt;/option&gt;
      &lt;option value="tron"&gt;Tron&lt;/option&gt;
      &lt;option value="bsc"&gt;BSC&lt;/option&gt;
      &lt;option value="polygon"&gt;Polygon&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
  
  &lt;button onclick="testCoins()" class="btn-primary"&gt;测试 API&lt;/button&gt;
  
  &lt;div class="response-container"&gt;
    &lt;h4&gt;响应:&lt;/h4&gt;
    &lt;pre id="coinsResponse"&gt;点击上方按钮测试 API&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

## 4. 创建支付地址

&lt;div class="api-demo"&gt;
  &lt;h3&gt;POST /v1/addresses&lt;/h3&gt;
  &lt;p&gt;创建新的支付地址用于接收加密货币。&lt;/p&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="addressNetwork"&gt;网络:&lt;/label&gt;
    &lt;select id="addressNetwork"&gt;
      &lt;option value="ethereum"&gt;Ethereum&lt;/option&gt;
      &lt;option value="bitcoin"&gt;Bitcoin&lt;/option&gt;
      &lt;option value="tron"&gt;Tron&lt;/option&gt;
      &lt;option value="bsc"&gt;BSC&lt;/option&gt;
      &lt;option value="polygon"&gt;Polygon&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="addressCoin"&gt;币种:&lt;/label&gt;
    &lt;select id="addressCoin"&gt;
      &lt;option value="USDT"&gt;USDT&lt;/option&gt;
      &lt;option value="USDC"&gt;USDC&lt;/option&gt;
      &lt;option value="ETH"&gt;ETH&lt;/option&gt;
      &lt;option value="BTC"&gt;BTC&lt;/option&gt;
      &lt;option value="TRX"&gt;TRX&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="addressLabel"&gt;标签:&lt;/label&gt;
    &lt;input type="text" id="addressLabel" placeholder="订单支付 #12345" value="演示支付地址"&gt;
  &lt;/div&gt;
  
  &lt;button onclick="testCreateAddress()" class="btn-primary"&gt;创建地址&lt;/button&gt;
  
  &lt;div class="response-container"&gt;
    &lt;h4&gt;响应:&lt;/h4&gt;
    &lt;pre id="addressResponse"&gt;点击上方按钮测试 API&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

## 5. 获取地址列表

&lt;div class="api-demo"&gt;
  &lt;h3&gt;GET /v1/addresses&lt;/h3&gt;
  &lt;p&gt;获取商户的所有支付地址。&lt;/p&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="addressListLimit"&gt;每页数量:&lt;/label&gt;
    &lt;input type="number" id="addressListLimit" value="10" min="1" max="100"&gt;
  &lt;/div&gt;
  
  &lt;button onclick="testAddressList()" class="btn-primary"&gt;获取地址列表&lt;/button&gt;
  
  &lt;div class="response-container"&gt;
    &lt;h4&gt;响应:&lt;/h4&gt;
    &lt;pre id="addressListResponse"&gt;点击上方按钮测试 API&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

## 6. 获取提现费用

&lt;div class="api-demo"&gt;
  &lt;h3&gt;GET /v1/withdrawals/fees&lt;/h3&gt;
  &lt;p&gt;获取指定网络和币种的提现费用。&lt;/p&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="feeNetwork"&gt;网络:&lt;/label&gt;
    &lt;select id="feeNetwork"&gt;
      &lt;option value="ethereum"&gt;Ethereum&lt;/option&gt;
      &lt;option value="bitcoin"&gt;Bitcoin&lt;/option&gt;
      &lt;option value="tron"&gt;Tron&lt;/option&gt;
      &lt;option value="bsc"&gt;BSC&lt;/option&gt;
      &lt;option value="polygon"&gt;Polygon&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
  
  &lt;div class="form-group"&gt;
    &lt;label for="feeCoin"&gt;币种:&lt;/label&gt;
    &lt;select id="feeCoin"&gt;
      &lt;option value="USDT"&gt;USDT&lt;/option&gt;
      &lt;option value="USDC"&gt;USDC&lt;/option&gt;
      &lt;option value="ETH"&gt;ETH&lt;/option&gt;
      &lt;option value="BTC"&gt;BTC&lt;/option&gt;
      &lt;option value="TRX"&gt;TRX&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
  
  &lt;button onclick="testWithdrawalFees()" class="btn-primary"&gt;获取费用&lt;/button&gt;
  
  &lt;div class="response-container"&gt;
    &lt;h4&gt;响应:&lt;/h4&gt;
    &lt;pre id="feesResponse"&gt;点击上方按钮测试 API&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

&lt;style&gt;
.api-demo {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background: #f8f9fa;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #0056b3;
}

.response-container {
  margin-top: 20px;
}

.response-container h4 {
  margin-bottom: 10px;
  color: #333;
}

.response-container pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

.loading {
  color: #007bff;
}

.error {
  color: #dc3545;
}

.success {
  color: #28a745;
}
&lt;/style&gt;

&lt;script&gt;
// 获取 API 基础配置
function getApiConfig() {
  const apiKey = document.getElementById('apiKey').value;
  const environment = document.getElementById('environment').value;
  const baseUrl = environment === 'production' 
    ? 'https://api.crypton.studio' 
    : 'https://api-sandbox.crypton.studio';
  
  return { apiKey, baseUrl };
}

// 通用 API 调用函数
async function callApi(endpoint, options = {}) {
  const { apiKey, baseUrl } = getApiConfig();
  
  if (!apiKey) {
    return { error: '请输入 API 密钥' };
  }
  
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: options.method || 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    // 如果是 CORS 错误，提供 curl 命令
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const curlCommand = generateCurlCommand(endpoint, options);
      return { 
        error: 'CORS 错误 - 请在服务器端调用或使用以下 curl 命令',
        curl: curlCommand
      };
    }
    return { error: error.message };
  }
}

// 生成 curl 命令
function generateCurlCommand(endpoint, options = {}) {
  const { apiKey, baseUrl } = getApiConfig();
  const method = options.method || 'GET';
  const url = baseUrl + endpoint;
  
  let curl = 'curl -X ' + method + ' "' + url + '" \\\n';
  curl += '  -H "X-Api-Key: ' + apiKey + '" \\\n';
  curl += '  -H "Content-Type: application/json"';
  
  if (options.body) {
    curl += " \\\n  -d '" + JSON.stringify(options.body, null, 2) + "'";
  }
  
  return curl;
}

// 显示响应
function displayResponse(elementId, response) {
  const element = document.getElementById(elementId);
  
  if (response.error) {
    element.innerHTML = '&lt;span class="error"&gt;错误: ' + response.error + '&lt;/span&gt;';
    if (response.curl) {
      element.innerHTML += '\n\n&lt;span class="success"&gt;替代方案 - 使用 curl:&lt;/span&gt;\n' + response.curl + '';
    }
  } else {
    element.innerHTML = JSON.stringify(response.data, null, 2);
  }
}

// 测试商户信息
async function testMerchantInfo() {
  const element = document.getElementById('merchantResponse');
  element.innerHTML = '&lt;span class="loading"&gt;请求中...&lt;/span&gt;';
  
  const response = await callApi('/v1/merchant');
  displayResponse('merchantResponse', response);
}

// 测试网络列表
async function testNetworks() {
  const element = document.getElementById('networksResponse');
  element.innerHTML = '&lt;span class="loading"&gt;请求中...&lt;/span&gt;';
  
  const response = await callApi('/v1/networks');
  displayResponse('networksResponse', response);
}

// 测试币种列表
async function testCoins() {
  const element = document.getElementById('coinsResponse');
  element.innerHTML = '&lt;span class="loading"&gt;请求中...&lt;/span&gt;';
  
  const network = document.getElementById('networkFilter').value;
  const endpoint = network ? '/v1/coins?network=' + network + '' : '/v1/coins';
  
  const response = await callApi(endpoint);
  displayResponse('coinsResponse', response);
}

// 测试创建地址
async function testCreateAddress() {
  const element = document.getElementById('addressResponse');
  element.innerHTML = '&lt;span class="loading"&gt;请求中...&lt;/span&gt;';
  
  const network = document.getElementById('addressNetwork').value;
  const coin = document.getElementById('addressCoin').value;
  const label = document.getElementById('addressLabel').value;
  
  const body = {
    network,
    coin,
    label,
    metadata: {
      demo: true,
      timestamp: new Date().toISOString()
    }
  };
  
  const response = await callApi('/v1/addresses', {
    method: 'POST',
    body
  });
  
  displayResponse('addressResponse', response);
}

// 测试地址列表
async function testAddressList() {
  const element = document.getElementById('addressListResponse');
  element.innerHTML = '&lt;span class="loading"&gt;请求中...&lt;/span&gt;';
  
  const limit = document.getElementById('addressListLimit').value;
  const endpoint = '/v1/addresses?limit=' + limit + '';
  
  const response = await callApi(endpoint);
  displayResponse('addressListResponse', response);
}

// 测试提现费用
async function testWithdrawalFees() {
  const element = document.getElementById('feesResponse');
  element.innerHTML = '&lt;span class="loading"&gt;请求中...&lt;/span&gt;';
  
  const network = document.getElementById('feeNetwork').value;
  const coin = document.getElementById('feeCoin').value;
  const endpoint = '/v1/withdrawals/fees?network=' + network + '&coin=' + coin;
  
  const response = await callApi(endpoint);
  displayResponse('feesResponse', response);
}
&lt;/script&gt;

## 错误处理

如果您遇到 CORS 错误，这是正常的，因为浏览器的安全策略。在实际应用中，您应该从服务器端调用 API。

演示中会自动生成对应的 curl 命令，您可以在终端中执行：

'''bash
# 示例 curl 命令
curl -X GET "https://api-sandbox.crypton.studio/v1/merchant" \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json"
'''

## 下一步

- 查看 [API 文档](/zh/api/overview) 了解完整的 API 参考
- 阅读 [集成指南](/zh/integration/getting-started) 学习如何集成
- 查看 [代码示例](/zh/examples/basic-usage) 获取实际的代码示例

## 技术支持

如果您在测试过程中遇到问题，请联系我们的技术支持团队。 