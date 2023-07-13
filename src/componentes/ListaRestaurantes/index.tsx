import { useEffect, useState } from 'react';

import IPaginacao from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';

import style from './ListaRestaurantes.module.scss';

import Restaurante from './Restaurante';

import axios from 'axios';

import { Button } from '@mui/material';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<Array<IRestaurante>>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  const carregarDados = (url: string) => {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      });
  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      {restaurantes?.map(restaurante => <Restaurante restaurante={restaurante} key={restaurante.id} />)}
      <div className={style.ListaRestaurantes__control}>
        <Button variant='outlined' onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
          Página anterior
        </Button>
        <Button variant='outlined' onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
          Próxima página
        </Button>
      </div>
    </section>
  )
}

export default ListaRestaurantes