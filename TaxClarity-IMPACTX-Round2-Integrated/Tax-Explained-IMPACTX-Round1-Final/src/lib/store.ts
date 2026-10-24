'use client';
import { create } from 'zustand';
import { AppendOnlyLedger, type AuditEntry } from './audit';
import { calculateTax } from '../engine/tax_rules';
export type WorkflowState='DRAFT'|'VALIDATING'|'DEFECT_DETECTED'|'REFERRAL_REQUIRED'|'READY_FOR_REVIEW';
export type DemoDocument={id:string;version:number;grossIncome:number;lineItems:Record<string,number>};
export type Report={level:'INFO'|'WARNING'|'HARD_STOP'|'REFERRAL';classification:string;difference:number;explanation:string;sourceIds:string[]};
export interface TaxFact {id:string;category:'DEDUCTION_80C'|'FREELANCE_INCOME'|'BANK_INTEREST';amount:number;description:string;status:'PENDING'|'APPLIED'}
const ledger=new AppendOnlyLedger('DOCUMENT');
const makeReport=(a:DemoDocument,b:DemoDocument):Report=>{
 const x=a.grossIncome,y=b.grossIncome,d=Math.abs(x-y);
 if(x<0||y<0)return {level:'HARD_STOP',classification:'Invalid negative income',difference:d,explanation:'Negative gross income is invalid for this synthetic scenario. Verify source data.',sourceIds:[a.id,b.id]};
 const sum=Object.values(b.lineItems).reduce((n,v)=>n+v,0);
 if(sum!==y)return {level:'HARD_STOP',classification:'Internal Math Contradiction',difference:Math.abs(sum-y),explanation:'The uploaded line items do not sum to the stated gross income.',sourceIds:[b.id]};
 if(d===0)return {level:'INFO',classification:'Exact Match',difference:0,explanation:'The compared gross-income values match. Source validity still requires human review.',sourceIds:[a.id,b.id]};
 if(d<=50)return {level:'INFO',classification:'Rounding Tolerance',difference:d,explanation:'Difference is within the demo ₹50 tolerance.',sourceIds:[a.id,b.id]};
 if(x===y*10||y===x*10)return {level:'HARD_STOP',classification:'Implausible Figure (Typo Risk)',difference:d,explanation:'One value is exactly 10× the other. Check for an extra-zero typo.',sourceIds:[a.id,b.id]};
 return {level:'REFERRAL',classification:'Material Discrepancy',difference:d,explanation:'A material variance cannot be resolved automatically; professional review is recommended.',sourceIds:[a.id,b.id]};
};
interface TaxState {workflowStatus:WorkflowState;prefillDoc:DemoDocument|null;uploadedDoc:DemoDocument|null;discrepancy:Report|null;auditChain:AuditEntry[];lateFacts:TaxFact[];recalculatedSections:string[];loadScenario:(a:DemoDocument,b:DemoDocument)=>Promise<void>;addLateFact:(fact:TaxFact)=>Promise<void>;verifyChainIntegrity:()=>Promise<boolean>;generateReferralExport:()=>string;}
export const useTaxStore=create<TaxState>((set,get)=>({workflowStatus:'DRAFT',prefillDoc:null,uploadedDoc:null,discrepancy:null,auditChain:[],lateFacts:[],recalculatedSections:[],
 loadScenario:async(a,b)=>{set({workflowStatus:'VALIDATING'});const report=makeReport(a,b);const next:WorkflowState=report.level==='HARD_STOP'?'DEFECT_DETECTED':report.level==='REFERRAL'?'REFERRAL_REQUIRED':'READY_FOR_REVIEW';const e=ledger.append({machine:'DOCUMENT',entityId:'RECONCILIATION',from:'DRAFT',to:next==='DEFECT_DETECTED'?'DEFECT_NOTICE':next==='REFERRAL_REQUIRED'?'RESPONSE':'ACCEPTED_FOR_CALC',reason:report.level==='HARD_STOP'?'VALIDATION_FAILED':'VALIDATION_PASSED',sourceDocId:null,actor:'SYSTEM'});set(s=>({prefillDoc:a,uploadedDoc:b,discrepancy:report,workflowStatus:next,auditChain:[...s.auditChain,e]}));},
 addLateFact:async(fact)=>{const s=get();if(s.workflowStatus==='DEFECT_DETECTED'||s.workflowStatus==='REFERRAL_REQUIRED')throw new Error('Resolve the referral gate before applying facts.');const affected=fact.category==='DEDUCTION_80C'?['Old Regime Tax Liability','Total Deductions']:['Gross Income','Net Taxable Income'];const e=ledger.append({machine:'DOCUMENT',entityId:fact.id,from:'DRAFT',to:'VALIDATED',reason:'DEMO_TRANSITION',sourceDocId:null,actor:'USER'});set(st=>({lateFacts:[...st.lateFacts,{...fact,status:'APPLIED'}],recalculatedSections:[...new Set([...st.recalculatedSections,...affected])],workflowStatus:'VALIDATING',auditChain:[...st.auditChain,e]}));},
 verifyChainIntegrity:async()=>ledger.verify().ok,
 generateReferralExport:()=>{const s=get();return JSON.stringify({timestamp:new Date().toISOString(),workflowState:s.workflowStatus,trigger:s.discrepancy?.classification??'User Requested',conflictingRecords:s.discrepancy?.sourceIds??[],auditChainHash:s.auditChain.at(-1)?.hash??null,message:'Automated analysis halted; professional review required. Synthetic demo export.'},null,2);}
}));
export const taxPreview=(gross:number,c80:number,c80d:number)=>calculateTax(gross,{section80C:c80,section80D:c80d,standardDeduction:50000});
