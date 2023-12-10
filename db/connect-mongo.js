const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        const url = 'mongodb+srv://juanmedina:juanmedina@cluster0.azb9zom.mongodb.net/inventario?retryWrites=true&w=majority';

        await mongoose.connect(url);
        console.log('Conexión exitosa');
    } catch (error) {
        console.log(error);
    }
};

module.exports = getConnection; // Exporta la función para ser utilizada en otros archivos

