#!/bin/bash

echo "Testing Docker builds..."

echo "1. Testing frontend build..."
cd frontend
docker build -t test-frontend .
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo "2. Testing backend build..."
cd ../backend
docker build -t test-backend .
if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

echo "3. Testing combined build..."
cd ..
docker build -t test-combined .
if [ $? -eq 0 ]; then
    echo "✅ Combined build successful"
else
    echo "❌ Combined build failed"
    exit 1
fi

echo "🎉 All builds successful!" 