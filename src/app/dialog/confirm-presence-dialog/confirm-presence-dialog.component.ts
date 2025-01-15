import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.prd';

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
      whatsapp: ['', Validators.required],
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
    const ultimoAgregado = this.agregados.controls[this.agregados.length - 1];
    const nomeAgregado = ultimoAgregado.get('nome')?.value;
  
    if (nomeAgregado && nomeAgregado.trim() !== '') {
      this.agregados.push(this.createAgregado());
    }
  }

  isLastAgregadoValid(): boolean {
    const ultimoAgregado = this.agregados.controls[this.agregados.length - 1];
    const nomeAgregado = ultimoAgregado.get('nome')?.value;
    return nomeAgregado && nomeAgregado.trim() !== '';
  }

  onSubmit(): void {
    if (this.form.valid) {
  
      const agregadosValidos = this.agregados.value.filter((agregado: { nome: string }) => agregado.nome.trim() !== '');
  
      const formData = {
        ...this.form.value,
        agregados: agregadosValidos
      };
  
      const whatsapp = this.form.value.whatsapp;
      const message = `Ooii, sou o(a) ${this.form.value.nome.split(" ")[0]}, e o Zyan com certeza pode contar com a nossa presença! ❤️❤️❤️`;
  
      this.http.post(`${environment.apiUrl}/confirm`, formData).subscribe(
        response => {
          console.log('Presença confirmada:', response);
          this.successMessage = 'Presença confirmada com sucesso!';
          this.showSuccess = true;
          this.form.reset();
  
          this.sendMessage(whatsapp, message);
        },
        error => {
          console.error('Erro ao confirmar presença:', error);
        }
      );
    }
  }

  sendMessage(whatsapp: string, message: string): void {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}