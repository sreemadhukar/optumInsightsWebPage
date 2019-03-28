module.exports = {
    apps: [{
        name: "MyInsightsUI",
        script: "server.js",
        watch: false,
        //args: [-i, max],
        instances: "4",
        exec_mode: "cluster"
    }]
}
