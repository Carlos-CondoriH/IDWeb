const cursos = require("../data/cursos");
exports.obtenerCursos = (req, res) => {
    const { creditos } = req.query;
    if (creditos) {
        const filtrados = cursos.filter(c => c.credito === parseInt(creditos));
        return res.status(200).json({ status: "success", data: filtrados });
    }
    res.status(200).json({ status: "success", data: cursos });
};
exports.obtenerCursoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const curso = cursos.find(c => c.id === id);
    if (!curso) {
        return res.status(404).json({status: "fail", message: "curso no encontrado"});
    }
    res.status(200).json({ status: "success", data: curso });
};
exports.crearCurso = (req, res) => {
    const { nombre, codigo, creditos } = req.body;
    if (!nombre || !codigo || !creditos) {
        return res.status(400).json({
            status: "fail",
            message: "faltan campos obligatorios (nombre, codigo, creditos)"
        });
    }
    const nuevoId = cursos.length > 0 ? cursos[cursos.length - 1].id + 1 : 1;
    const nuevoCurso = { id: nuevoId, nombre, codigo, credito: parseInt(creditos)};
    cursos.push(nuevoCurso);
    res.status(201).json({ status: "success", data: nuevoCurso });
};
exports.actualizarCurso = (req, res) => {
    const id = parseInt(req.params.id);
    const curso = cursos.find(c => c.id === id);
    if (!curso) {
        return res.status(404).json({status: "fail", message: "curso no encontrado"});
    }
    const { nombre, codigo, creditos } = req.body;
    if (nombre) curso.nombre = nombre;
    if (codigo) curso.codigo = codigo;
    if (creditos) curso.credito = parseInt(creditos);
    res.status(200).json({status: "success", data: curso });
};
exports.eliminarCurso = (req, res) => {
    const id = parseInt(req.params.id);
    const indice = cursos.findIndex(c => c.id === id);
    if (indice === -1) {
        return res.status(404).json({status: "fail", message: "curso no encontrado"});
    }
    cursos.splice(indice, 1);
    res.status(200).json({status: "success", message: "curso eliminado correctamente"});
};