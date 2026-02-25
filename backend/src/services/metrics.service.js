const si = require("systeminformation");
const history = [];

async function generateMetrics() {
    const cpuData = await si.currentLoad();                     //returns load,cores etc.          
    const memData = await si.mem();                             //returns total,available ,used etc.
    const cpu = Math.round(cpuData.currentLoad);

    const memory = Math.round((memData.total - memData.available) / memData.total * 100);

    const requestsPerSecond = Math.floor(Math.random() * 500);      //stimulates traffic load 
    const metric = {
        cpu,
        memory,
        requestsPerSecond,
        timestamp: new Date()
    };
    history.push(metric);
    if (history.length > 100) history.shift();
    return metric;

}
function getHistory() {
    return history;
}

function clearHistory() {
    history.length = 0;
}

module.exports = { generateMetrics, getHistory, clearHistory };
