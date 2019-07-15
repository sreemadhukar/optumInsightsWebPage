#!/usr/bin/env groovy

@Library("com.optum.jenkins.pipeline.library@v0.1.24") _

String dockerHost = 'docker.repo1.uhc.com'
String namespace = 'uhcinsights'
String tagBase = "$dockerHost/$namespace"

String oseHost= "https://ocp-ctc-core-nonprod.optum.com"

String oseQaProject = 'pedtst'
String oseDevProject = 'peddev'

String qaOneUiPod = 'pedui1'
String devOneUiPod = 'pedui1'
String devTwoUiPod = 'pedui2'
String devThreeUiPod = 'pedui3'
String devFourUiPod = 'pedui4'

pipeline {
    agent none
    environment {
        DOCKER_CREDENTIALS_ID = 'deploy_id'
        OPENSHIFT_CREDENTIALS_ID = 'deploy_id'
        DEVOPS_METRICS_ENABLED = 'false'
        SONAR_CREDENTIALS_ID = 'Sonar_ID'
        NPM_ID = 'npm_id'
        NODEJS_VERSION = '7.9.0'
    }
    
    stages{
    stage('Web: Build and Deploy Docker Image to DTR - QaOne') {
            when {
                beforeAgent true
                branch 'dev'
            }
            agent {
                label 'docker-nodejs-slave'
            }
            steps {
                glDockerImageBuildPush tag: "$tagBase/ui_int:qaone",
                        dockerHost: 'docker.repo1.uhc.com'
                        dockerCredentialsId: "$env.DOCKER_CREDENTIALS_ID",
                        extraBuildOptions: "--build-arg env_var=dev"
              
                 glDockerImageTag sourceTag: "$tagBase/ui_int:qaone",
                                 destTag: "$tagBase/ui_int:${env.BUILD_NUMBER}"
                 glDockerImagePush dockerCredentialsId: "${env.DOCKER_CREDENTIALS_ID}", 
                     tag:"$tagBase/ui_int:${env.BUILD_NUMBER}",
                     dockerHost: 'docker.repo1.uhc.com'
            }
        }

        stage('OSE Deployment Web - QaOne') {
            when {
                beforeAgent true
                branch 'dev'
            }
            agent {
                label 'docker-maven-slave'
            }
            steps {
                glOpenshiftDeploy credentials: "$env.OPENSHIFT_CREDENTIALS_ID",
                        ocpUrl: "$oseHost",
                        project: "$oseQaProject",
                        serviceName: "$qaOneUiPod",
                        dockerImage: "$tagBase/ui_int:qaone",
                        port: '8000'

            }
        }
      
      stage('Web: Build and Deploy Docker Image to DTR - devOne') {
            when {
                beforeAgent true
                branch 'devOne'
            }
            agent {
                label 'docker-nodejs-slave'
            }
            steps {
                glDockerImageBuildPush tag: "$tagBase/$qaWebRepo:devone",
                        repository: "$devWebRepo",
                        namespace: "$namespace",
                        dockerCredentialsId: "$env.DOCKER_CREDENTIALS_ID",
                        extraBuildOptions: "--build-arg env_var=devone"
            }
        }

        stage('OSE Deployment Web - devOne') {
            when {
                beforeAgent true
                branch 'devOne'
            }
            agent {
                label 'docker-maven-slave'
            }
            steps {
                glOpenshiftDeploy credentials: "$env.OPENSHIFT_CREDENTIALS_ID",
                        ocpUrl: "$oseHost",
                        project: "$oseDevProject",
                        serviceName: "$devOneUiPod",
                        dockerImage: "$tagBase/$devWebRepo:devone",
                        port: '8000'

            }
        }
      
      stage('Web: Build and Deploy Docker Image to DTR - devTwo') {
            when {
                beforeAgent true
                branch 'devTwo'
            }
            agent {
                label 'docker-nodejs-slave'
            }
            steps {
                glDockerImageBuildPush tag: "$tagBase/$devWebRepo:devtwo",
                        repository: "$devWebRepo",
                        namespace: "$namespace",
                        dockerCredentialsId: "$env.DOCKER_CREDENTIALS_ID",
                        extraBuildOptions: "--build-arg env_var=devtwo"
            }
        }

        stage('OSE Deployment Web - devTwo') {
            when {
                beforeAgent true
                branch 'devTwo'
            }
            agent {
                label 'docker-maven-slave'
            }
            steps {
                glOpenshiftDeploy credentials: "$env.OPENSHIFT_CREDENTIALS_ID",
                        ocpUrl: "$oseHost",
                        project: "$oseDevProject",
                        serviceName: "$devTwoUiPod",
                        dockerImage: "$tagBase/$devWebRepo:devtwo",
                        port: '8000'
            }
        }
      
      stage('Web: Build and Deploy Docker Image to DTR - devThree') {
            when {
                beforeAgent true
                branch 'devThree'
            }
            agent {
                label 'docker-nodejs-slave'
            }
            steps {
                glDockerImageBuildPush tag: "$tagBase/ui_devthree:devthree",
                        repository: "$devWebRepo",
                        namespace: "$namespace",
                        dockerCredentialsId: "$env.DOCKER_CREDENTIALS_ID",
                        extraBuildOptions: "--build-arg env_var=devthree"
                glDockerImageTag sourceTag: "$tagBase/ui_devthree:devthree",
                                 destTag: "$tagBase/ui_devthree:${env.BUILD_NUMBER}"
                glDockerImagePush dockerCredentialsId: "${env.DOCKER_CREDENTIALS_ID}", 
                     tag:"$tagBase/ui_devthree:${env.BUILD_NUMBER}",
                     dockerHost: 'docker.repo1.uhc.com'
            }
        }

        stage('OSE Deployment Web - devThree') {
            when {
                beforeAgent true
                branch 'devThree'
            }
            agent {
                label 'docker-maven-slave'
            }
            steps {
                glOpenshiftDeploy credentials: "$env.OPENSHIFT_CREDENTIALS_ID",
                        ocpUrl: "$oseHost",
                        project: "$oseDevProject",
                        serviceName: "$devThreeUiPod",
                        dockerImage: "$tagBase/ui_devthree:devthree",
                        port: '8000'
              
            }
        }
        
      stage('Web: Build and Deploy Docker Image to DTR - devFour') {
            when {
                beforeAgent true
                branch 'devFour'
            }
            agent {
                label 'docker-nodejs-slave'
            }
            steps {
                glDockerImageBuildPush tag: "$tagBase/$devWebRepo:devfour",
                        repository: "$devWebRepo",
                        namespace: "$namespace",
                        dockerCredentialsId: "$env.DOCKER_CREDENTIALS_ID",
                        extraBuildOptions: "--build-arg env_var=devfour"
            }
        }

        stage('OSE Deployment Web - devFour') {
            when {
                beforeAgent true
                branch 'devFour'
            }
            agent {
                label 'docker-maven-slave'
            }
            steps {
                glOpenshiftDeploy credentials: "$env.OPENSHIFT_CREDENTIALS_ID",
                        ocpUrl: "$oseHost",
                        project: "$oseDevProject",
                        serviceName: "$devFourUiPod",
                        dockerImage: "$tagBase/$devWebRepo:devfour",
                        port: '8000'
            }
        }
      }
      
    post {
        always {
            echo 'Email Notification'
            emailext body: "A UI build is completed with $currentBuild.currentResult based on the recent checkins to one of the branches in MyInsights Webui2 repo \n\n" +
                    "Please check here for more details \n" +
                    "${env.JOB_URL} \n\n" +
                    "QA1: https://pedui1-pedtst.ocp-ctc-core-nonprod.optum.com \n\n"+
                    "Sonar Link: Replace <branch> with branch name from which this build was triggered in the below URL \n"+
                    "http://sonar.optum.com/dashboard/index/com.optum.bdapps.ped:UI:<branch> \n\n"+
                    "Note: If this build is from any personal branch (which can be seen from the url), this email can be ignored \n\n"+
                    "If connection to any of the apps is refused, please give a few minutes for pods to fully deploy in OpenShift",
                    subject: "$currentBuild.currentResult-UI Deployment",
                    to: 'myinsights_devops_DL@ds.uhc.com'
        }
    }
}
