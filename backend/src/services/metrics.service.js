const os=require("os");
function generateMetrics(){
    const cpuLoad=os.loadavg()[0];                            // 1 minute load average
    const totalMem=os.totalmem();
    const freeMem=os.freemem();

    const cpu=Math.min(Math.floor(cpuLoad*20),100);

    const memory=Math.round(((totalMem-freeMem)/totalMem)*100);

    const requestsPerSecond=Math.floor(Math.random()*500);
    return {
        cpu,
        memory,
        requestsPerSecond,
        timestamp:new Date()
    };
}
module.exports={generateMetrics};
