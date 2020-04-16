import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ptBrLocale, BsLocaleService, defineLocale } from 'ngx-bootstrap';
import { dependenciesFromGlobalMetadata } from '@angular/compiler/src/render3/r3_factory';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm : FormGroup;
  user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.validation();
  }

  validation() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required]
      }, {
        validatior: this.compararSenhas
      })
    });
  }

  compararSenhas(formGroup: FormGroup) {
    const confirmPasswordCtrl = formGroup.get('confirmPassword');

    if (confirmPasswordCtrl.errors == null || 'mismatch' in confirmPasswordCtrl.errors) {
      if (formGroup.get('password').value !== confirmPasswordCtrl.value) {
        confirmPasswordCtrl.setErrors({ mismatch: true});
      } else {
        confirmPasswordCtrl.setErrors(null);
      }
    }
  }

  cadastrarUsuario() {
    if (this.registerForm.valid) {
      this.user = Object.assign({
        password: this.registerForm.get('passwords.password').value
      }, this.registerForm.value);

      console.info('user: ', this.user);

      this.authService.register(this.user).subscribe(() => {
        this.router.navigate(['/user/login']);
        this.toastr.success('Cadastro realizado');
      }, error => {
        const erro = error.erro;
        console.info('error: ', error);

        if (typeof error === 'string') {
          this.toastr.error('Erro');
        } else {
          erro.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro duplicado!');
                break;

              default:
                this.toastr.error('Ocorreu um erro!');
                break;
            }
          });
        }

      });
    }
  }

}
