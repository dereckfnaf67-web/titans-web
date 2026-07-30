import { useRouter } from '@/lib/router';
import { Background } from '@/components/Background';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Home } from '@/pages/Home';
import { Scrims } from '@/pages/Scrims';

function App() {
  const { route, navigate } = useRouter();

  return (
    <div className="grain relative min-h-screen bg-black text-white">
      <Background />
      <Nav route={route} navigate={navigate} />

      {route === '/scrims' ? (
        <Scrims />
      ) : (
        <Home navigate={navigate} />
      )}

      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
