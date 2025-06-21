import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12 grid justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Copo Cheio App</h2>
          <p className="text-gray-400 text-sm">
            Seu bar na palma da mão. Peça suas bebidas favoritas com praticidade e rapidez.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Navegação</h3>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Início</a></li>
            <li><a href="#" className="hover:text-white">Cardápio</a></li>
            <li><a href="#" className="hover:text-white">Pedidos</a></li>
            <li><a href="#" className="hover:text-white">Promoções</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Contato</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>Email: contato@copo cheio.com</li>
            <li>WhatsApp: (11) 91234-5678</li>
            <li>Instagram: @copo_cheio</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © 2025 Copo Cheio App. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;