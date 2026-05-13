import { Navigation } from '@/components/ui/Navigation';
import { SceneHero } from '@/components/scenes/SceneHero';
import { SceneDriver } from '@/components/scenes/SceneDriver';
import { SceneDetail } from '@/components/scenes/SceneDetail';
import { SceneEditorial } from '@/components/scenes/SceneEditorial';
import { SceneProduct } from '@/components/scenes/SceneProduct';
import { Footer } from '@/components/ui/Footer';

/**
 * The full cinematic edit, top to bottom.
 *
 *   01  Hero         — Porsche interior, headline reveal
 *   02  Driver       — POV night drive, editorial body
 *   03  Detail       — close-up cap, sticky display + list
 *   04  Editorial    — mysterious man + car, three-frame headline
 *   --  Footer       — "Stay for the next chapter."
 */
export default function HomePage() {
  return (
    <main className="relative">
      <Navigation />
      <SceneHero />
      <SceneDriver />
      <SceneDetail />
      <SceneEditorial />
      <SceneProduct />
      <Footer />
    </main>
  );
}
