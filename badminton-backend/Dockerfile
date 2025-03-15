FROM node:18-alpine

WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript
RUN npm run build

# Expose port ứng dụng chạy
EXPOSE 8080

# Chạy ứng dụng
CMD ["npm", "run", "start:prod"]
