pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // à configurer dans Jenkins
        DOCKERHUB_USER = 'yassinex'
        IMAGE_PREFIX = "${DOCKERHUB_USER}/nexthealth"
    }

    stages {

        stage('Cloner le projet') {
            steps {
                git branch: 'main', url: 'https://github.com/Yasine12-ux/next_health_clean.git'
            }
        }

        stage('Build Frontend Angular') { 
            steps {
                dir('front') {
                    sh 'npm install'
                    sh '''#!/bin/bash
ng build --configuration production &
pid=$!
while kill -0 $pid 2>/dev/null; do
  echo "Angular build en cours..."
  sleep 30
done
wait $pid
'''
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
                withDockerRegistry([credentialsId: 'dockerhub-creds' , url: 'https://index.docker.io/v1/']) {
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
                    sh 'scp docker-compose.yml ubuntu@IP_DU_VPS:/home/ubuntu/'
                    sh 'ssh ubuntu@IP_DU_VPS "cd /home/ubuntu && docker compose pull && docker compose up -d"'
                }
            }
        }
    }
}
