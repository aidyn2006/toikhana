pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                sh '''
                    docker exec vm5684 bash -c "cd /root/toikhana && git pull origin master && docker compose up -d --build"
                '''
            }
        }
    }
}