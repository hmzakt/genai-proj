import { runPayroll } from "../services/payrollEngine.service.js";
import { markPayrollReviewed } from "../services/payrollApproval.service.js";
import { approvePayroll } from "../services/payrollLock.service.js";
import { executePayrollPayments } from "../payments/paymentOrchestrator.service.js";
import PayrollRun from "../models/paymentSystem/payrollRun.model.js";
import PayrollItem from "../models/paymentSystem/payrollItem.model.js";


export async function createPayrollRun(req,res){
    try{
        const {periodStart, periodEnd} = req.body;

        const payrollRun = await runPayroll({
            periodStart,
            periodEnd,
            createdBy: req.user.id 
        });

        res.status(201).json(payrollRun);
    } catch(err){
        res.status(400).json({error : err.message});
    }
}


export async function reviewPayroll(req,res){
    try{
        const payrollRun = await markPayrollReviewed(
            req.params.id,
            req.user.id
        );
        res.json(payrollRun);
    }catch(err){
        res.status(400).json({error : err.message});
    }
}


export async function approvePayrollRun(req,res){
    try{
        const payrollRun = await approvePayroll(
            req.params.id,
            req.user.id 
        );
        res.json(payrollRun)
    } catch(err){
        res.status(400).json({error : err.message});
    }
}

export async function payPayroll (req,res){
    try {
    const result = await executePayrollPayments(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


   export async function listPayrollRuns(req,res){
    const runs = await PayrollRun.find().sort({createdAt : -1});
    res.json(runs);
}

export async function getPayrollItems(req, res) {
  const items = await PayrollItem.find({
    payrollRunId: req.params.id,
  }).populate("employeeId");
  res.json(items);
}