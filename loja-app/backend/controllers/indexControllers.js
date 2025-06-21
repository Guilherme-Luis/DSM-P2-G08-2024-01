module.exports = {
    index,
    login,  
}

function index(req, res) {
    console.log('Rota Raiz Encontrada!!!')
    res.send('<h3>Rota Raiz Encontrada!! <br> Olá Mundo! </h3>')
}

function login(req, res) {
    console.log('Rota login Encontrada!!!')
    res.send('<h3>Rota Raiz Encontrada!! <br> Olá Mundo! </h3>')
}