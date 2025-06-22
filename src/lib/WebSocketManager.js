export default class WebSocketManager {
  constructor(url, callbacks = {}) {
    this.url = url;
    this.callbacks = callbacks;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    
    this.connect();
  }
  
  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket 연결됨');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.callbacks.onConnect?.();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket 연결 종료');
        this.stopHeartbeat();
        this.callbacks.onDisconnect?.();
        this.reconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        this.callbacks.onError?.(error);
      };
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      this.reconnect();
    }
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'state':
        this.callbacks.onState?.(message.payload);
        break;
      case 'ack':
        this.callbacks.onAck?.(message.payload);
        break;
      case 'error':
        this.callbacks.onError?.(message.payload);
        break;
      case 'pong':
        // Heartbeat 응답
        break;
      default:
        console.warn('알 수 없는 메시지 타입:', message.type);
    }
  }
  
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket이 연결되지 않음');
    }
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('최대 재연결 시도 횟수 초과');
      this.callbacks.onMaxReconnectReached?.();
    }
  }
  
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // 30초마다 ping
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  close() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  getConnectionState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }
  
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
} 