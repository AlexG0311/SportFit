# SporTif App

Aplicación móvil en **React Native + Expo** para capturar una foto o elegirla de la galería, enviarla al backend y mostrar el resultado del análisis corporal.

## Estructura actual

```text
SportFit/
├── App.js
├── app.json
├── assets/
├── global.css
├── index.js
├── metro.config.js
├── package.json
├── tailwind.config.js
├── babel.config.js
├── AGENTS.md
├── CLAUDE.md
├── .claude/
├── .expo/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Button.js
│   │       ├── Card.js
│   │       ├── GradientText.js
│   │       ├── Input.js
│   │       ├── LoadingSpinner.js
│   │       ├── ProgressBar.js
│   │       └── SkeletonLoader.js
│   ├── context/
│   │   ├── AnalysisContext.js
│   │   └── AuthContext.js
│   ├── navigation/
│   │   ├── MainTabs.js
│   │   └── RootNavigator.js
│   ├── screens/
│   │   ├── CameraScreen.js
│   │   ├── HistoryScreen.js
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── ProcessingScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── RecommendationScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ResultScreen.js
│   │   └── SplashScreen.js
│   ├── services/
│   │   ├── analysisService.js
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── historyService.js
│   │   └── recommendationService.js
│   ├── styles/
│   │   └── theme.js
│   └── utils/
│       ├── constants.js
│       ├── formatters.js
│       └── validators.js
└── README.md
```

## Qué hace cada archivo

- `App.js`: punto de entrada de la app, monta navegación, contexto y `SafeAreaView`.
- `index.js`: registra la app en Expo.
- `app.json`: configuración general de Expo.
- `package.json`: dependencias y scripts de inicio.
- `babel.config.js`: configuración de Babel para Expo y NativeWind.
- `metro.config.js`: configuración del bundler Metro.
- `tailwind.config.js`: configuración de clases Tailwind/NativeWind.
- `global.css`: estilos globales usados por NativeWind.
- `assets/`: imágenes, iconos y recursos estáticos.
- `src/components/common/`: componentes reutilizables de UI.
- `src/context/AnalysisContext.js`: estado compartido del análisis corporal.
- `src/context/AuthContext.js`: estado de autenticación de la app.
- `src/navigation/RootNavigator.js`: define el flujo principal de pantallas.
- `src/navigation/MainTabs.js`: pestañas principales de la app.
- `src/screens/CameraScreen.js`: abre cámara o galería y envía la imagen al backend.
- `src/screens/ProcessingScreen.js`: pantalla intermedia mientras se procesa la foto.
- `src/screens/ResultScreen.js`: muestra somatotipo, métricas e imagen anotada.
- `src/screens/RecommendationScreen.js`: muestra recomendaciones deportivas.
- `src/screens/HomeScreen.js`: pantalla principal de inicio.
- `src/screens/LoginScreen.js`: pantalla de acceso.
- `src/screens/RegisterScreen.js`: pantalla de registro.
- `src/screens/HistoryScreen.js`: historial de análisis.
- `src/screens/ProfileScreen.js`: perfil del usuario.
- `src/screens/SplashScreen.js`: pantalla de carga inicial.
- `src/services/api.js`: instancia central de Axios.
- `src/services/analysisService.js`: envía la imagen al backend para analizarla.
- `src/services/authService.js`: lógica de autenticación.
- `src/services/historyService.js`: manejo del historial.
- `src/services/recommendationService.js`: obtención de recomendaciones.
- `src/styles/theme.js`: colores, tipografías y estilos base.
- `src/utils/constants.js`: URLs, nombres de pantallas y constantes de dominio.
- `src/utils/formatters.js`: funciones para formatear texto y valores.
- `src/utils/validators.js`: validaciones de formularios y datos.
- `.expo/`: archivos generados por Expo en el entorno local.
- `.claude/`: configuración local de herramientas.
- `AGENTS.md` y `CLAUDE.md`: instrucciones y contexto para agentes/herramientas del proyecto.

## Flujo general

1. El usuario abre la cámara o selecciona una foto desde la galería.
2. `CameraScreen.js` envía la imagen a `analysisService.js`.
3. El backend responde con somatotipo, medidas e imagen anotada.
4. `ResultScreen.js` presenta el resultado y `RecommendationScreen.js` sugiere actividades.

## Ejecución

Desde la carpeta `SportFit`:

```bash
npm install
npx expo start
```

Antes de probar en el móvil, ajusta `API_BASE_URL` en `src/utils/constants.js` con la IP local de tu PC.