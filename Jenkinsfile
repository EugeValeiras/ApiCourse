#!groovy

properties([
  [
    $class: 'GithubProjectProperty',
    displayName: '',
    projectUrlStr: 'https://github.com/EugeValeiras/ApiCourse'
  ],
  pipelineTriggers([
    [$class: "GitHubPushTrigger"]
  ])
])

def deployApp(app, server, port) {
    try {
        sh "ssh -o StrictHostKeyChecking=no root@${server} pm2 delete ${app}"
    } catch (exception) {
        echo "Can not delete an app that does not exist"
    }

    sh "ssh -o StrictHostKeyChecking=no root@${server} mkdir -p /usr/app/${app}"
    sh "ssh -o StrictHostKeyChecking=no root@${server} rm -rf /usr/app/${app}/*"
    sh "scp -v -o StrictHostKeyChecking=no -r ./ root@${server}:/usr/app/${app}"

    sh "ssh root@${server} pm2 start /usr/app/${app}/jenkins_properties.json"
}

node {

  //Build information
  def buildNumber = env.BUILD_NUMBER
  def branchName = env.BRANCH_NAME
  def workspace = env.WORKSPACE
  def buildUrl = env.BUILD_URL

  // PRINT ENVIRONMENT TO JOB
  echo "workspace directory is $workspace"
  echo "build URL is $buildUrl"
  echo "build Number is $buildNumber"
  echo "branch name is $branchName"
  echo "PATH is $env.PATH"

  try {
    stage("Init") {
        sh "npm -v"
        sh "node -v"
        sh "ng -v"

        deleteDir()
        git branch: branchName, credentialsId: 'github', url: 'https://github.com/EugeValeiras/ApiCourse'
        def changeSet = sh returnStdout: true, script: 'git diff-tree --no-commit-id --name-status -r HEAD'
    }

    stage("Install") {
      sh "npm prune"
      sh "npm install"
      sh "tsc"
    }

    stage("Deploy") {
      deployApp('ApiCourse', '45.55.233.187', 4001)
    }

  } catch (e) {
    echo "Error: ${e}"
    error "Error.."
  }
}
