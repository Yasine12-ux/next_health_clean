pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // à configurer dans Jenkins
        DOCKERHUB_USER = 'yassinex'
        IMAGE_PREFIX = "${DOCKERHUB_USER}/nexthealth"
        CACHE_DIR = "${env.WORKSPACE}/.npm_cache"
    }

    stages {
        stage('Cloner le projet') {
            steps {
                git branch: 'main', url: 'https://github.com/Yasine12-ux/next_health_clean.git'
            }
        }

        stage('Restaurer le cache Angular') {
            steps {
                dir('front') {
                    script {
                        if (!fileExists('node_modules') && fileExists("${CACHE_DIR}/node_modules.tar.gz")) {
                            echo "🔁 Restauration de node_modules depuis le cache"
                            sh "tar -xzf ${CACHE_DIR}/node_modules.tar.gz"
                        } else {
                            echo "🚫 Aucun cache trouvé ou déjà restauré"
                        }
                    }
                }
            }
        }

        stage('Build Frontend Angular') {
            steps {
                dir('front') {
                    sh 'npm ci'

                    timeout(time: 10, unit: 'MINUTES') {
                        sh '''#!/bin/bash
ng build --configuration production &
pid=$!
while kill -0 $pid 2>/dev/null; do
  echo "⏳ Angular build en cours..."
  sleep 20
done
wait $pid
'''
                    }

                    script {
                        echo "💾 Sauvegarde du cache node_modules"
                        sh "mkdir -p ${CACHE_DIR}"
                        sh "tar -czf ${CACHE_DIR}/node_modules.tar.gz node_modules"
                    }

                    sh "docker build -t $IMAGE_PREFIX:frontend-latest ."
                }
            }
        }

        stage('Build Microservices Spring Boot') {
            steps {
                script {
                    def services = ['api-gateway-auth', 'appointments', 'discovery', 'config-server', 'medical-record']
                    services.each { svc ->
                        dir("${svc}") {
                            sh './mvnw clean package -DskipTests || mvn clean package -DskipTests'
                            sh "docker build -t $IMAGE_PREFIX:${svc}-latest ."
                        }
                    }
                }
            }
        }

        stage('Pusher les images vers Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: 'https://index.docker.io/v1/']) {
                    script {
                        def images = ['frontend', 'api-gateway-auth', 'appointments', 'discovery', 'config-server', 'medical-record']
                        images.each { img ->
                            sh "docker push $IMAGE_PREFIX:${img}-latest"
                        }
                    }
                }
            }
        }

        stage('Déployer sur VPS') {
            steps {
                sshagent (credentials: ['vps-ssh-key']) {
                    sh 'scp docker-compose.yml ubuntu@135.125.191.162:/home/ubuntu/'
                    sh 'ssh ubuntu@135.125.191.162 "cd /home/ubuntu && docker compose pull && docker compose up -d"'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Déploiement réussi sur le VPS !"
        }
        failure {
            echo "❌ Le pipeline a échoué. Consultez les logs pour plus d’infos."
        }
    }
}
