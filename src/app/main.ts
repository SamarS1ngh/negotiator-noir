import '@fontsource/oswald/400.css';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '../ui/theme.css';
import { startGame } from './game';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) startGame(app, COLLECTOR, COLLECTOR_SCRIPT);
