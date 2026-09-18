pipeline {
    agent any
    
    environment {
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        GIT_CREDENTIALS = credentials('git-credentials')
        NODE_HOME = tool('Node-18')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/LankeVenkatesh-Java-Developer/Ecommerce_FrontEnd.git',
                    branch: 'main',
                    credentialsId: "${GIT_CREDENTIALS}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh """
                    ${NODE_HOME}/bin/npm install
                """
            }
        }
        
        stage('Lint') {
            steps {
                sh """
                    ${NODE_HOME}/bin/npm run lint
                """
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh """
                    ${NODE_HOME}/bin/npm run test:run
                """
            }
            post {
                always {
                    junit '**/coverage/junit.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                sh """
                    ${NODE_HOME}/bin/npm run build
                """
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t lankevenkatesh/ecommerce-frontend:${BUILD_NUMBER} .
                    docker tag lankevenkatesh/ecommerce-frontend:${BUILD_NUMBER} lankevenkatesh/ecommerce-frontend:latest
                """
            }
        }
        
        stage('Push Docker Image') {
            steps {
                sh """
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    docker push lankevenkatesh/ecommerce-frontend:${BUILD_NUMBER}
                    docker push lankevenkatesh/ecommerce-frontend:latest
                """
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    docker stop ecommerce-frontend || true
                    docker rm ecommerce-frontend || true
                    docker run -d --name ecommerce-frontend -p 3000:80 lankevenkatesh/ecommerce-frontend:latest
                """
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sleep(time: 10, unit: 'SECONDS')
                    sh """
                        curl -f http://localhost:3000 || exit 1
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Frontend build and deployment successful!'
        }
        failure {
            echo 'Frontend build or deployment failed!'
        }
        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
