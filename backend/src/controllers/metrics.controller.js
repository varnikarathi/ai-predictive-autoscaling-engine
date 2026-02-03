const {generateMetrics}=require("../services/metrics.service");
function getCurrentMetrics(req,res){
    const metrics=generateMetrics();
    res.json(metrics);
}
module.exports={getCurrentMetrics};