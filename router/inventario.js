const {Router} = require('express');
const Inventario = require('../models/Inventario');
const {check, validationResult} = require('express-validator');
const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin')

const router = Router();

router.post('/',[validarJWT, validarRolAdmin], [
    check('serial','invalid.serial').not().isEmpty(),
    check('modelo','invalid.modelo').not().isEmpty(),
    check('descripcion','invalid.descripcion').not().isEmpty(),
    check('color','invalid.color').not().isEmpty(),
    check('foto','invalid.nombre').not().isEmpty(),
    check('fechaCompra','invalid.fechaCompra').not().isEmpty(),
    check('precio','invalid.precio').not().not().isEmpty().isFloat({min:0}),
    check('usuario','invalid.usuario').not().isEmpty(),
    check('marca','invalid.marca').not().isEmpty(),
    check('estadoEquipo','invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo','invalid.tipoEquipo').not().isEmpty(),
    
], async function(req, res){

    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({mensaje: error.array()});
        }

        const existeInventarioPorSerial = await Inventario.findOne({serial: req.body.serial});
        if (existeInventarioPorSerial){
            return res.status(400).send('Serial ya existe')
        }

        let inventario = new Inventario();
            inventario.serial = req.body.serial;
            inventario.modelo = req.body.modelo;
            inventario.descripcion = req.body.descripcion;
            inventario.color = req.body.color;
            inventario.foto = req.body.foto;
            inventario.fechaCompra = req.body.fechaCompra;
            inventario.precio = req.body.precio;
            inventario.usuario = req.body.usuario._id;
            inventario.marca = req.body.marca._id;
            inventario.estadoEquipo = req.body.estadoEquipo._id;
            inventario.tipoEquipo = req.body.tipoEquipo._id;
            inventario.fechaCreacion = new Date();
            inventario.fechaActualizacion = new Date();
          
            inventario = await inventario.save();

            res.send(inventario);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});

router.get('/',[validarJWT, validarRolAdmin], async function(req, res){
    try{
        const inventarios = await Inventario.find().populate([
        {
            path: 'usuario', select: 'nombre email estado'
        },
        {
            path: 'marca', select:'nombre estado'
        },
        {
            path: 'estadoEquipo', select: 'nombre estado'
        },
        {
            path: 'tipoEquipo', select: 'nombre estado'
        }
    ]);
        res.send(inventarios);
    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});

module.exports = router;