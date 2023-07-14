import { useEffect, useState } from "react";
import IPrato from "../../../interfaces/IPrato"
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import http from "../../../http";

export default function AdministracaoPratos() {

  const [pratos, setPratos] = useState<IPrato[]>([]);

  useEffect(() => {
    http.get<IPrato[]>('pratos/')
      .then(resposta => setPratos(resposta.data))
      .catch(error => console.log(error))
  }, [])

  const excluirPrato = (pratoAhSerExcluido: IPrato) => {

    const { id } = pratoAhSerExcluido;

    http.delete(`pratos/${id}/`)
      .then(() => { alert("Prato deletado com sucesso!")})
      .catch(error => console.log(error))
    
    const listaPratos = pratos.filter(prato => prato.id !== id);
    setPratos([...listaPratos]);
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
              Tag
            </TableCell>
            <TableCell>
              Imagem
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
          {pratos.map(prato => (
            <TableRow key={prato.id}>
              <TableCell>
                {prato.nome}
              </TableCell>
              <TableCell>
                {prato.tag}
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="warning">
                  <a href={prato.imagem} target="_blank" rel="noopener noreferrer" style={{color: "rgba(237, 108, 2, 0.5)"}}>Abrir imagem</a>
                </Button>
              </TableCell>
              <TableCell>
                <Link to={`/admin/pratos/${prato.id}`}>
                  <Button variant="outlined">
                    Editar
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                  <Button variant="outlined" color="error" onClick={() => excluirPrato(prato)}>
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