export type FixtureStatus = 'ACTIVE' | 'SUPERSEDED' | 'UNVERIFIED' | 'SYNTHETIC_DEMO';
export type FixtureRecord = {
  record_id: string; source_label: string; employer_label?: string; document_version?: string;
  document_type?: string; tax_period: string; salary_income?: number; interest_income?: number;
  tds_amount?: number; status: FixtureStatus; issue_date?: string; correction_reason?: string; supersedes?: string;
};
export const EMPLOYER_RECORDS: FixtureRecord[] = [
 {record_id:'EMP-A-001',source_label:'Demo Employer A',employer_label:'Demo Employer A',document_version:'v1',tax_period:'FY2025-26',document_type:'FORM16',issue_date:'2026-06-15',salary_income:850000,tds_amount:65000,status:'ACTIVE'},
 {record_id:'EMP-B-001',source_label:'Demo Employer B',employer_label:'Demo Employer B',document_version:'v1',tax_period:'FY2025-26',document_type:'FORM16',issue_date:'2026-06-10',salary_income:420000,tds_amount:28000,status:'SUPERSEDED',correction_reason:'Replaced by corrected annual statement',supersedes:'EMP-B-002'},
 {record_id:'EMP-B-002',source_label:'Demo Employer B',employer_label:'Demo Employer B',document_version:'v2',tax_period:'FY2025-26',document_type:'FORM16',issue_date:'2026-07-02',salary_income:445000,tds_amount:30000,status:'ACTIVE',correction_reason:'Corrected annual statement issued by fictional employer',supersedes:'EMP-B-001'},
];
export const CORRECTED_RECORDS: FixtureRecord[] = [
 {record_id:'CORR-EMP-B-002',source_label:'Corrected statement — Demo Employer B',employer_label:'Demo Employer B',document_version:'v2',tax_period:'FY2025-26',document_type:'CORRECTED_FORM16',issue_date:'2026-07-02',salary_income:445000,tds_amount:30000,status:'SYNTHETIC_DEMO',correction_reason:'Corrected annual statement issued by fictional employer',supersedes:'EMP-B-001'},
];
export const PREFILLED_RECORDS: FixtureRecord[] = [
 {record_id:'PREFILL-001',source_label:'Prefilled Demo Summary',document_version:'demo',document_type:'PORTAL_PREFILL',tax_period:'FY2025-26',salary_income:1270000,interest_income:7000,tds_amount:91000,status:'SYNTHETIC_DEMO'},
];
export const BANK_RECORDS: FixtureRecord[] = [
 {record_id:'BANK-001',source_label:'Demo Bank',document_version:'v1',document_type:'BANK_INTEREST',tax_period:'FY2025-26',interest_income:8200,issue_date:'2026-05-25',status:'UNVERIFIED'},
];
export const ALL_RECORDS: FixtureRecord[] = [...EMPLOYER_RECORDS,...CORRECTED_RECORDS,...PREFILLED_RECORDS,...BANK_RECORDS];
