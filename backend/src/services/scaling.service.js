let currentInstances=1;
const MAX_INSTANCES=5;
const MIN_INSTANCES=1;

let lastScale=0;
const COOLDOWN=20000;                                      // refresh every 20 seconds


function evaluateScaling(cpuUsage, confidence){
    const now= Date.now();
    if(now-lastScale<COOLDOWN){
        return{action:"COOLDOWN",currentInstances};
    }

    let action="NO_ACTION";

    if(cpuUsage >70 && currentInstances< MAX_INSTANCES && confidence>0.6){
        currentInstances++;
        action="SCALE UP";
        lastScale=now;
    }

    else if(cpuUsage<30 && currentInstances>MIN_INSTANCES && confidence>0.6){
        currentInstances--;
        action="SCALE_DOWN";
        lastScale=now;
    }
    
    return {action,currentInstances};
}
module.exports={evaluateScaling};
