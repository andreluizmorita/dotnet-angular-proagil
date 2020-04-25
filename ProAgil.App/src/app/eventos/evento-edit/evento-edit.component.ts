import { Component, OnInit } from '@angular/core';
import { EventoService } from '../../_services/evento.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ptBrLocale, BsLocaleService, defineLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar evento';
  registerForm: FormGroup;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.registerForm = this.formBuilder.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ]
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: [
        '',
        [
          Validators.required,
          Validators.maxLength(12000)
        ]
      ],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
    });
  }
}
