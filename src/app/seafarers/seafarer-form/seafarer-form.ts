// src/app/seafarers/seafarer-form/seafarer-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  SaveSeafarerRequest,
  Seafarer,
  Employee,
  Vendor,
  Qualification,
  Certificate,
  Language,
  Reference,
  WorkExperience
} from '../models/seafarer.model';
import { SeafarerService } from '../services/seafarer';

@Component({
  selector: 'app-seafarer-form',
  templateUrl: './seafarer-form.html',
  styleUrls: ['./seafarer-form.css']
})
export class SeafarerFormComponent implements OnInit {
  seafarerForm!: FormGroup;
  isEditMode = false;
  seafarerId?: number;
  loadedSeafarer?: Seafarer;

  employees: Employee[] = [];
  vendors: Vendor[] = [];

  isLoading = false;
  isSaving = false;
  isLoadingDropdowns = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private fb: FormBuilder,
    private seafarerService: SeafarerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
    this.checkEditMode();
  }

  /**
   * Form initialization
   */
  initializeForm(): void {
    this.seafarerForm = this.fb.group({
      // Basic Info
      empId: [{ value: '', disabled: false }, Validators.required],
      visaSponsorId: [{ value: '', disabled: false }, Validators.required],

      // Passport
      passportNumber: ['', Validators.required],
      passportIssueDate: ['', Validators.required],
      passportExpiryDate: ['', Validators.required],

      // Personal Info
      BirthDate: [''],
      Phone: [''],
      NationalId: [''],
      EmploymentDate: [''],
      InsuranceDate: [''],

      // Visa
      visaNumber: [''],
      visaIssueDate: [''],
      visaExpiryDate: [''],

      // Contract
      contractStartDate: [''],
      contractEndDate: [''],
      isActive: [true],

      // API Fields
      ResidenceNumber: [''],
      SeamanBookNO: [''], // Will auto-generate if empty
      SeamanIssueDate: [''],
      SeamanExpiryDate: [''],
      CicpaNO: [''],
      CicpaIssueDate: [''],
      CicpaExpiryDate: [''],
      NameOfSpouse: [''],
      NoOfChildren: [0],
      BodyWeight: [0],
      Height: [0],
      NearestAirport: [''],
      SkypeID: [''],
      PermanentAddressHomeCountry: [''],
      ContactNumberHomeCountry: [''],
      ContactNameAndNumberDuringEmergenciesUAE: [''],
      ContactNameAndNumberDuringEmergenciesHome: [''],

      // Next of Kin
      KinName: [''],
      KinPhone: [''],
      KinEmail: [''],

      Declaration: [''],
      SignedOffFromAShipDueToMedicalReason: [false],
      SignedOffFromAShipDueToMedicalReasonComment: [''],
      UndergoneAnyMdicalOperation: [false],
      UndergoneAnyMdicalOperationComment: [''],
      DoctorConsultation: [false],
      DoctorConsultationComment: [''],
      HealthOrDisabilityProblem: [false],
      HealthOrDisabilityProblemComment: [''],
      InquiryOrInvolvedMaritimeAccident: [false],
      InquiryOrInvolvedMaritimeAccidentComment: [''],
      LicenseSuspendedOrRevoked: [false],
      LicenseSuspendedOrRevokedComment: [''],
      Remarks: [''],

      // Arrays
      Qualifications: this.fb.array([]),
      Certificates: this.fb.array([]),
      Languages: this.fb.array([]),
      References: this.fb.array([]),
      WorkExperiences: this.fb.array([])
    });
  }

  /**
   * Load Dropdown Data
   */
  loadDropdownData(): void {
    this.isLoadingDropdowns = true;

    // Disable dropdowns while loading
    this.seafarerForm.get('empId')?.disable();
    this.seafarerForm.get('visaSponsorId')?.disable();

    // Load Employees
    this.seafarerService.getEmployees().subscribe({
      next: (data) => {
        console.log('Raw Employees Response:', data);
        this.employees = data;
        this.seafarerForm.get('empId')?.enable();
        console.log('Employees loaded:', data.length);
        if (data.length === 0) {
          this.showToastMessage('تحذير: لا يوجد موظفين في النظام', 'info');
        }
      },
      error: (error) => {
        console.error('Failed to load employees:', error);
        this.showToastMessage('فشل تحميل الموظفين: ' + error.message, 'error');
        this.seafarerForm.get('empId')?.enable();
      }
    });

    // Load Vendors with enhanced debugging
    console.log('Loading Vendors...');
    this.seafarerService.getVendors().subscribe({
      next: (data) => {
        console.log('Vendors Response:', data);
        console.log('Vendors Count:', data?.length);

        if (data && data.length > 0) {
          console.log('First vendor sample:', data[0]);
        }

        this.vendors = data || [];
        this.seafarerForm.get('visaSponsorId')?.enable();
        this.isLoadingDropdowns = false;

        console.log('Vendors loaded successfully:', this.vendors.length);
        console.log('Vendors array:', this.vendors);

        if (this.vendors.length === 0) {
          this.showToastMessage('No vendors found. Please contact admin.', 'error');
        }
      },
      error: (error) => {
        console.error('Failed to load vendors:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });

        this.vendors = [];
        this.showToastMessage('فشل تحميل الكفلاء: ' + error.message, 'error');
        this.seafarerForm.get('visaSponsorId')?.enable();
        this.isLoadingDropdowns = false;
      }
    });
  }

  checkEditMode(): void {
    // Use take(1) to prevent multiple subscriptions
    this.route.params.pipe().subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.seafarerId = +params['id'];
        console.log('Edit mode detected for seafarer ID:', this.seafarerId);
        this.loadSeafarerData(this.seafarerId);
      }
    });
  }

  loadSeafarerData(id: number): void {
    // Prevent multiple loads
    if (this.isLoading) {
      console.log('Already loading seafarer data, skipping...');
      return;
    }

    this.isLoading = true;
    console.log('Loading seafarer data for ID:', id);

    this.seafarerService.getSeafarerById(id).subscribe({
      next: (seafarer) => {
        console.log('Seafarer data loaded:', seafarer);

        // Store the complete loaded seafarer data
        this.loadedSeafarer = seafarer;

        // Patch form with data
        this.seafarerForm.patchValue({
          empId: seafarer.EmpId,
          visaSponsorId: seafarer.VisaSponsorId,
          passportIssueDate: this.formatDateForInput(seafarer.PassPortIssueDate),
          passportExpiryDate: this.formatDateForInput(seafarer.IDExPiryDate),
          visaNumber: seafarer.VisaUAEIdNO,
          visaIssueDate: this.formatDateForInput(seafarer.VisaIssueDate),
          visaExpiryDate: this.formatDateForInput(seafarer.VisaExpiryDate),
          ResidenceNumber: seafarer.ResidenceNumber,
          SeamanBookNO: seafarer.SeamanBookNO,
          SeamanIssueDate: this.formatDateForInput(seafarer.SeamanIssueDate),
          SeamanExpiryDate: this.formatDateForInput(seafarer.SeamanExpiryDate),
          CicpaNO: seafarer.CicpaNO,
          CicpaIssueDate: this.formatDateForInput(seafarer.CicpaIssueDate),
          CicpaExpiryDate: this.formatDateForInput(seafarer.CicpaExpiryDate),
          NameOfSpouse: seafarer.NameOfSpouse,
          NoOfChildren: seafarer.NoOfChildren || 0,
          BodyWeight: seafarer.BodyWeight || 0,
          Height: seafarer.Height || 0,
          NearestAirport: seafarer.NearestAirport,
          SkypeID: seafarer.SkypeID,
          PermanentAddressHomeCountry: seafarer.PermanentAddressHomeCountry,
          ContactNumberHomeCountry: seafarer.ContactNumberHomeCountry,
          ContactNameAndNumberDuringEmergenciesUAE: seafarer.ContactNameAndNumberDuringEmergenciesUAE,
          ContactNameAndNumberDuringEmergenciesHome: seafarer.ContactNameAndNumberDuringEmergenciesHome,
          BirthDate: this.formatDateForInput(seafarer.BirthDate),
          Phone: seafarer.Phone,
          NationalId: seafarer.NationalId,
          EmploymentDate: this.formatDateForInput(seafarer.EmploymentDate),
          InsuranceDate: this.formatDateForInput(seafarer.InsuranceDate),
          Declaration: seafarer.Declaration,
          SignedOffFromAShipDueToMedicalReason: seafarer.SignedOffFromAShipDueToMedicalReason || false,
          SignedOffFromAShipDueToMedicalReasonComment: seafarer.SignedOffFromAShipDueToMedicalReasonComment,
          UndergoneAnyMdicalOperation: seafarer.UndergoneAnyMdicalOperation || false,
          UndergoneAnyMdicalOperationComment: seafarer.UndergoneAnyMdicalOperationComment,
          DoctorConsultation: seafarer.DoctorConsultation || false,
          DoctorConsultationComment: seafarer.DoctorConsultationComment,
          HealthOrDisabilityProblem: seafarer.HealthOrDisabilityProblem || false,
          HealthOrDisabilityProblemComment: seafarer.HealthOrDisabilityProblemComment,
          InquiryOrInvolvedMaritimeAccident: seafarer.InquiryOrInvolvedMaritimeAccident || false,
          InquiryOrInvolvedMaritimeAccidentComment: seafarer.InquiryOrInvolvedMaritimeAccidentComment,
          LicenseSuspendedOrRevoked: seafarer.LicenseSuspendedOrRevoked || false,
          LicenseSuspendedOrRevokedComment: seafarer.LicenseSuspendedOrRevokedComment,
          Remarks: seafarer.Remarks
        }, { emitEvent: false });

        this.isLoading = false;
        console.log('Form patched successfully');
        console.log('Loaded seafarer stored for edit:', this.loadedSeafarer);
      },
      error: (error) => {
        console.error('Failed to load seafarer:', error);
        this.showToastMessage('Failed to load seafarer data: ' + error.message, 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Helper to format date for input field (yyyy-MM-dd)
   */
  private formatDateForInput(date?: Date | string | null): string {
    if (!date) return '';

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  }

  // ==================== FORM ARRAYS ====================

  get qualifications(): FormArray {
    return this.seafarerForm.get('Qualifications') as FormArray;
  }

  get certificates(): FormArray {
    return this.seafarerForm.get('Certificates') as FormArray;
  }

  get languages(): FormArray {
    return this.seafarerForm.get('Languages') as FormArray;
  }

  get references(): FormArray {
    return this.seafarerForm.get('References') as FormArray;
  }

  get workExperiences(): FormArray {
    return this.seafarerForm.get('WorkExperiences') as FormArray;
  }

  addQualification(): void {

    const group = this.fb.group({
      DegreeOrCourse: ['', Validators.required],
      CourseIssueDate: ['', Validators.required],
      ExpiryDate: [''],
      MajorOrSubject: [''],
      University: [''],
      Country: [''],
      Type: [1]
    });
    this.qualifications.push(group);
  }

  removeQualification(index: number): void {
    this.qualifications.removeAt(index);
  }

  // ==================== FORM SUBMISSION ====================


  /**
   * Submit form
   */
  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form valid?', this.seafarerForm.valid);
    console.log('Form value:', this.seafarerForm.getRawValue());

    if (this.seafarerForm.invalid) {
      console.error('Form is invalid!');

      // Log which fields are invalid
      Object.keys(this.seafarerForm.controls).forEach(key => {
        const control = this.seafarerForm.get(key);
        if (control && control.invalid) {
          console.error(`Invalid field: ${key}`, control.errors);
        }
      });

      this.markFormGroupTouched(this.seafarerForm);
      this.showToastMessage('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'error');
      return;
    }

    console.log('Form is valid, proceeding with submission...');

    // Get raw value to include disabled controls
    const formValue = this.seafarerForm.getRawValue();

    console.log('Raw form value:', formValue);

    // Check if employee and sponsor are selected
    const empId = parseInt(formValue.empId) || 0;
    const visaSponsorId = parseInt(formValue.visaSponsorId) || 0;

    if (empId === 0) {
      this.showToastMessage('Must select an employee!', 'error');
      console.error('empId is 0 - no employee selected!');
      return;
    }

    if (visaSponsorId === 0) {
      this.showToastMessage('Must select a sponsor!', 'error');
      console.error('visaSponsorId is 0 - no sponsor selected!');
      return;
    }

    // Build entity object
    const entityData: any = {
      // Core required fields
      EmpId: empId,
      VisaSponsorId: visaSponsorId,

      // Passport information
      PassportNumber: formValue.passportNumber || null,
      PassPortIssueDate: formValue.passportIssueDate || null,
      IDExPiryDate: formValue.passportExpiryDate || null,
      // Visa dates WITH time
      VisaIssueDate: formValue.visaIssueDate ? `${formValue.visaIssueDate}T00:00:00` : null,
      VisaExpiryDate: formValue.visaExpiryDate ? `${formValue.visaExpiryDate}T00:00:00` : null,
      VisaUAEIdNO: formValue.visaNumber || null,
      ResidenceNumber: formValue.ResidenceNumber || null,
      // SeamanBookNO needs a default value if empty
      SeamanBookNO: formValue.SeamanBookNO || `SB-${Date.now()}`,
      SeamanIssueDate: formValue.SeamanIssueDate || null,
      SeamanExpiryDate: formValue.SeamanExpiryDate || null,
      CicpaNO: formValue.CicpaNO || null,
      CicpaIssueDate: formValue.CicpaIssueDate || null,
      CicpaExpiryDate: formValue.CicpaExpiryDate || null,
      NameOfSpouse: formValue.NameOfSpouse || null,
      NoOfChildren: formValue.NoOfChildren || 0,
      BodyWeight: formValue.BodyWeight || 0,
      Height: formValue.Height || 0,
      NearestAirport: formValue.NearestAirport || null,
      SkypeID: formValue.SkypeID || null,
      PermanentAddressHomeCountry: formValue.PermanentAddressHomeCountry || null,
      ContactNumberHomeCountry: formValue.ContactNumberHomeCountry || null,
      ContactNameAndNumberDuringEmergenciesUAE: formValue.ContactNameAndNumberDuringEmergenciesUAE || null,
      ContactNameAndNumberDuringEmergenciesHome: formValue.ContactNameAndNumberDuringEmergenciesHome || null,
      // Task Requirements - Personal & Employment Info
      BirthDate: formValue.BirthDate || null,
      Phone: formValue.Phone || null,
      NationalId: formValue.NationalId || null,
      EmploymentDate: formValue.EmploymentDate || null,
      InsuranceDate: formValue.InsuranceDate || null,
      Declaration: formValue.Declaration || null,
      SignedOffFromAShipDueToMedicalReason: formValue.SignedOffFromAShipDueToMedicalReason || false,
      SignedOffFromAShipDueToMedicalReasonComment: formValue.SignedOffFromAShipDueToMedicalReasonComment || null,
      UndergoneAnyMdicalOperation: formValue.UndergoneAnyMdicalOperation || null,
      UndergoneAnyMdicalOperationComment: formValue.UndergoneAnyMdicalOperationComment || null,
      DoctorConsultation: formValue.DoctorConsultation || null,
      DoctorConsultationComment: formValue.DoctorConsultationComment || null,
      HealthOrDisabilityProblem: formValue.HealthOrDisabilityProblem || null,
      HealthOrDisabilityProblemComment: formValue.HealthOrDisabilityProblemComment || null,
      InquiryOrInvolvedMaritimeAccident: formValue.InquiryOrInvolvedMaritimeAccident || null,
      InquiryOrInvolvedMaritimeAccidentComment: formValue.InquiryOrInvolvedMaritimeAccidentComment || null,
      LicenseSuspendedOrRevoked: formValue.LicenseSuspendedOrRevoked || null,
      LicenseSuspendedOrRevokedComment: formValue.LicenseSuspendedOrRevokedComment || null,
      Remarks: formValue.Remarks || null
    };

    // If editing, merge with loaded seafarer data to preserve all fields
    if (this.isEditMode && this.loadedSeafarer) {
      console.log('Edit mode: merging with loaded seafarer data');
      // Preserve any fields that might exist in the loaded data but not in the form
      Object.assign(entityData, this.loadedSeafarer, entityData);
    }

    // Ensure arrays have at least dummy data if empty
    const qualifications = formValue.Qualifications && formValue.Qualifications.length > 0
      ? formValue.Qualifications
      : [{
        DegreeOrCourse: "N/A",
        CourseIssueDate: "2020-01-01",
        ExpiryDate: "2030-01-01",
        MajorOrSubject: "N/A",
        University: "N/A",
        Country: "N/A",
        Type: 1
      }];

    const certificates = formValue.Certificates && formValue.Certificates.length > 0
      ? formValue.Certificates
      : [{
        Capacity: "N/A",
        Regulation: "N/A",
        IssueDate: "2020-01-01",
        ExpiryDate: "2030-01-01",
        IssuingAuthority: "N/A",
        Limitations: "N/A",
        Country: "N/A",
        Type: 1
      }];

    const languages = formValue.Languages && formValue.Languages.length > 0
      ? formValue.Languages
      : [{
        Capacity: "English",
        Regulation: "Basic",
        IssueDate: "2020-01-01",
        ExpiryDate: "2030-01-01",
        IssuingAuthority: "N/A",
        Limitations: "N/A",
        Country: "N/A"
      }];

    const references = formValue.References && formValue.References.length > 0
      ? formValue.References
      : [{
        PersonName: "N/A",
        CompanyName: "N/A",
        Country: "N/A",
        Fax: "N/A",
        EmailId: "N/A"
      }];

    const workExperiences = formValue.WorkExperiences && formValue.WorkExperiences.length > 0
      ? formValue.WorkExperiences
      : [{
        VesselName: "N/A",
        VesselType: "N/A",
        Rank: "N/A",
        From: "2020-01-01",
        To: "2021-01-01",
        GRT: "N/A",
        BHP: "N/A",
        CompanyName: "N/A"
      }];

    const request: SaveSeafarerRequest = {
      entity: entityData,
      Qualifications: qualifications,
      Certificates: certificates,
      Languages: languages,
      References: references,
      WorkExperiences: workExperiences
    };

    console.log('Arrays status:', {
      qualificationsCount: qualifications.length,
      certificatesCount: certificates.length,
      languagesCount: languages.length,
      referencesCount: references.length,
      workExperiencesCount: workExperiences.length
    });

    console.log('Sending request:', request);
    console.log('Entity object:', JSON.stringify(request.entity, null, 2));

    this.isSaving = true;

    const saveOperation = this.isEditMode
      ? this.seafarerService.updateSeafarer(this.seafarerId!, request)
      : this.seafarerService.createSeafarer(request);

    saveOperation.subscribe({
      next: (response) => {
        console.log('Save successful:', response);
        this.showToastMessage(
          `Seafarer ${this.isEditMode ? 'updated' : 'created'} successfully!`,
          'success'
        );
        this.isSaving = false;

        // Navigate with state to force reload
        setTimeout(() => {
          this.router.navigate(['/seafarers'], {
            queryParams: { refresh: new Date().getTime() }
          });
        }, 1000);
      },
      error: (error) => {
        console.error('Save failed:', error);
        this.showToastMessage(
          `Failed to ${this.isEditMode ? 'update' : 'create'} seafarer: ` + error.message,
          'error'
        );
        this.isSaving = false;
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/seafarers']);
  }


  // ==================== VALIDATION ====================

  hasError(fieldName: string): boolean {
    const field = this.seafarerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.seafarerForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'This field is required';
    }

    if (field?.hasError('pattern')) {
      return 'Invalid format';
    }

    if (field?.hasError('min')) {
      return 'Value must be positive';
    }

    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

  // ==================== HELPERS ====================

  showToastMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  closeToast(): void {
    this.showToast = false;
  }
}