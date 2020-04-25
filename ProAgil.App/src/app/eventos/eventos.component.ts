import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ptBrLocale, BsLocaleService, defineLocale } from 'ngx-bootstrap';
import { templateJitUrl } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  dataEvento: '';
  modoSalvar = 'post';
  imagemLargura: number = 50;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  _filtroLista: string = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(value) : this.eventos;
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  alterarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos() {
    this.dataAtual = new Date().getMilliseconds().toString();

    this.eventoService.getAllEvento()
      .subscribe((_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      }, error => {
        this.toastr.error(`Erro ao carregar eventos: ${error}`);
        console.log(error);
      });
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
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

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso!');
          }, error => {
            this.toastr.error(`Erro ao inserir: ${error}`);
            console.error(error);
          }
        );
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com sucesso!');
          }, error => {
            this.toastr.error(`Erro ao editar: ${error}`);
            console.error(error);
          }
        );
      }
    }
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  editarEvento(template: any, evento: Evento) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({id: this.evento.id}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(evento);
  }

  excluirEvento(template: any, evento: Evento) {
    template.show();
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, ID: ${evento.id}`;
  }

  confirmarExcluir(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com sucesso!');
      }, error => {
        this.toastr.error('Erro ao tentar deletar!');
        console.error(error);
      }
    );
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

  uploadImagem() {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];
      this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        });
    } else {
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        });
    }
  }
}
