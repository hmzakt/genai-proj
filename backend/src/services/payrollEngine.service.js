// read data -> active employees, their payroll profiles, payroll metrics, their incentive rules, tax
// calculate numbers
// produce payroll output

import Employee from "../models/paymentSystem/Employee.model";
import PayrollProfileModel from "../models/paymentSystem/PayrollProfile.model";
import PayrollRun from "../models/paymentSystem/payrollRun.model";




export async function runPayroll({periodStart, periodEnd , createdBy}){
    const payrollRun = await PayrollRun.create({
        periodStart,
        periodEnd,
        createdBy,
        status : "DRAFT",
        locked : false
    });

    const employees = await Employee.find({status : "ACTIVE"});

    for (const employee of employees){
        const profile = await PayrollProfile.findOne({
            employeeId : employee._id,
            effectiveFrom : {$lte : periodEnd},
            $or: [{ effectiveTo: null }, { effectiveTo: { $gte: periodStart } }],
        })
    }

}