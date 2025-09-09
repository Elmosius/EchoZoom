import Hero from './components/Hero';

export default function App() {
  return (
    <main className='min-h-screen bg-primary'>
      <p className='absolute inset-0 p-4 text-accent/50 font-bold text-5xl'>Scroll down</p>
      <Hero />
    </main>
  );
}
