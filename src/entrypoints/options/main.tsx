import { documentSurface } from '@/surface/document';
import OptionsApp from '@/react-app/apps/options/App';
import { renderSurfaceApp } from '@/react-app/bootstrap';

void renderSurfaceApp(document.getElementById('root')!, documentSurface(), <OptionsApp />);
