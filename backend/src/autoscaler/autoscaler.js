const {generateMetrics}=require("../services/metrics.service");
const {evaluateScaling}=require("../services/scaling.service");
function startAutoScaler(){
    setInterval(()=>{
        const metrics=generateMetrics();
        const scalingDecision=evaluateScaling(metrics.cpu);
        console.log("==============AUTOSCALER================");
        console.log("CPU:",metrics.cpu);
        console.log("Memory:",metrics.memory);
        console.log("Requests/Sec:",metrics.requestsPerSecond);
        console.log("Scaling Action:",scalingDecision.action);
        console.log("Current Instances:",scalingDecision.currentInstances)
    },5000);
}
module.exports={startAutoScaler};