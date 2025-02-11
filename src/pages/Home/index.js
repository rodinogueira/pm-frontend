import React, { useRef } from 'react';
import ProductList from '../../components/ProductList';
import Footer from '../../components/Footer';

export default function Home() {
  const productListRef = useRef(null);

  const handleScrollToProducts = () => {
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      productListRef.current.classList.add('highlight'); // Adiciona classe para efeito de destaque

      setTimeout(() => {
        productListRef.current.classList.remove('highlight'); // Remove após 2 segundos
      }, 2000);
    }
  };

  return (
    <>
      <section className="home-banner w-full h-[500px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] via-[#128a2e] to-[#1e3a3a] opacity-70"></div>
        <div className="flex flex-col items-center justify-center h-full relative z-10 px-6 md:px-12">
          <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            Descubra os Melhores Produtos para Você
          </h1>
          <p className="text-center text-lg md:text-xl text-white mb-6 max-w-2xl">
            Encontre produtos de qualidade com preços incríveis. Navegue em nossa seleção e aproveite!
          </p>
          <button
            onClick={handleScrollToProducts}
            className="px-6 py-3 bg-primary text-white text-lg rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Ver Produtos
          </button>
        </div>
      </section>

      <div ref={productListRef} className="transition duration-500">
        <ProductList />
      </div>

      <Footer />

      <style jsx>{`
        .highlight {
          animation: highlightEffect 1s ease-in-out 2;
        }

        @keyframes highlightEffect {
          0% { background-color: rgba(255, 255, 0, 0.3); }
          100% { background-color: transparent; }
        }
      `}</style>
    </>
  );
}
