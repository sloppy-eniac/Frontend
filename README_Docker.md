# CPU 시뮬레이터 Docker 실행 가이드

## 전체 시스템 실행

### Docker Compose로 전체 시스템 실행
```bash
# 프로젝트 루트 디렉토리에서 실행
docker-compose up --build
```

- CPU 백엔드: http://localhost:8080
- 프론트엔드: http://localhost:4173

### 서비스 중지
```bash
docker-compose down
```

## 개별 서비스 실행

### CPU 백엔드만 실행
```bash
cd cpu
docker build -t cpu-simulator-backend .
docker run -p 8080:8080 cpu-simulator-backend
```

### 프론트엔드만 실행
```bash
cd Frontend
docker build -t cpu-simulator-frontend .
docker run -p 4173:4173 cpu-simulator-frontend
```

## 개발 환경 설정

### 환경 변수 설정
프론트엔드에서 백엔드 WebSocket 연결을 위한 환경 변수:
```bash
# .env 파일 생성 (Frontend/.env)
VITE_CPU_WEBSOCKET_URL=ws://localhost:8080
```

### 로그 확인
```bash
# 모든 서비스 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f cpu-backend
docker-compose logs -f frontend
```

## 문제 해결

### 포트 충돌 시
docker-compose.yml에서 포트 변경:
```yaml
services:
  cpu-backend:
    ports:
      - "8081:8080"  # 8080 대신 8081 사용
  frontend:
    ports:
      - "4174:4173"  # 4173 대신 4174 사용
```

### 캐시 정리
```bash
# 이미지 재빌드 (캐시 무시)
docker-compose build --no-cache

# 사용하지 않는 이미지/컨테이너 정리
docker system prune -a
```

## 시스템 요구사항
- Docker 20.10+
- Docker Compose 2.0+
- 최소 2GB RAM
- 포트 8080, 4173 사용 가능 