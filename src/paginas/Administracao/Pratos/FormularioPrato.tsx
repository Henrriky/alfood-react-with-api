import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ITag from "../../../interfaces/ITag";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useNavigate, useParams } from "react-router-dom";
import IPrato from "../../../interfaces/IPrato";

export default function FormularioPrato() {

    const parametros = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (parametros.id && parametros.id != 'novo') {
            http.get<IPrato>(`/pratos/${parametros.id}/`)
                    .then(resposta => {

                        setNomePrato(resposta.data.nome)
                        setTag(resposta.data.tag)
                        setDescricao(resposta.data.descricao)
    
                        http.get<IRestaurante>(`restaurantes/${resposta.data.restaurante}/`)
                            .then(resposta => setRestaurante(resposta.data.id.toString()));

                        setPreviewImagem(resposta.data.imagem);
                    })
        } 
    }, [parametros])

    // const [prato, setPrato] = useState<IPrato | null>(null);

    const [nomePrato, setNomePrato] = useState('');
    const [descricao, setDescricao] = useState('');

    const [tag, setTag] = useState('');
    const [tags, setTags] = useState<ITag[]>([]);

    const [restaurante, setRestaurante] = useState('');
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    const [imagem, setImagem] = useState<File | null>(null);
    const [previewImagem, setPreviewImagem] = useState<string>('');

    useEffect(() => {
        http.get<{ tags: Array<ITag> }>('tags/')
            .then(resposta => setTags(resposta.data.tags))
        http.get<IRestaurante[]>('restaurantes/')
            .then(resposta => setRestaurantes(resposta.data))
    }, [])

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0]);
        } else {
            setImagem(null);
        }
    }
    const aoSubmeterFormulario = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        const formData = new FormData();
        formData.append('nome', nomePrato);
        formData.append('descricao', descricao);
        formData.append('tag', tag);
        formData.append('restaurante', restaurante);

        if (imagem) {
            formData.append('imagem', imagem);
        }

        if (parametros.id && parametros.id !== 'novo') {
            http.request({
                url: `pratos/${parametros.id}/`,
                method: 'PUT',
                headers: {
                    'Content-type': 'multipart/form-data'
                },
                data: formData
            }).then(() => {
                setNomePrato('')
                setTag('')
                setDescricao('')
                setRestaurante('')
                setImagem(null)
                alert('Prato editado com sucesso')
                navigate('/admin/pratos')
            }
            )
                .catch(error => console.log(error));

            return    
        }

        http.request({
            url: 'pratos/',
            method: 'POST',
            headers: {
                'Content-type': 'multipart/form-data'
            },
            data: formData
        }).then(() => {
            setNomePrato('')
            setTag('')
            setDescricao('')
            setRestaurante('')
            setImagem(null)
            alert('Prato cadastrado com sucesso')
            navigate('/admin/pratos')
        }
        )
            .catch(error => console.log(error));



    }



    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">
                {
                    parametros.id === 'novo' ?
                        'Formulário para criar prato' :
                        'Formulário para editar prato'
                }
            </Typography>
            <Box onSubmit={aoSubmeterFormulario} component="form" sx={{ width: '100%' }} >
                <TextField
                    label="Nome do prato"
                    variant="standard"
                    onChange={evento => setNomePrato(evento.target.value)}
                    value={nomePrato}
                    fullWidth
                    required
                    margin="dense"
                />
                <TextField
                    label="Descrição do prato"
                    variant="standard"
                    onChange={evento => setDescricao(evento.target.value)}
                    value={descricao}
                    fullWidth
                    required
                    margin="dense"
                />
                <FormControl margin="dense" fullWidth>
                    <InputLabel id="select-tag">Tag</InputLabel>
                    <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}>
                        {tags.map(tag => (
                            <MenuItem value={tag.value} key={tag.id}>{tag.value}</MenuItem>
                        )
                        )
                        }
                    </Select>
                </FormControl>
                <FormControl margin="dense" fullWidth>
                    <InputLabel id="select-tag">Restaurante</InputLabel>
                    <Select labelId="select-tag" value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
                        {restaurantes.map(restaurante => (
                            <MenuItem value={restaurante.id} key={restaurante.id}>{restaurante.nome}</MenuItem>
                        )
                        )
                        }
                    </Select>
                </FormControl>
                <input type="file" onChange={selecionarArquivo} />
                { previewImagem && <img src={previewImagem} alt={descricao} style={{ width: 200, borderRadius: 10}}/> }
                <Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>Salvar</Button>
            </Box>
        </Box>
    )
}