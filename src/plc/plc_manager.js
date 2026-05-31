/**
 * PLC 통신 모듈 뼈대
 *
 * 실제 PLC 프로토콜(Modbus, MC Protocol, EtherNet/IP 등)은 추후 연결 예정입니다.
 * 현재는 console.log 기반의 Dummy 시뮬레이션 코드만 포함합니다.
 */
class PlcManager {
  constructor(options = {}) {
    this.host = options.host ?? "127.0.0.1";
    this.port = options.port ?? 502;
    this.timeoutMs = options.timeoutMs ?? 3000;
    this.reconnectIntervalMs = options.reconnectIntervalMs ?? 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity;

    this.isConnected = false;
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
  }

  /**
   * 공통 타임아웃 처리 래퍼
   * operationPromise가 timeoutMs 안에 끝나지 않으면 Timeout 에러를 발생시킵니다.
   */
  withTimeout(operationPromise, operationName) {
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${operationName} timeout`));
      }, this.timeoutMs);
    });

    return Promise.race([operationPromise, timeoutPromise])
      .catch((error) => {
        if (error.message.includes("timeout")) {
          console.error(`[PLC] ${operationName} 타임아웃 발생! (${this.timeoutMs}ms)`);
        }

        throw error;
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  }

  /**
   * Dummy 지연 함수
   * 실제 구현 시 PLC 통신 라이브러리 호출부로 교체합니다.
   */
  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * PLC 연결
   */
  async connect() {
    console.log(`[PLC] 연결 시도... (${this.host}:${this.port})`);

    try {
      await this.withTimeout(
        this.delay(500).then(() => {
          // Dummy 연결 성공
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log("[PLC] 연결 성공");
        }),
        "Connect"
      );
    } catch (error) {
      this.isConnected = false;
      console.error("[PLC] 연결 실패:", error.message);
      this.startAutoReconnect();
    }
  }

  /**
   * PLC 연결 끊기
   */
  async disconnect() {
    console.log("[PLC] 연결 끊기 시도...");

    this.stopAutoReconnect();

    await this.withTimeout(
      this.delay(300).then(() => {
        this.isConnected = false;
        console.log("[PLC] 연결 끊김");
      }),
      "Disconnect"
    );
  }

  /**
   * PLC 데이터 읽기
   */
  async read(address) {
    if (!this.isConnected) {
      console.warn("[PLC] Read 실패: PLC가 연결되어 있지 않습니다.");
      this.handleConnectionLost();
      return null;
    }

    console.log(`[PLC] 데이터 읽기 요청... address=${address}`);

    try {
      return await this.withTimeout(
        this.delay(400).then(() => {
          // Dummy 읽기 값
          const dummyValue = Math.random() >= 0.5 ? 1 : 0;
          console.log(`[PLC] 데이터 읽기 완료: ${address} = ${dummyValue}`);
          return dummyValue;
        }),
        "Read"
      );
    } catch (error) {
      console.error("[PLC] Read 실패:", error.message);
      this.handleConnectionLost();
      return null;
    }
  }

  /**
   * PLC 데이터 쓰기
   */
  async write(address, value) {
    if (!this.isConnected) {
      console.warn("[PLC] Write 실패: PLC가 연결되어 있지 않습니다.");
      this.handleConnectionLost();
      return false;
    }

    console.log(`[PLC] 데이터 쓰기 요청... address=${address}, value=${value}`);

    try {
      await this.withTimeout(
        this.delay(400).then(() => {
          // Dummy 쓰기 성공
          console.log(`[PLC] 데이터 쓰기 완료: ${address} = ${value}`);
        }),
        "Write"
      );

      return true;
    } catch (error) {
      console.error("[PLC] Write 실패:", error.message);
      this.handleConnectionLost();
      return false;
    }
  }

  /**
   * 통신 끊김 처리
   */
  handleConnectionLost() {
    if (this.isConnected) {
      console.warn("[PLC] 통신 끊김 감지!");
    }

    this.isConnected = false;
    this.startAutoReconnect();
  }

  /**
   * 자동 재연결 시작
   */
  startAutoReconnect() {
    if (this.isReconnecting) {
      return;
    }

    this.isReconnecting = true;
    console.log("[PLC] 자동 재연결 시작");

    this.reconnectTimer = setInterval(async () => {
      if (this.isConnected) {
        this.stopAutoReconnect();
        return;
      }

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("[PLC] 최대 재연결 시도 횟수 초과");
        this.stopAutoReconnect();
        return;
      }

      this.reconnectAttempts += 1;
      console.log(`[PLC] 재연결 중... (${this.reconnectAttempts}회차)`);

      try {
        await this.withTimeout(
          this.delay(500).then(() => {
            // Dummy 재연결 성공
            this.isConnected = true;
            console.log("[PLC] 재연결 성공");
          }),
          "Reconnect"
        );

        this.stopAutoReconnect();
      } catch (error) {
        console.error("[PLC] 재연결 실패:", error.message);
      }
    }, this.reconnectIntervalMs);
  }

  /**
   * 자동 재연결 중지
   */
  stopAutoReconnect() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.isReconnecting = false;
  }

  /**
   * Dummy 테스트용: 강제로 통신 끊김 상태를 만듭니다.
   */
  simulateConnectionLost() {
    console.warn("[PLC] Dummy 통신 끊김 시뮬레이션");
    this.handleConnectionLost();
  }
}

// 브라우저 환경과 Node.js 환경에서 모두 사용할 수 있도록 처리
if (typeof module !== "undefined" && module.exports) {
  module.exports = PlcManager;
}
