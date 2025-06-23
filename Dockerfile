# Frontend Dockerfile
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# SvelteKit 빌드
RUN npm run build

# 포트 노출
EXPOSE 4173

# 프로덕션 서버 실행
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"] 