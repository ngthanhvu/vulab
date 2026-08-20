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
        githubPush()
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

                    echo "Môi trường deploy: ${deployEnv}"

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
                    string(
                        credentialsId: 'TELEGRAM_TOKEN',
                        variable: 'TELEGRAM_TOKEN'
                    ),
                    string(
                        credentialsId: 'TELEGRAM_CHAT_ID',
                        variable: 'TELEGRAM_CHAT_ID'
                    )
                ]) {
                    sh '''
                        set -e

                        BRANCH_NAME_SAFE="${BRANCH_NAME:-N/A}"

                        MESSAGE="<b>✅ Deploy thành công</b>
Job: ${JOB_NAME}
Build: #${BUILD_NUMBER}
Môi trường: ${DEPLOY_ENV}
Branch: ${BRANCH_NAME_SAFE}"

                        echo "Đang gửi thông báo Telegram..."

                        curl -sS --fail-with-body \
                            -X POST \
                            "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
                            --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
                            --data-urlencode "parse_mode=HTML" \
                            --data-urlencode "text=${MESSAGE}"

                        echo ""
                        echo "Đã gửi Telegram thành công."
                    '''
                }
            }
        }

        failure {
            echo 'Deploy thất bại, kiểm tra log phía trên.'

            script {
                withCredentials([
                    string(
                        credentialsId: 'TELEGRAM_TOKEN',
                        variable: 'TELEGRAM_TOKEN'
                    ),
                    string(
                        credentialsId: 'TELEGRAM_CHAT_ID',
                        variable: 'TELEGRAM_CHAT_ID'
                    )
                ]) {
                    sh '''
                        BRANCH_NAME_SAFE="${BRANCH_NAME:-N/A}"

                        MESSAGE="<b>❌ Deploy thất bại</b>
Job: ${JOB_NAME}
Build: #${BUILD_NUMBER}
Môi trường: ${DEPLOY_ENV}
Branch: ${BRANCH_NAME_SAFE}"

                        echo "Đang gửi thông báo Telegram lỗi..."

                        curl -sS --fail-with-body \
                            -X POST \
                            "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
                            --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
                            --data-urlencode "parse_mode=HTML" \
                            --data-urlencode "text=${MESSAGE}" \
                            || echo "Không gửi được Telegram."

                        echo ""
                    '''
                }
            }
        }

        always {
            echo "Pipeline hoàn tất."
        }
    }
}