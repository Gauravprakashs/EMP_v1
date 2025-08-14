pipeline {
    agent any

    environment {
        // Injected from Jenkins credentials
        MONGO_URI   = credentials('mongo-uri-id')       // MongoDB Atlas URI
        JWT_SECRET  = credentials('jwt-secret-id')       // JWT secret
        PORT        = credentials('backend-port-id')     // Backend port (e.g., 5000)
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/your/repo.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("mern-app:${env.BUILD_ID}")
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    dockerImage.run(
                        "-p ${PORT}:${PORT} " +
                        "-e MONGO_URI=${MONGO_URI} " +
                        "-e JWT_SECRET=${JWT_SECRET} " +
                        "-e PORT=${PORT}"
                    )
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
    }
}
