import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm-presence-dialog',
  templateUrl: './confirm-presence-dialog.component.html',
  styleUrls: ['./confirm-presence-dialog.component.css']
})
export class ConfirmPresenceDialogComponent {

  form!: FormGroup;
  successMessage: string = '';
  showSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ConfirmPresenceDialogComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', Validators.required],
      agregados: this.fb.array([this.createAgregado()])
    });
  }

  get agregados(): FormArray {
    return this.form.get('agregados') as FormArray;
  }

  createAgregado(): FormGroup {
    return this.fb.group({
      nome: ['']
    });
  }

  addAgregado(): void {
    this.agregados.push(this.createAgregado());
  }

  onSubmit(): void {
    if (this.form.valid) {

      this.http.post(`${environment.apiUrl}/confirm`, this.form.value).subscribe(
        response => {
          console.log('Presença confirmada:', response);
          this.successMessage = 'Presença confirmada com sucesso!';
          this.showSuccess = true;
          this.form.reset();
        },
        error => {
          console.error('Erro ao confirmar presença:', error);
        }
      );
    }
  }
}