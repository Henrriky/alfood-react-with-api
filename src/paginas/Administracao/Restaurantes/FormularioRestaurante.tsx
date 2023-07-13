import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";

export default function FormularioRestaurante() {

    const parametros = useParams();

    useEffect(() => {
        if (parametros.id) {
            http.get<IRestaurante>(`restaurantes/${parametros.id}/`)
                .then(resposta => setNomeRestaurante(resposta.data.nome))
        }
    }, [parametros])

    const [nomeRestaurante, setNomeRestaurante] = useState('');

    const aoSubmeterFormulario = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        if (parametros.id) {

            http.put(`restaurantes/${parametros.id}/`, {
                nome: nomeRestaurante,
            }).then(() => {
                alert("Restaurante atualizado com sucesso!")
            })

        } else {
            http.post('restaurantes/', {
                nome: nomeRestaurante
            })
                .then(() => {
                    alert("Restaurante cadastrado com sucesso!")
                })
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
            <Typography component="h1" variant="h6">
                {
                    parametros.id === undefined ?
                        'Formulário para criar restaurante' :
                        'Formulário para editar restaurante'
                }
            </Typography>
            <Box onSubmit={aoSubmeterFormulario} component="form" >
                <TextField
                    label="Nome do restaurante"
                    variant="standard"
                    onChange={evento => setNomeRestaurante(evento.target.value)}
                    value={nomeRestaurante}
                    fullWidth
                    required
                />
                <Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>Salvar</Button>
            </Box>
        </Box>
    )
}