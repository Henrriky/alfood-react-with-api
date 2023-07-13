import { useEffect, useState } from 'react';

import IPaginacao from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';

import style from './ListaRestaurantes.module.scss';

import Restaurante from './Restaurante';

import axios, { AxiosRequestConfig } from 'axios';

import { Button, TextField } from '@mui/material';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<Array<IRestaurante>>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {

    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro)
      })
  }

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }


  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      <form onSubmit={buscar}>
            <TextField 
                label="Nome do restaurante" 
                variant="standard" 
                placeholder='Pesquisar restaurante'
                value={busca}
                onChange={evento => setBusca(evento.target.value)} 
            />
            <Button type="submit" variant="outlined">Buscar</Button>
        </form>
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