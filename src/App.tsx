
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

function App() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [topHeight, setTopHeight] = useState(66.67);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlSceneRef = useRef<HTMLDivElement>(null);
  const trSceneRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!tlSceneRef.current || !trSceneRef.current) return;

    // Heliocentric view (TL)
    const tlScene = new THREE.Scene();
    const tlCamera = new THREE.PerspectiveCamera(75, tlSceneRef.current.clientWidth / tlSceneRef.current.clientHeight, 0.1, 1000);
    const tlRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    tlRenderer.setSize(tlSceneRef.current.clientWidth, tlSceneRef.current.clientHeight);
    tlRenderer.setClearColor(0x000000, 0);
    tlSceneRef.current.innerHTML = '';
    tlSceneRef.current.appendChild(tlRenderer.domElement);

    // Geocentric view (TR)
    const trScene = new THREE.Scene();
    const trCamera = new THREE.PerspectiveCamera(75, trSceneRef.current.clientWidth / trSceneRef.current.clientHeight, 0.1, 1000);
    const trRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    trRenderer.setSize(trSceneRef.current.clientWidth, trSceneRef.current.clientHeight);
    trRenderer.setClearColor(0x000000, 0);
    trSceneRef.current.innerHTML = '';
    trSceneRef.current.appendChild(trRenderer.domElement);

    // Create celestial bodies for heliocentric view
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    tlScene.add(sun);

    const earthGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    tlScene.add(earth);

    const marsGeometry = new THREE.SphereGeometry(1, 32, 32);
    const marsMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    tlScene.add(mars);

    // Create celestial bodies for geocentric view
    const earthGeoGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const earthGeoMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const earthGeo = new THREE.Mesh(earthGeoGeometry, earthGeoMaterial);
    earthGeo.position.set(0, 0, 0);
    trScene.add(earthGeo);

    const marsGeoGeometry = new THREE.SphereGeometry(1, 32, 32);
    const marsGeoMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const marsGeo = new THREE.Mesh(marsGeoGeometry, marsGeoMaterial);
    trScene.add(marsGeo);

    // Add stars background
    const createStars = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
      const starVertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starVertices.push(x, y, z);
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      return new THREE.Points(starGeometry, starMaterial);
    };

    tlScene.add(createStars());
    trScene.add(createStars());

    // Position cameras for top-down view
    tlCamera.position.y = 25;
    tlCamera.lookAt(0, 0, 0);
    trCamera.position.y = 25;
    trCamera.lookAt(0, 0, 0);

    // Create orbit paths (rings) for heliocentric view
    const earthOrbitGeometry = new THREE.RingGeometry(10, 10.1, 64);
    const earthOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide, opacity: 0.3, transparent: true });
    const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
    earthOrbit.rotation.x = Math.PI / 2;
    tlScene.add(earthOrbit);

    const marsOrbitGeometry = new THREE.RingGeometry(16, 16.1, 64);
    const marsOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500, side: THREE.DoubleSide, opacity: 0.3, transparent: true });
    const marsOrbit = new THREE.Mesh(marsOrbitGeometry, marsOrbitMaterial);
    marsOrbit.rotation.x = Math.PI / 2;
    tlScene.add(marsOrbit);

    // Create trail for Mars in geocentric view
    const trailPoints: THREE.Mesh[] = [];
    const trailLimit = 200;

    // Animation variables
    let earthAngle = 0;
    let marsAngle = 0;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      if (isAnimating) {
        // Update angles based on orbital periods (Earth: 1 year, Mars: 1.88 years)
        earthAngle += 0.01 * speed;
        marsAngle += (0.01 * speed) / 1.88; // Mars moves slower

        // Heliocentric positions
        earth.position.x = Math.cos(earthAngle) * 10;
        earth.position.z = Math.sin(earthAngle) * 10;

        mars.position.x = Math.cos(marsAngle) * 16;
        mars.position.z = Math.sin(marsAngle) * 16;

        // Geocentric view: position Mars relative to Earth
        const marsGeoX = mars.position.x - earth.position.x;
        const marsGeoZ = mars.position.z - earth.position.z;

        // Update Mars position in geocentric view
        marsGeo.position.x = marsGeoX;
        marsGeo.position.z = marsGeoZ;

        // Add trail point
        const trailGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const trailMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 });
        const trailPoint = new THREE.Mesh(trailGeometry, trailMaterial);
        trailPoint.position.set(marsGeoX, 0, marsGeoZ);
        trailPoint.userData = { isTrail: true };
        trScene.add(trailPoint);
        trailPoints.push(trailPoint);

        // Remove oldest trail point if limit exceeded
        if (trailPoints.length > trailLimit) {
          const oldest = trailPoints.shift();
          if (oldest) trScene.remove(oldest);
        }
      }

      tlRenderer.render(tlScene, tlCamera);
      trRenderer.render(trScene, trCamera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (tlSceneRef.current && trSceneRef.current) {
        tlCamera.aspect = tlSceneRef.current.clientWidth / tlSceneRef.current.clientHeight;
        tlCamera.updateProjectionMatrix();
        tlRenderer.setSize(tlSceneRef.current.clientWidth, tlSceneRef.current.clientHeight);

        trCamera.aspect = trSceneRef.current.clientWidth / trSceneRef.current.clientHeight;
        trCamera.updateProjectionMatrix();
        trRenderer.setSize(trSceneRef.current.clientWidth, trSceneRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      tlRenderer.dispose();
      trRenderer.dispose();
    };
  }, [isAnimating, speed]);

  const handleVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    
    const startX = e.clientX;
    const containerRect = container.getBoundingClientRect();
    const startWidth = leftWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const containerWidth = containerRect.width;
      const newWidth = startWidth + (diff / containerWidth) * 100;
      
      if (newWidth > 10 && newWidth < 90) {
        setLeftWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleHorizontalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    
    const startY = e.clientY;
    const containerRect = container.getBoundingClientRect();
    const startHeight = topHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientY - startY;
      const containerHeight = containerRect.height;
      const newHeight = startHeight - (diff / containerHeight) * 100;
      
      if (newHeight > 10 && newHeight < 90) {
        setTopHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
<div 
  ref={containerRef}
  className="flex flex-col h-screen bg-slate-900 container mx-auto max-w-6xl"
>

<header className="text-center py-6 bg-gradient-to-b from-slate-800 to-slate-900 shadow-md rounded-t-xl border-b border-gray-700/50">
  <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
    Cerebras x Cline: $5,000 Vibe Coder Hackathon
  </h1>
  <h2 className="text-2xl font-medium text-gray-700 tracking-wide">
    飞向天空的狮子
  </h2>
</header>
{/* Top section (2/3 viewport height) */}
<div className="flex flex-1" style={{ height: '66.67vh' }}>
        {/* Left pane */}
        <div 
          className="flex-1 border-r border-gray-700/50 rounded-tl-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-sm hover:border-indigo-400/70 hover:shadow-lg hover:ring-1 hover:ring-indigo-400/20 transition-all duration-200 group relative"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="h-full flex flex-col items-center justify-center text-gray-200 font-medium p-4 group-hover:text-indigo-300 transition-colors duration-200">
            <h3 className="text-lg font-bold mb-2 text-white">Heliocentric View</h3>
            <p className="text-sm mb-4">Sun-centered view of planetary orbits</p>
            <div ref={tlSceneRef} className="w-full h-full" />
          </div>
        </div>
        
        {/* Vertical splitter */}
        <div 
          className="w-1.5 bg-gray-600/50 hover:bg-indigo-400/30 cursor-col-resize group"
          onMouseDown={handleVerticalDrag}
        >
          <div className="w-4 h-full -ml-1.5 bg-gray-700/0 group-hover:bg-indigo-300/50 transition-colors" />
        </div>
        
        {/* Right pane */}
<div 
  className="flex-1 border-l border-gray-700/50 rounded-tr-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-sm hover:border-indigo-400/70 hover:shadow-lg hover:ring-1 hover:ring-indigo-400/20 transition-all duration-200 group relative"
  style={{ width: `${100 - leftWidth}%` }}
>
          <div className="h-full flex flex-col items-center justify-center text-gray-200 font-medium p-4 group-hover:text-indigo-300 transition-colors duration-200">
            <h3 className="text-lg font-bold mb-2 text-white">Geocentric View</h3>
            <p className="text-sm mb-4">Earth-centered view showing Mars retrograde</p>
            <div ref={trSceneRef} className="w-full h-full" />
          </div>
        </div>
      </div>
      
      {/* Horizontal splitter */}
      <div 
        className="h-1.5 bg-gray-600/50 hover:bg-indigo-400/30 cursor-row-resize group"
        onMouseDown={handleHorizontalDrag}
      >
        <div className="h-4 w-full -mt-1.5 bg-gray-700/0 group-hover:bg-indigo-300/50 transition-colors" />
      </div>
      
      {/* Bottom section (1/3 viewport height) */}
<div 
  className="flex-1 border-t border-gray-700/50 rounded-b-xl bg-gradient-to-tl from-slate-800 to-slate-900 shadow-sm hover:border-indigo-400/70 hover:shadow-lg hover:ring-1 hover:ring-indigo-400/20 transition-all duration-200 group"
  style={{ height: '33.33vh' }}
>
  <div className="h-full p-6 text-gray-200">
    <h2 className="text-xl font-bold mb-3 text-white flex items-center">
      <span className="inline-block w-2 h-2 bg-indigo-300 rounded-full mr-2" />
      Mars Retrograde Phenomenon
    </h2>
    <p className="text-base leading-relaxed mb-4">
      Mars retrograde is an astronomical phenomenon that occurs approximately every 26 months when Mars appears to move backward in the sky from the perspective of Earth. This apparent backward motion is an optical illusion caused by the relative orbital speeds of Earth and Mars around the Sun.
    </p>
    <div className="flex items-center space-x-4 mb-4">
      <button 
        onClick={() => setIsAnimating(!isAnimating)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
      >
        {isAnimating ? 'Pause' : 'Play'} Animation
      </button>
      <div className="flex items-center space-x-2">
        <label className="text-sm">Speed:</label>
        <input 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-24"
        />
        <span className="text-sm w-8">{speed}x</span>
      </div>
    </div>
    <div className="mt-4 p-3 bg-indigo-900/30 rounded-lg border border-indigo-700/50">
      <p className="text-sm text-indigo-200 font-medium">
        The heliocentric view (left) shows the actual orbits of Earth and Mars around the Sun. 
        The geocentric view (right) shows how Mars appears to move from Earth's perspective, 
        including the retrograde loop that occurs every ~26 months.
      </p>
    </div>
  </div>
</div>
    </div>
  );
}

export default App;
