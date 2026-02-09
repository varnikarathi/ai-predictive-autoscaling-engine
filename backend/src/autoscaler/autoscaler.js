const {generateMetrics}=require("../services/metrics.service");
const LinearRegression=require("../../../ai/predictor");
const {evaluateScaling}=require("../services/scaling.service");

const model =new LinearRegression();
const cpuHistory=[];

function startAutoScaler(){
    setInterval(async ()=>{

        const metrics= await generateMetrics();
        cpuHistory.push(metrics.cpu);

        if(cpuHistory.length>10)cpuHistory.shift();

        let predictedCPU=metrics.cpu;
        let confidence=0;

        if(cpuHistory.length>=6){
            model.train(cpuHistory);
            predictedCPU=model.predict(cpuHistory.length+1);
            confidence=model.confidence(cpuHistory);
        }

        const scalingDecision=evaluateScaling(predictedCPU,confidence);

        console.log("==============AUTOSCALER================");
        console.log({
            currentCPU: metrics.cpu,
            predictedCPU: Math.round(predictedCPU),
            confidence: Math.round(confidence*100)+"%",
            action: scalingDecision.action,
            instances: scalingDecision.currentInstances
        });
        console.log("========================================");
    },5000);
}
module.exports={startAutoScaler};