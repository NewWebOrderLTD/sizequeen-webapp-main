export class PluginDebugger {
  private static instance: PluginDebugger;
  private messageLog: Array<{ timestamp: string; direction: 'sent' | 'received'; data: any }> = [];
  
  static getInstance() {
    if (!PluginDebugger.instance) {
      PluginDebugger.instance = new PluginDebugger();
    }
    return PluginDebugger.instance;
  }
  
  logMessage(direction: 'sent' | 'received', data: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      direction,
      data: JSON.parse(JSON.stringify(data)) // Deep clone to avoid reference issues
    };
    
    this.messageLog.push(logEntry);
    
    // Keep only last 50 messages to prevent memory issues
    if (this.messageLog.length > 50) {
      this.messageLog = this.messageLog.slice(-50);
    }
    
    console.log(`🔍 Plugin Debug [${direction.toUpperCase()}]:`, logEntry);
  }
  
  getMessageLog() {
    return [...this.messageLog];
  }
  
  clearLog() {
    this.messageLog = [];
    console.log('🧹 Plugin debug log cleared');
  }
  
  exportLog() {
    const logData = {
      exportTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      origin: window.location.origin,
      messages: this.messageLog
    };
    
    console.log('📊 Plugin Communication Log Export:', logData);
    return logData;
  }
  
  // Helper to manually test plugin communication
  static testCommunication() {
    const instance = PluginDebugger.getInstance();
    
    console.log('🧪 Testing plugin communication...');
    
    // Send test message
    window.postMessage({
      type: 'webapp-test',
      message: 'Testing communication from webapp',
      timestamp: new Date().toISOString()
    }, window.location.origin);
    
    instance.logMessage('sent', {
      type: 'webapp-test',
      message: 'Testing communication from webapp'
    });
    
    console.log('✅ Test message sent. Check plugin logs for response.');
  }
}

// Make debugger available globally for manual testing
if (typeof window !== 'undefined') {
  (window as any).pluginDebugger = PluginDebugger;
} 