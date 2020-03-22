import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})
export class EventosComponent implements OnInit {

  _filtroLista: string = '';

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(value) : this.eventos;
  }

  eventosFiltrados: any = [];
  eventos: any = [];
  imagemLargura: number = 50;
  imagemMargem: number = 2;
  mostrarImagem: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  alterarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.eventos = response;
    }, error => {
      console.log(error);
    });
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
}
