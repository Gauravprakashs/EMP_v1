pipeline {
    agent any

    environment {
        MONGO_URI      = credentials('mongo-uri-id')
        JWT_SECRET     = credentials('jwt-secret-id')
        PORT           = credentials('backend-port-id')
        CONTAINER_NAME = "mern-app-container"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'deploy', url: 'https://github.com/Gauravprakashs/Employee_Directory.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("mern-app:${env.BUILD_ID}")
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    sh """
                        if [ \$(docker ps -q -f name=${CONTAINER_NAME}) ]; then
                            echo "Stopping existing container..."
                            docker stop ${CONTAINER_NAME}
                            docker rm ${CONTAINER_NAME}
                        fi
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh """
                        docker run -d \
                          --name ${CONTAINER_NAME} \
                          -p ${PORT}:${PORT} \
                          -e MONGO_URI='${MONGO_URI}' \
                          -e JWT_SECRET='${JWT_SECRET}' \
                          -e PORT='${PORT}' \
                          mern-app:${env.BUILD_ID}
                    """
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
