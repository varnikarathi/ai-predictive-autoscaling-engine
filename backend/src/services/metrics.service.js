function generateMetrics(){
    const cpu=Math.floor(Math.random()*100);
    const memory=Math.floor(Math.random()*100);
    const requestsPerSecond=Math.floor(Math.random()*500);
    return {
        cpu,
        memory,
        requestsPerSecond,
        timestamp:new Date()
    };
}
module.exports={generateMetrics};
