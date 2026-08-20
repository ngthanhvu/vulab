pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['prod', 'dev'],
            description: 'Chọn môi trường để build & deploy'
        )
    }

    triggers {
        // Tùy chọn 1: Polling mỗi 5 phút (dễ dùng, không cần webhook từ GitHub)
        pollSCM('H/5 * * * *')

        // Tùy chọn 2: Dùng GitHub webhook (nhanh hơn, cần plugin GitHub Integration).
        // Hãy thay thế dòng pollSCM bằng dòng dưới nếu bạn đã cài GitHub plugin + webhook.
        // githubPush()
    }

    stages {
        stage('Checkout source') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy Docker Compose') {
            steps {
                script {
                    def deployEnv = params.DEPLOY_ENV ?: 'prod'
                    echo "Môi trưng deploy: ${deployEnv}"

                    sh 'chmod +x run-build.sh'
                    sh "./run-build.sh ${deployEnv}"
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy thành công!'
            script {
                withCredentials([
                    string(credentialsId: 'TELEGRAM_TOKEN', variable: 'TELEGRAM_TOKEN'),
                    string(credentialsId: 'TELEGRAM_CHAT_ID', variable: 'TELEGRAM_CHAT_ID')
                ]) {
                    sh """
                        curl -s -X POST "https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendMessage" \\
                            -d "chat_id=\${TELEGRAM_CHAT_ID}" \\
                            -d "parse_mode=HTML" \\
                            -d "text=<b>✅ Deploy thành công</b><br>Job: ${env.JOB_NAME}<br>Build: #${env.BUILD_NUMBER}<br>Môi trường: ${params.DEPLOY_ENV}<br>Branch: ${env.BRANCH_NAME ?: 'N/A'}"
                    """
                }
            }
        }
        failure {
            echo 'Deploy thất bại, kiểm tra log phía trên.'
            script {
                withCredentials([
                    string(credentialsId: 'TELEGRAM_TOKEN', variable: 'TELEGRAM_TOKEN'),
                    string(credentialsId: 'TELEGRAM_CHAT_ID', variable: 'TELEGRAM_CHAT_ID')
                ]) {
                    sh """
                        curl -s -X POST "https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendMessage" \\
                            -d "chat_id=\${TELEGRAM_CHAT_ID}" \\
                            -d "parse_mode=HTML" \\
                            -d "text=<b>❌ Deploy thất bại</b><br>Job: ${env.JOB_NAME}<br>Build: #${env.BUILD_NUMBER}<br>Môi trường: ${params.DEPLOY_ENV}<br>Branch: ${env.BRANCH_NAME ?: 'N/A'}"
                    """
                }
            }
        }
    }
}
