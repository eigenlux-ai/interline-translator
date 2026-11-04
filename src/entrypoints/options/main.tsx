import { documentSurface } from '@/surface/document';
import OptionsApp from '@/react-app/apps/options/App';
import { renderSurfaceApp } from '@/react-app/bootstrap';
import '@/react-app/styles/document-surface.css';

void renderSurfaceApp(document.getElementById('root')!, documentSurface(), <OptionsApp />);
