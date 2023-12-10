const {Router} = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const {check, validationResult} = require('express-validator');
const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin')

const router = Router();

router.post('/',[validarJWT,validarRolAdmin], [
    check('nombre','invalid.nombre').not().isEmpty(),
    check('estado','invalid.estado').isIn(['Activo', 'Inactivo']),
    
], async function(req, res){

    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({mensaje: error.array()});
        }

        let estadoEquipo = new EstadoEquipo();
            estadoEquipo.nombre = req.body.nombre;
            estadoEquipo.estado = req.body.estado;
            estadoEquipo.fechaCreacion = new Date();
            estadoEquipo.fechaActualizacion = new Date();

            estadoEquipo = await estadoEquipo.save();

            res.send(estadoEquipo);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});

router.get('/',[validarJWT, validarRolAdmin], async function(req, res){
    try{
        const estadoEquipos = await EstadoEquipo.find();
        res.send(estadoEquipos);
    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});

module.exports = router;