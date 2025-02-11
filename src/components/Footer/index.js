// components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#16A34A] via-[#128a2e] to-[#1e3a3a] text-white py-8 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-lg font-medium">© 2025 PhantomMart. Todos os direitos reservados.</p>
        <div className="mt-4">
          <a href="#" className="text-lg mx-4 hover:text-gray-300">Política de Privacidade</a>
          <a href="#" className="text-lg mx-4 hover:text-gray-300">Termos de Serviço</a>
          <a href="#" className="text-lg mx-4 hover:text-gray-300">Contato</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
