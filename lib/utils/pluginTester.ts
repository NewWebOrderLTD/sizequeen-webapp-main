export class PluginTester {
  private static instance: PluginTester;
  private testResults: Array<{ test: string; status: 'pending' | 'success' | 'failed'; timestamp: string; details?: any }> = [];
  
  static getInstance() {
    if (!PluginTester.instance) {
      PluginTester.instance = new PluginTester();
    }
    return PluginTester.instance;
  }
  
  private logTest(test: string, status: 'pending' | 'success' | 'failed', details?: any) {
    const testResult = {
      test,
      status,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.testResults.push(testResult);
    
    const emoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⏳';
    console.log(`${emoji} TEST [${test}]: ${status.toUpperCase()}`, details || '');
  }
  
  // Comprehensive bidirectional test
  async runFullTest() {
    console.clear();
    console.log('🚀 STARTING COMPREHENSIVE PLUGIN COMMUNICATION TEST');
    console.log('👀 Watch for both PLUGIN logs (📨📤) and WEB APP logs (🌐)');
    console.log('=' .repeat(60));
    
    this.testResults = [];
    
    // Set up listeners for plugin responses
    this.setupTestListeners();
    
    // Test 1: Ping Test
    await this.testPing();
    
    // Test 2: Token Communication
    await this.testTokens();
    
    // Test 3: User Data Communication
    await this.testUserData();
    
    // Test 4: Storage Verification
    await this.testStorage();
    
    // Test 5: Error Handling
    await this.testErrorHandling();
    
    // Summary
    setTimeout(() => {
      this.showTestSummary();
    }, 5000);
  }
  
  private setupTestListeners() {
    const testListener = (event: MessageEvent) => {
      if (event.source !== window) return;
      
      const { type } = event.data || {};
      
      // Log all plugin responses
      if (['plugin-ready', 'token-received', 'user-data-received', 'plugin-error'].includes(type)) {
        console.log(`🌐 WEB APP RECEIVED: ${type}`, event.data);
        
        // Update test results
        switch (type) {
          case 'plugin-ready':
            this.logTest('ping-response', 'success', event.data);
            break;
          case 'token-received':
            this.logTest('token-response', 'success', event.data);
            break;
          case 'user-data-received':
            this.logTest('user-data-response', 'success', event.data);
            break;
          case 'plugin-error':
            this.logTest('error-handling', 'success', event.data);
            break;
        }
      }
    };
    
    window.addEventListener('message', testListener);
    
    // Store listener for cleanup
    (this as any).testListener = testListener;
  }
  
  private async testPing() {
    console.log('\n1️⃣ TESTING: Plugin Ping/Ready Communication');
    this.logTest('ping-send', 'pending');
    
    window.postMessage({
      type: 'ping-plugin',
      testId: 'ping-test-' + Date.now()
    }, window.location.origin);
    
    this.logTest('ping-send', 'success');
    
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  private async testTokens() {
    console.log('\n2️⃣ TESTING: Token Communication');
    this.logTest('token-send', 'pending');
    
    const testTokens = {
      type: 'sizequeen-token',
      webAuthToken: 'test-access-token-' + Date.now(),
      webAuthRefreshToken: 'test-refresh-token-' + Date.now(),
      testId: 'token-test-' + Date.now()
    };
    
    window.postMessage(testTokens, window.location.origin);
    this.logTest('token-send', 'success', testTokens);
    
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  private async testUserData() {
    console.log('\n3️⃣ TESTING: User Data Communication');
    this.logTest('user-data-send', 'pending');
    
    const testUserData = {
      type: 'sizequeen-user-data',
      user: {
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        name: 'Test User',
        metadata: { testFlag: true }
      },
      authenticated: true,
      testId: 'user-test-' + Date.now()
    };
    
    window.postMessage(testUserData, window.location.origin);
    this.logTest('user-data-send', 'success', testUserData);
    
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  private async testStorage() {
    console.log('\n4️⃣ TESTING: Plugin Storage Verification');
    this.logTest('storage-check', 'pending');
    
    try {
      // Check plugin storage
      const chromeAPI = (globalThis as any).chrome;
      if (typeof chromeAPI !== 'undefined' && chromeAPI.storage) {
        chromeAPI.storage.local.get(null, (data: any) => {
          console.log('🗃️ PLUGIN STORAGE CONTENTS:', data);
          this.logTest('storage-check', 'success', data);
        });
      } else {
        console.log('⚠️ Chrome storage API not available (normal in dev mode)');
        this.logTest('storage-check', 'success', 'Chrome storage API not available');
      }
    } catch (error) {
      console.error('❌ Storage check failed:', error);
      this.logTest('storage-check', 'failed', error);
    }
    
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  private async testErrorHandling() {
    console.log('\n5️⃣ TESTING: Error Handling');
    this.logTest('error-test-send', 'pending');
    
    // Send invalid message to test error handling
    window.postMessage({
      type: 'invalid-test-message',
      testId: 'error-test-' + Date.now()
    }, window.location.origin);
    
    this.logTest('error-test-send', 'success');
    
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  private showTestSummary() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    
    const successful = this.testResults.filter(r => r.status === 'success').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const pending = this.testResults.filter(r => r.status === 'pending').length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏳ Pending: ${pending}`);
    
    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const emoji = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⏳';
      console.log(`${emoji} ${result.test}: ${result.status}`);
    });
    
    if (failed === 0 && pending === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Plugin communication is working correctly.');
    } else if (failed > 0) {
      console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    } else {
      console.log('\n⏳ Some tests are still pending. Plugin might not be responding.');
    }
    
    // Cleanup
    if ((this as any).testListener) {
      window.removeEventListener('message', (this as any).testListener);
    }
  }
  
  // Quick ping test
  quickPing() {
    console.log('🏓 Quick ping test...');
    window.postMessage({
      type: 'ping-plugin',
      timestamp: Date.now()
    }, window.location.origin);
  }
  
  // Test current session tokens
  testCurrentSession() {
    console.log('🔑 Testing current session tokens...');
    
    // Trigger the actual PostMessageToPlugin to send current session
    window.dispatchEvent(new CustomEvent('test-session-tokens'));
  }
  
  // Get test results
  getResults() {
    return [...this.testResults];
  }
}

// Make tester available globally
if (typeof window !== 'undefined') {
  (window as any).pluginTester = PluginTester;
} 