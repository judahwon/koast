import React, { useState } from 'react';

// --- Data for the image accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Voice Assistant',
    imageUrl: 'https://cdn.21st.dev/assets/mirror/3c/3cfc0a70ff28f4d893b3957d57bac30d779a82955950e5ab7eae18f52ff5c666.jpg',
  },
  {
    id: 2,
    title: 'AI Image Generation',
    imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'AI Chatbot + Local RAG',
    imageUrl: 'https://cdn.21st.dev/assets/mirror/f8/f87ce80f6faafd8036aa8fded655eeabd3501923348041cf8fb545c4426419c6.jpg',
  },
  {
    id: 4,
    title: 'AI Agent',
    imageUrl: 'https://cdn.21st.dev/assets/mirror/f3/f390340fbe98b54bf6d65a34e20c4e0a79d328c3036f689a877dd3f0f0e954cd.jpg',
  },
  {
    id: 5,
    title: 'Visual Understanding',
    imageUrl: 'https://cdn.21st.dev/assets/mirror/06/06da3bf2e3245bba260845e8cdc47ded12eeb02270631e1958ecc0827ce5e3f7.jpg',
  },
];

interface AccordionItemData {
  id: number;
  title: string;
  imageUrl: string;
}

interface AccordionItemProps {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick?: () => void;
}

// --- Accordion Item Component ---
const AccordionItem: React.FC<AccordionItemProps> = ({ item, isActive, onMouseEnter, onClick }) => {
  return (
    <div
      role={'button'}
      tabIndex={0}
      className={`relative h-[450px] cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-in-out ${
        isActive ? 'w-100' : 'w-15'
      }`}
      onMouseEnter={onMouseEnter}
      onClick={onClick ?? onMouseEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (onClick ?? onMouseEnter)();
        }
      }}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className={'absolute inset-0 size-full object-cover'}
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = 'https://cdn.21st.dev/assets/mirror/20/202ffce6b7b0033fa5516a872cec215e4edbb8d25bc98a77988cfb950fffdb9e.svg';
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className={'absolute inset-0 bg-black/40'} />

      {/* Caption Text */}
      <span
        className={`absolute text-lg font-semibold whitespace-nowrap text-white transition-all duration-300 ease-in-out ${
          isActive
            ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
            : 'bottom-24 left-1/2 w-auto -translate-x-1/2 rotate-90 text-left'
        }`}
      >
        {item.title}
      </span>
    </div>
  );
};

// --- Main App Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(4);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={'bg-white font-sans'}>
      <section className={'container mx-auto px-4 py-12 md:py-24'}>
        <div className={'flex flex-col items-center justify-between gap-12 md:flex-row'}>
          {/* Left Side: Text Content */}
          <div className={'w-full text-center md:w-1/2 md:text-left'}>
            <h1 className={'text-4xl leading-tight font-bold tracking-tighter text-gray-900 md:text-6xl'}>
              {'Accelerate Gen-AI Tasks on Any Device'}
            </h1>
            <p className={'mx-auto mt-6 max-w-xl text-lg text-gray-600 md:mx-0'}>
              {'Build high-performance AI apps on-device without the hassle of model compression or edge deployment.'}
            </p>
            <div className={'mt-8'}>
              <a
                href={'#contact'}
                className={'inline-block rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-gray-800'}
              >
                {'Contact Us'}
              </a>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className={'w-full md:w-1/2'}>
            <div className={'flex flex-row items-center justify-center gap-4 overflow-x-auto p-4'}>
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                  onClick={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
