import { MeshGradient } from '@paper-design/shaders-react';

export default function Waitlist() {
  return (
    <div className={'relative min-h-screen overflow-hidden'}>
      <div className={'fixed inset-0 z-0'}>
        <MeshGradient
          style={{ height: '100vh', width: '100vw' }}
          distortion={0.8}
          swirl={0.1}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={['hsl(216, 90%, 27%)', 'hsl(243, 68%, 36%)', 'hsl(205, 91%, 64%)', 'hsl(211, 61%, 57%)']}
        />
      </div>

      <div className={'relative z-10'}>
        {/* Main content */}
        <main className={'my-0 flex min-h-screen items-center justify-center p-4'}>
          <div className={'mx-auto w-full max-w-2xl space-y-8 text-center'}>
            {/* Hero section */}
            <div className={'font-sans text-4xl font-bold tracking-tight text-white drop-shadow-2xl md:text-6xl'}>
              <h1 className={'py-[23px] text-4xl font-semibold tracking-tight text-white drop-shadow-2xl md:text-6xl'}>
                {'We are launching SickUI soon!'}
                <span className={'text-4xl font-bold tracking-tight text-white drop-shadow-2xl md:text-6xl'}>
                  {' '}
                </span>
              </h1>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
