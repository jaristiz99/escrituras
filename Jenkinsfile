pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hola desde Jenkins Pipeline!'
            }
        }
    }
}
Guárdalo como Jenkinsfile (sin extensión) en la raíz del repositorio y haz push. Eso es todo lo mínimo necesario para que Jenkins lo detecte y ejecute.
Si quieres uno un poco más completo pero igual de simple:
groovypipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo '==============================='
                echo 'Iniciando pipeline...'
                echo "Rama: ${env.BRANCH_NAME}"
                echo "Build #: ${env.BUILD_NUMBER}"
                echo '==============================='
            }
        }

        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
                echo 'Repositorio clonado correctamente'
            }
        }

        stage('Build') {
            steps {
                echo 'Etapa de Build — aqui iria tu compilacion'
            }
        }

        stage('Test') {
            steps {
                echo 'Etapa de Test — aqui iran tus pruebas'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Etapa de Deploy — aqui va tu despliegue'
            }
        }
    }

    post {
        success {
            echo 'Pipeline finalizado correctamente'
        }
        failure {
            echo 'Pipeline fallo — revisar logs'
        }
        always {
            echo 'Este mensaje aparece siempre'
        }
    }
}
