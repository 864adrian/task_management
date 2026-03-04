

import express from "express";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())


const lista = [
    {
        id: 1,
        nombre: 'hacer API rest',
        descripcion: 'hacer la api rest que nos ha pedido jere',
        categoria: 'backend',
        prioridad: 3,
        estado: 'in progress',
        responsable: 'jere',
        deadline: Date.parse('2026-02-26')
    }
]

app.get("/api/tareas", (req, res) => {
   res.json(lista.map(t => {
        return {id: t.id, 
            nombre: t.nombre, 
            estado: t.estado,
            prioridad: t.prioridad, 
            categoria: t.categoria,
            responsable: t.responsable}
    }))
})

app.get("/api/tareas/:id", (req, res) => {
    const id = Number(req.params.id)
    const tarea = lista.find((t) => t.id === id)
    if (tarea == null)
        res.status(404).json({error: 'No se ha encontrado la tarea'})

    /*const n = {...t}
    n.deadline = n.deadline == null ? null : new Date(n.deadline)*/

    res.json(tarea)
})

app.post('/api/tareas', (req, res) => {
    const t = req.body
    if (t?.nombre == null)
        return res.status(400).json({error: 'El nombre es obligatorio'})

    const idNuevo = lista.reduce((m, t) => t.id > m ? t.id : m, 1) + 1
    const nueva = {
        id: idNuevo,
        nombre: t.nombre,
        estado: t.estado || 'to do',
        prioridad: t.prioridad || 1,
        responsable: t.responsable,
        deadline: t.deadline,
        descripcion: t.descripcion,
        categoria: t.categoria
    }
    lista.push(nueva)
    res.status(201).json(nueva)
})

app.delete('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id)
    const pos = lista.findIndex(t => t.id === id)
    if (pos == -1) 
        return res.status(404).json({error: 'La tarea no se ha encontrado'})

    lista.splice(pos,1)
    res.status(200).send()
})

app.patch('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id)
    const t = lista.find(t => t.id === id)
    if (t == null)
        return res.status(404).json({error: 'No se ha encontrado'})

    const n = req.body
    if (n.nombre != null) t.nombre = n.nombre
    if (n.descripcion != null) t.descripcion = n.descripcion
    if (n.deadline != null) t.deadline = n.deadline
    if (n.responsable != null) t.responsable = n.responsable
    if (n.categoria != null) t.categoria = n.categoria
    if (n.estado != null) t.estado = n.estado
    if (n.prioridad != null) t.prioridad = n.prioridad

    res.status(200).json(t)
})


app.listen(3000);
