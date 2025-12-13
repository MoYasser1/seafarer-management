// src/app/seafarers/seafarer-list/seafarer-list.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Seafarer } from '../models/seafarer.model';
import { SeafarerService } from '../services/seafarer';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-seafarer-list',
  templateUrl: './seafarer-list.html',
  styleUrls: ['./seafarer-list.css']
})
export class SeafarerListComponent implements OnInit {
  seafarers: Seafarer[] = [];
  filteredSeafarers: Seafarer[] = [];
  searchText = '';

  isLoading = false;
  errorMessage = '';

  constructor(
    private seafarerService: SeafarerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadSeafarers();

    // ✅ Listen for query param changes (triggered after create/update)
    this.route.queryParams.subscribe(params => {
      if (params['refresh']) {
        console.log('🔄 Refresh triggered, reloading seafarers...');
        this.loadSeafarers();
      }
    });
  }


  /**
   * ✅ Load all seafarers from API
   */
  async loadSeafarers(): Promise<void> {
    console.log('🔄 Starting to load seafarers...');
    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('📞 Calling seafarerService.getAllSeafarers()...');
      this.seafarers = await this.seafarerService.getAllSeafarers();
      console.log('📊 Received seafarers data:', this.seafarers);
      if (this.seafarers && this.seafarers.length > 0) {
        console.log('📋 First seafarer raw object (Golden Sample):', JSON.stringify(this.seafarers[0], null, 2));
      }

      this.filteredSeafarers = [...this.seafarers];
      console.log('✅ Loaded seafarers successfully:', this.seafarers.length);
    } catch (error: any) {
      console.error('❌ Error loading seafarers:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        error: error
      });

      this.errorMessage = error.message || 'فشل تحميل البحارة';
      this.seafarers = [];
      this.filteredSeafarers = [];
    } finally {
      console.log('🏁 Setting isLoading to false');
      this.isLoading = false;
      this.cdr.detectChanges(); // ✅ Force UI update
      console.log('🎨 Change detection triggered');
    }

    console.log('🏁 loadSeafarers completed. isLoading:', this.isLoading);
  }

  /**
   * ✅ Search/filter seafarers
   */
  onSearch(): void {
    if (!this.searchText.trim()) {
      this.filteredSeafarers = [...this.seafarers];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.filteredSeafarers = this.seafarers.filter(s =>
      (s.EmployeeName?.toLowerCase().includes(search)) ||
      (s.EmployeeCode?.toLowerCase().includes(search)) ||
      (s.SeamanBookNO?.toLowerCase().includes(search)) ||
      (s.PassportNumber?.toLowerCase().includes(search)) ||
      (s.Email?.toLowerCase().includes(search)) ||
      (s.Mobile?.toLowerCase().includes(search)) ||
      (s.Phone?.toLowerCase().includes(search)) ||
      (s.NationalId?.toLowerCase().includes(search))
    );
  }

  /**
   * ✅ Navigate to add seafarer form
   */
  addSeafarer(): void {
    this.router.navigate(['/seafarers/add']);
  }

  /**
   * ✅ Navigate to edit seafarer form
   */
  editSeafarer(id: number): void {
    this.router.navigate(['/seafarers/edit', id]);
  }

  /**
   * ✅ Toggle active/inactive status
   */
  async toggleStatus(seafarer: Seafarer): Promise<void> {
    if (!seafarer.Id) return;

    const newStatus = !seafarer.IsActive;
    const action = newStatus ? 'activate' : 'inactivate';

    try {
      await this.seafarerService.toggleActiveStatus(seafarer.Id, newStatus);
      seafarer.IsActive = newStatus;
      console.log(`✅ Seafarer ${action}d successfully`);
      this.cdr.detectChanges(); // ✅ Force UI update
    } catch (error: any) {
      console.error(`❌ Failed to ${action} seafarer:`, error);
      this.errorMessage = `Failed to ${action} seafarer: ${error.message}`;
    }
  }

  /**
   * ✅ Format date for display
   */
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  }

  /**
   * ✅ Calculate age from birth date
   */
  calculateAge(birthDate: Date | string | undefined): number | string {
    if (!birthDate) return '-';

    try {
      const birth = new Date(birthDate);
      if (isNaN(birth.getTime())) return '-';

      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      return age;
    } catch {
      return '-';
    }
  }

  /**
   * ✅ Logout
   */
  logout(): void {
    this.authService.logout();
  }
}
