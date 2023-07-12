import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<Array<IRestaurante>>([]);
  const [proximaPagina, setProximaPagina] = useState('');

  useEffect(() => {
    //obter restaurantes
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
      })
      .catch(erro => {
        console.log(erro);
      })
  }, []);

  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(resposta => {
        setRestaurantes([...restaurantes, ...resposta.data.results]);
        setProximaPagina(resposta.data.next);
      })
      .catch(erro => {
        console.log(erro);
      });
  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      {restaurantes?.map(restaurante => <Restaurante restaurante={restaurante} key={restaurante.id} />)}
      {proximaPagina
        &&
        <button onClick={() => verMais()}>
          Ver Mais
        </button>}
    </section>
  )
}

export default ListaRestaurantes