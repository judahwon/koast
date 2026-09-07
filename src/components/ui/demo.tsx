import React from 'react';
import { FlippingCard } from '@/components/ui/flipping-card';

interface CardData {
  id: string;
  front: {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
  };
  back: {
    description: string;
    buttonText: string;
  };
}

const cardsData: CardData[] = [
  {
    id: 'design-excellence',
    front: {
      imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      imageAlt: 'Design Excellence',
      title: 'Design Excellence',
      description: 'Beautiful, intuitive designs that create meaningful connections with users.',
    },
    back: {
      description: 'We craft exceptional user experiences through thoughtful design, user research, and modern design systems that ensure consistency and accessibility.',
      buttonText: 'View Portfolio',
    },
  },
  {
    id: 'data-analytics',
    front: {
      imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      imageAlt: 'Data Analytics',
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights that drive informed decision-making.',
    },
    back: {
      description: 'Our data analytics platform provides real-time insights, predictive modeling, and interactive dashboards to help businesses make data-driven decisions.',
      buttonText: 'Learn More',
    },
  },
];

interface GenericCardFrontProps {
  data: CardData['front'];
}

function GenericCardFront({ data }: GenericCardFrontProps) {
  return (
    <div className={'flex size-full flex-col p-4'}>
      <img
        src={data.imageSrc}
        alt={data.imageAlt}
        className={'h-auto min-h-0 w-full grow rounded-md object-cover'}
      />
      <div className={'p-2'}>
        <h3 className={'mt-2 text-base font-semibold'}>{data.title}</h3>
        <p className={'mt-2 text-[13.5px] text-content-secondary'}>
          {data.description}
        </p>
      </div>
    </div>
  );
}

interface GenericCardBackProps {
  data: CardData['back'];
}

function GenericCardBack({ data }: GenericCardBackProps) {
  return (
    <div className={'flex size-full flex-col items-center justify-center p-6'}>
      <p className={'text-center text-[13.5px] text-content-secondary'}>
        {data.description}
      </p>
      <button className={'mt-6 flex h-8 w-min items-center justify-center rounded-md bg-content-primary px-4 py-2 text-[13.5px] whitespace-nowrap text-white'}>
        {data.buttonText}
      </button>
    </div>
  );
}

export default function FlippingCardDemo() {
  return (
    <div className={'flex flex-wrap justify-center gap-4 p-8'}>
      {cardsData.map((card) => (
        <FlippingCard
          key={card.id}
          width={300}
          height={380}
          frontContent={<GenericCardFront data={card.front} />}
          backContent={<GenericCardBack data={card.back} />}
        />
      ))}
    </div>
  );
}
