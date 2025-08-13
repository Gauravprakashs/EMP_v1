pipeline {
  agent any
  environment {
    MONGO_URI = credentials('mongo-uri')
    JWT_SECRET = credentials('jwt-secret')
    OPENAI_API_KEY = credentials('openai-key')
  }
  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/<your-username>/<your-repo>.git'
      }
    }
    stage('Build Docker Images') {
      steps {
        sh 'docker build -t emp-frontend ./frontend'
        sh 'docker build -t emp-backend ./backend'
      }
    }
    stage('Run Containers') {
      steps {
        sh 'docker stop emp-frontend || true && docker rm emp-frontend || true'
        sh 'docker stop emp-backend || true && docker rm emp-backend || true'
        sh 'docker run -d --name emp-backend --env-file ./backend/.env -p 5000:5000 emp-backend'
        sh 'docker run -d --name emp-frontend -p 80:80 emp-frontend'
      }
    }
  }
}
