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

        stage('Test') {
            steps {
                sh 'docker run --rm -v "$PWD:/app" -w /app node:22 sh -c "apt-get update && apt-get install -y python3 make g++ && npm ci && npm test"'
            }
        }

        stage('Prepare .env') {
            steps {
                // Xóa .env cũ nếu tồn tại để tránh xung đột khi checkout scm
                sh 'rm -f .env'
                withCredentials([file(credentialsId: 'vuthanh-dotenv', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                }
                echo 'Đã copy .env từ Jenkins Credentials.'
            }
        }

        stage('Build & Deploy Docker Compose') {
            steps {
                script {
                    def deployEnv = params.DEPLOY_ENV ?: 'prod'
                    env.DEPLOY_ENV = deployEnv

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
                env.BUILD_DURATION = currentBuild.durationString
                env.BUILD_TIMESTAMP = new Date().format("dd/MM/yyyy HH:mm:ss", TimeZone.getTimeZone("Asia/Ho_Chi_Minh"))

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
                        BRANCH_NAME_SAFE="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')}"
                        COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')
                        COMMIT_AUTHOR_RAW=$(git log -1 --pretty=format:'%an' 2>/dev/null || echo 'N/A')
                        COMMIT_MSG_RAW=$(git log -1 --pretty=format:'%s' 2>/dev/null || echo 'N/A')

                        if command -v python3 >/dev/null 2>&1; then
                            COMMIT_AUTHOR=$(printf '%s' "$COMMIT_AUTHOR_RAW" | python3 -c 'import html,sys; print(html.escape(sys.stdin.read(), quote=True))')
                            COMMIT_MSG=$(printf '%s' "$COMMIT_MSG_RAW" | python3 -c 'import html,sys; print(html.escape(sys.stdin.read(), quote=True))')
                        else
                            COMMIT_AUTHOR="$COMMIT_AUTHOR_RAW"
                            COMMIT_MSG="$COMMIT_MSG_RAW"
                        fi

                        MESSAGE="<b>✅ Deploy thành công</b>
- <b>Job:</b> ${JOB_NAME}
- <b>Build:</b> #${BUILD_NUMBER}
- <b>URL:</b> <a href='${BUILD_URL}'>Open »</a>
- <b>Môi trường:</b> ${DEPLOY_ENV}
- <b>Branch:</b> ${BRANCH_NAME_SAFE}
- <b>Commit:</b> ${COMMIT_HASH}
- <b>Tác giả:</b> ${COMMIT_AUTHOR}
- <b>Nội dung:</b> ${COMMIT_MSG}
- <b>Thời gian chạy:</b> ${BUILD_DURATION}
- <b>Thời điểm:</b> ${BUILD_TIMESTAMP}"

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
                env.BUILD_DURATION = currentBuild.durationString
                env.BUILD_TIMESTAMP = new Date().format("dd/MM/yyyy HH:mm:ss", TimeZone.getTimeZone("Asia/Ho_Chi_Minh"))

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
                        BRANCH_NAME_SAFE="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')}"
                        COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')
                        COMMIT_AUTHOR_RAW=$(git log -1 --pretty=format:'%an' 2>/dev/null || echo 'N/A')
                        COMMIT_MSG_RAW=$(git log -1 --pretty=format:'%s' 2>/dev/null || echo 'N/A')

                        if command -v python3 >/dev/null 2>&1; then
                            COMMIT_AUTHOR=$(printf '%s' "$COMMIT_AUTHOR_RAW" | python3 -c 'import html,sys; print(html.escape(sys.stdin.read(), quote=True))')
                            COMMIT_MSG=$(printf '%s' "$COMMIT_MSG_RAW" | python3 -c 'import html,sys; print(html.escape(sys.stdin.read(), quote=True))')
                        else
                            COMMIT_AUTHOR="$COMMIT_AUTHOR_RAW"
                            COMMIT_MSG="$COMMIT_MSG_RAW"
                        fi

                        MESSAGE="<b>❌ Deploy thất bại</b>
- <b>Job:</b> ${JOB_NAME}
- <b>Build:</b> #${BUILD_NUMBER}
- <b>URL:</b> <a href='${BUILD_URL}'>Open »</a>
- <b>Môi trường:</b> ${DEPLOY_ENV}
- <b>Branch:</b> ${BRANCH_NAME_SAFE}
- <b>Commit:</b> ${COMMIT_HASH}
- <b>Tác giả:</b> ${COMMIT_AUTHOR}
- <b>Nội dung:</b> ${COMMIT_MSG}
- <b>Thời gian chạy:</b> ${BUILD_DURATION}
- <b>Thời điểm:</b> ${BUILD_TIMESTAMP}"

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