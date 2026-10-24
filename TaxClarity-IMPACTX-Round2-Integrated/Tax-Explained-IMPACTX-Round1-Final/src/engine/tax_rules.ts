/** Synthetic teaching/demo calculator. Not a tax filing or professional-advice engine. */
export const TAX_CONFIG_VERSION = 'DEMO-OLD-vs-NEW-FY2024-25';
export interface TaxCalculationResult { regime:'OLD'|'NEW'; grossIncome:number; totalDeductions:number; netTaxableIncome:number; taxComputed:number; cess:number; totalTaxLiability:number; assumptions:string[]; }
export function calculateTax(grossIncome:number, deductions:{section80C:number;section80D:number;standardDeduction:number}):{oldRegime:TaxCalculationResult;newRegime:TaxCalculationResult} {
 const safeIncome=Math.max(0,Number.isFinite(grossIncome)?grossIncome:0);
 const oldEligible=Math.min(Math.max(0,deductions.section80C),150000)+Math.min(Math.max(0,deductions.section80D),25000)+Math.max(0,deductions.standardDeduction);
 const oldNet=Math.max(0,safeIncome-oldEligible); let oldTax=0;
 if(oldNet>1000000) oldTax=112500+(oldNet-1000000)*.30; else if(oldNet>500000) oldTax=12500+(oldNet-500000)*.20; else if(oldNet>250000) oldTax=(oldNet-250000)*.05;
 const newEligible=Math.max(0,deductions.standardDeduction); const newNet=Math.max(0,safeIncome-newEligible); let newTax=0;
 if(newNet>1500000)newTax=150000+(newNet-1500000)*.30; else if(newNet>1200000)newTax=90000+(newNet-1200000)*.20; else if(newNet>900000)newTax=45000+(newNet-900000)*.15; else if(newNet>600000)newTax=15000+(newNet-600000)*.10; else if(newNet>300000)newTax=(newNet-300000)*.05;
 if(oldNet<=500000)oldTax=0; if(newNet<=700000)newTax=0;
 const result=(regime:'OLD'|'NEW',gross:number,ded:number,net:number,tax:number,assumptions:string[]):TaxCalculationResult=>({regime,grossIncome:gross,totalDeductions:ded,netTaxableIncome:net,taxComputed:tax,cess:tax*.04,totalTaxLiability:tax*1.04,assumptions});
 return {oldRegime:result('OLD',safeIncome,oldEligible,oldNet,oldTax,['Demo slab approximation','80C capped at ₹1.5L','80D capped at ₹25K','Rebate simplified; surcharge and special income excluded']),newRegime:result('NEW',safeIncome,newEligible,newNet,newTax,['Demo slab approximation','80C/80D excluded in this simplified model','Rebate simplified; surcharge and special income excluded'])};
}
