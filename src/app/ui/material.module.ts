import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatExpansionModule,
  MatSelectModule,
  MatTabsModule,
  MatDialogModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class MaterialModule {}