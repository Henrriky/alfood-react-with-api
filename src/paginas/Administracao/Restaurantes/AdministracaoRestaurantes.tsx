import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante"
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import http from "../../../http";

export default function AdministracaoRestaurantes() {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    http.get<IRestaurante[]>('restaurantes/')
      .then(resposta => setRestaurantes(resposta.data))
      .catch(error => console.log(error))
  }, [])

  const excluirRestaurante = (restauranteAhSerExcluido: IRestaurante) => {

    const { id } = restauranteAhSerExcluido;

    http.delete(`restaurantes/${id}/`)
      .then(() => { alert("Restaurante deletado com sucesso!")})
      .catch(error => console.log(error))
    
    const listaRestaurante = restaurantes.filter(restaurante => restaurante.id !== id);
    setRestaurantes([...listaRestaurante]);
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Nome
            </TableCell>
            <TableCell>
              Editar
            </TableCell>
            <TableCell>
              Excluir
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes.map(restaurante => (
            <TableRow key={restaurante.id}>
              <TableCell>
                {restaurante.nome}
              </TableCell>
              <TableCell>
                <Link to={`/admin/restaurantes/${restaurante.id}`}>
                  <Button variant="outlined">
                    Editar
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                  <Button variant="outlined" color="error" onClick={() => excluirRestaurante(restaurante)}>
                    Deletar
                  </Button>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  )
}