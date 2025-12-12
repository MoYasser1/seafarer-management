// src/app/seafarers/models/seafarer.model.spec.ts
import { Seafarer } from './seafarer.model';

describe('SeafarerModel', () => {
  it('should be a valid structure/type', () => {
    const mockSeafarer: Seafarer = {
      Id: 1,              // ✅ Use PascalCase
      EmpId: 101,         // ✅ Use PascalCase
      VisaSponsorId: 201, // ✅ Use PascalCase
      EmployeeName: 'Ahmed',
      EmployeeCode: 'E123',
      SponsorName: 'Sponsor X',
      JobName: 'Captain',
      PassPortIssueDate: new Date(),
      VisaIssueDate: new Date(),
      VisaExpiryDate: new Date(),
      IsActive: true,
    };
    
    expect(mockSeafarer).toBeTruthy(); 
    expect(mockSeafarer.Id).toBe(1);            // ✅ Fixed
    expect(mockSeafarer.EmpId).toBe(101);       // ✅ Fixed
    expect(mockSeafarer.VisaSponsorId).toBe(201); // ✅ Fixed
  });

  it('should allow optional fields to be undefined', () => {
    const minimalSeafarer: Seafarer = {
      EmpId: 102,         // ✅ Fixed
      VisaSponsorId: 202, // ✅ Fixed
      IsActive: false     // ✅ Fixed
    };
    
    expect(minimalSeafarer).toBeTruthy();
    expect(minimalSeafarer.Id).toBeUndefined();
    expect(minimalSeafarer.EmployeeName).toBeUndefined();
  });
});