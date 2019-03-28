#!/usr/bin/env groovy


@Library("com.optum.jenkins.pipeline.library@v0.1.23") _

String dockerHost = 'docker.optum.com'
String namespace = 'fspeddeply'
String tagBase = "$dockerHost/$namespace"

String qaWebRepo = 'pedweb_tst'

String oseHost= "https://ocp-ctc-core-nonprod.optum.com"

String oseQaProject = 'pedtst'

String qaOneUiPod = 'pedui1'

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
                glDockerImageBuildPush tag: "$tagBase/$qaWebRepo:qaone",
                        repository: "$qaWebRepo",
                        namespace: "$namespace",
                        dockerCredentialsId: "$env.DOCKER_CREDENTIALS_ID"
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
                        dockerImage: "$tagBase/$qaWebRepo:qaone",
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
