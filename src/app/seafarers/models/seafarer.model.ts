// src/app/seafarers/models/seafarer.model.ts

// ✅ الـ Model الأساسي حسب API Response
export interface Seafarer {
  Id?: number;
  EmpId: number;
  VisaSponsorId: number;

  // Passport Info
  PassportNumber?: string;
  PassPortIssueDate?: Date | string | null;
  IDExPiryDate?: Date | string | null;
  PassportExpireDate?: Date | string; // Alias for IDExPiryDate

  // Visa Info
  VisaIssueDate?: Date | string | null;
  VisaExpiryDate?: Date | string | null;
  VisaUAEIdNO?: string;
  ResidenceNumber?: string;

  // Seaman Book
  SeamanBookNO?: string;
  SeamanIssueDate?: Date | string | null;
  SeamanExpiryDate?: Date | string | null;

  // CICPA
  CicpaNO?: string;
  CicpaIssueDate?: Date | string | null;
  CicpaExpiryDate?: Date | string | null;

  // Personal Info
  Nationality?: string;
  BirthDate?: Date | string;
  Age?: number;
  NameOfSpouse?: string;
  NoOfChildren?: number;
  BodyWeight?: number;
  Height?: number;
  NearestAirport?: string;
  SkypeID?: string;

  // Contact Info
  Phone?: string;
  Mobile?: string;
  Email?: string;
  NationalId?: string;

  // Addresses & Contacts
  PermanentAddressHomeCountry?: string;
  ContactNumberHomeCountry?: string;
  ContactNameAndNumberDuringEmergenciesUAE?: string;
  ContactNameAndNumberDuringEmergenciesHome?: string;

  // Employment Info
  EmploymentDate?: Date | string;
  InsuranceDate?: Date | string;

  // Medical & Declaration
  Declaration?: string;
  SignedOffFromAShipDueToMedicalReason?: boolean;
  SignedOffFromAShipDueToMedicalReasonComment?: string;
  UndergoneAnyMdicalOperation?: boolean;
  UndergoneAnyMdicalOperationComment?: string;
  DoctorConsultation?: boolean;
  DoctorConsultationComment?: string;
  HealthOrDisabilityProblem?: boolean;
  HealthOrDisabilityProblemComment?: string;
  InquiryOrInvolvedMaritimeAccident?: boolean;
  InquiryOrInvolvedMaritimeAccidentComment?: string;
  LicenseSuspendedOrRevoked?: boolean;
  LicenseSuspendedOrRevokedComment?: string;

  Remarks?: string;

  // Next of Kin
  KinName?: string;
  KinPhone?: string;
  KinEmail?: string;

  // Status (1=Active, 2=Inactive, etc.)
  Status?: number;

  // From Employee & Vendor dropdowns
  EmployeeName?: string;
  EmployeeCode?: string;
  JobName?: string;
  SponsorName?: string;

  // Status
  IsActive?: boolean;
}

// ✅ Qualification Model
export interface Qualification {
  Id?: number;
  DegreeOrCourse: string;
  CourseIssueDate: Date | string;
  ExpiryDate?: Date | string;
  MajorOrSubject?: string;
  University?: string;
  Country?: string;
  Type: number; // 1=Education, 3=STCW, etc.
}

// ✅ Certificate Model
export interface Certificate {
  Id?: number;
  Capacity: string;
  Regulation?: string;
  IssueDate: Date | string;
  ExpiryDate?: Date | string;
  IssuingAuthority?: string;
  Limitations?: string;
  Country?: string;
  Type: number; // 1=Safety Training, 2=License, etc.
}

// ✅ Language Model
export interface Language {
  Id?: number;
  Capacity: string; // Language name
  Regulation?: string; // Proficiency level
  IssueDate?: Date | string;
  ExpiryDate?: Date | string;
  IssuingAuthority?: string;
  Limitations?: string;
  Country?: string;
}

// ✅ Reference Model
export interface Reference {
  Id?: number;
  PersonName: string;
  CompanyName?: string;
  Country?: string;
  Fax?: string;
  EmailId?: string;
}

// ✅ Work Experience Model
export interface WorkExperience {
  Id?: number;
  VesselName: string;
  VesselType?: string;
  Rank?: string;
  From: Date | string;
  To?: Date | string;
  GRT?: string;
  BHP?: string;
  CompanyName?: string;
}

// ✅ Employee Dropdown
export interface Employee {
  EmpId: number;
  EmpName: string;
  EmpCode?: string;
  JobName?: string;
}

// ✅ Vendor Dropdown
export interface Vendor {
  VendorId: number;
  VendorName: string;
  VendorCode?: string;
}

// ✅ Save Request (للإرسال للـ API)
export interface SaveSeafarerRequest {
  entity: Seafarer;
  Qualifications: Qualification[];
  Certificates: Certificate[];
  Languages: Language[];
  References: Reference[];
  WorkExperiences: WorkExperience[];
}

// ✅ API Response
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  // API قد يرجع البيانات مباشرة بدون wrapper
  [key: string]: any;
}