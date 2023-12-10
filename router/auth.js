const {Router} = require('express');
const Usuario = require('../models/Usuario');
const bycript = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const {generarJWT} = require('../helpers/jwt');

const router = Router();

router.post('/', [

    check('email','invalid.email').isEmail(),
    check('password','invalid.password').not().isEmpty(),

    
], async function(req, res){

    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()});
        }

        const usuario = await Usuario.findOne({email: req.body.email});
        if (!usuario) { 
            return res.status(400).send({mensaje: 'user not found'});
        }   

        const esIgual = bycript.compareSync(req.body.password, usuario.password);
        if(!esIgual){
            return res.status(400).json({mensaje: 'user not found'});
        }  

        const token = generarJWT(usuario);

        res.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email, access_token: token
        });

    }   catch(error){
            console.log(error);
            res.status(500).json({mensaje: 'internal server error'})
        }

    });

    module.exports = router;