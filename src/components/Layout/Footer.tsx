import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img 
              src="/logo.png" 
              alt="Ocean Breeze" 
              className="h-10 w-auto"
            ></img>
              </div>
              <span className="text-xl font-bold">Ocean Breeze</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Desfrute de uma experiência única em nosso hotel à beira-mar. 
              Conforto, elegância e hospitalidade em cada detalhe.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Quartos
                </a>
              </li>
              <li>
                <a href="https://github.com/pedronicolasg/OceanBreeze" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Aracati, CE</li>
              <li>CEP: 62800-390</li>
              <li>
                <a href="tel:+5548999999999" className="hover:text-white transition-colors">
                  (88) 99932-1707
                </a>
              </li>
              <li>
                <a href="mailto:contato@oceanbreeze.com.br" className="hover:text-white transition-colors">
                  contato@oceanbreeze.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Ocean Breeze.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Desenvolvido com <Heart className="w-4 h-4 mx-1 text-blue-500" /> para fins educacionais
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;