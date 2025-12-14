'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Aduanas y pasos fronterizos
const ADUANAS = [
  // Region Metropolitana
  { id: 1, nombre: 'Aduana Metropolitana', direccion: 'Plaza Sotomayor 60', ciudad: 'Santiago', region: 'Metropolitana', telefono: '22 770 5000', tipo: 'Principal', horario: 'Lun-Vie 8:30-17:00' },
  { id: 2, nombre: 'Aeropuerto Arturo Merino Benitez', direccion: 'Aeropuerto SCL', ciudad: 'Santiago', region: 'Metropolitana', telefono: '22 770 5100', tipo: 'Aeropuerto', horario: '24 horas' },
  // Valparaiso
  { id: 3, nombre: 'Aduana de Valparaiso', direccion: 'Plaza Sotomayor 50', ciudad: 'Valparaiso', region: 'Valparaiso', telefono: '32 220 0600', tipo: 'Maritima', horario: 'Lun-Vie 8:30-17:00' },
  { id: 4, nombre: 'Paso Los Libertadores', direccion: 'Ruta 60 CH', ciudad: 'Los Andes', region: 'Valparaiso', telefono: '34 229 1000', tipo: 'Terrestre', horario: '8:00-22:00 (variable)' },
  // Antofagasta
  { id: 5, nombre: 'Aduana de Antofagasta', direccion: 'Washington 2615', ciudad: 'Antofagasta', region: 'Antofagasta', telefono: '55 245 3000', tipo: 'Maritima', horario: 'Lun-Vie 8:30-17:00' },
  { id: 6, nombre: 'Paso Jama', direccion: 'Ruta 27 CH', ciudad: 'San Pedro de Atacama', region: 'Antofagasta', telefono: '55 285 1000', tipo: 'Terrestre', horario: '8:00-20:00' },
  { id: 7, nombre: 'Paso Sico', direccion: 'Ruta 23 CH', ciudad: 'San Pedro de Atacama', region: 'Antofagasta', telefono: '55 285 1050', tipo: 'Terrestre', horario: '8:00-18:00' },
  // Tarapaca
  { id: 8, nombre: 'Aduana de Iquique', direccion: 'Arturo Prat 492', ciudad: 'Iquique', region: 'Tarapaca', telefono: '57 241 0000', tipo: 'Zona Franca', horario: 'Lun-Vie 8:30-17:00' },
  { id: 9, nombre: 'Paso Colchane', direccion: 'Ruta 15 CH', ciudad: 'Colchane', region: 'Tarapaca', telefono: '57 275 1000', tipo: 'Terrestre', horario: '8:00-20:00' },
  // Arica
  { id: 10, nombre: 'Aduana de Arica', direccion: 'Arturo Prat 305', ciudad: 'Arica', region: 'Arica y Parinacota', telefono: '58 220 6000', tipo: 'Zona Franca', horario: 'Lun-Vie 8:30-17:00' },
  { id: 11, nombre: 'Paso Chacalluta', direccion: 'Ruta 5 Norte', ciudad: 'Arica', region: 'Arica y Parinacota', telefono: '58 220 6100', tipo: 'Terrestre', horario: '24 horas' },
  // Biobio
  { id: 12, nombre: 'Aduana de Talcahuano', direccion: 'Blanco 1448', ciudad: 'Talcahuano', region: 'Biobio', telefono: '41 250 1000', tipo: 'Maritima', horario: 'Lun-Vie 8:30-17:00' },
  { id: 13, nombre: 'Paso Pino Hachado', direccion: 'Ruta 181 CH', ciudad: 'Lonquimay', region: 'La Araucania', telefono: '45 273 1000', tipo: 'Terrestre', horario: '8:00-20:00' },
  // Los Lagos
  { id: 14, nombre: 'Aduana de Puerto Montt', direccion: 'Antonio Varas 595', ciudad: 'Puerto Montt', region: 'Los Lagos', telefono: '65 226 2000', tipo: 'Maritima', horario: 'Lun-Vie 8:30-17:00' },
  { id: 15, nombre: 'Paso Cardenal Samore', direccion: 'Ruta 215 CH', ciudad: 'Osorno', region: 'Los Lagos', telefono: '64 233 1000', tipo: 'Terrestre', horario: '8:00-21:00' },
  // Magallanes
  { id: 16, nombre: 'Aduana de Punta Arenas', direccion: "O'Higgins 1085", ciudad: 'Punta Arenas', region: 'Magallanes', telefono: '61 224 1000', tipo: 'Maritima', horario: 'Lun-Vie 8:30-17:00' },
  { id: 17, nombre: 'Paso Integra Austral', direccion: 'Ruta 9', ciudad: 'Puerto Natales', region: 'Magallanes', telefono: '61 241 1500', tipo: 'Terrestre', horario: '8:00-22:00' },
];

const REGIONES = ['Todas', 'Metropolitana', 'Valparaiso', 'Antofagasta', 'Tarapaca', 'Arica y Parinacota', 'Biobio', 'La Araucania', 'Los Lagos', 'Magallanes'];

// Aranceles por categoria
const ARANCELES = {
  general: 0.06, // 6% arancel general
  iva: 0.19, // 19% IVA
  lujo: 0.15, // 15% impuesto adicional lujo (autos, etc)
};

// Franquicias
const FRANQUICIAS = [
  { tipo: 'Equipaje viajero', monto: 500, descripcion: 'Articulos nuevos para uso personal', condicion: 'Por persona mayor de 15 anos' },
  { tipo: 'Equipaje menor 15 anos', monto: 150, descripcion: 'Articulos nuevos para menores', condicion: 'Por menor de 15 anos' },
  { tipo: 'Courier/Paqueteria', monto: 41, descripcion: 'Compras por internet (hasta $41 USD)', condicion: 'Sin limite de envios' },
  { tipo: 'Compras por internet', monto: 500, descripcion: 'Con sobre cuota de $41', condicion: 'Requiere declaracion' },
  { tipo: 'Zona Franca Iquique', monto: 1655, descripcion: 'Compras en ZOFRI', condicion: '1x al ano por RUT' },
  { tipo: 'Zona Franca Punta Arenas', monto: 1243, descripcion: 'Compras en Zona Austral', condicion: '1x al ano por RUT' },
];

// Productos prohibidos/restringidos
const PROHIBIDOS = [
  { producto: 'Drogas y estupefacientes', tipo: 'Prohibido', icono: '🚫' },
  { producto: 'Armas y municiones (sin permiso)', tipo: 'Prohibido', icono: '🚫' },
  { producto: 'Pornografia infantil', tipo: 'Prohibido', icono: '🚫' },
  { producto: 'Productos falsificados', tipo: 'Prohibido', icono: '🚫' },
  { producto: 'Especies protegidas (CITES)', tipo: 'Prohibido', icono: '🚫' },
  { producto: 'Alimentos frescos (sin SAG)', tipo: 'Restringido', icono: '⚠️' },
  { producto: 'Medicamentos (sin receta)', tipo: 'Restringido', icono: '⚠️' },
  { producto: 'Plantas y semillas', tipo: 'Restringido', icono: '⚠️' },
  { producto: 'Productos de origen animal', tipo: 'Restringido', icono: '⚠️' },
  { producto: 'Vehiculos usados (+3 anos)', tipo: 'Restringido', icono: '⚠️' },
];

// Tramites aduaneros
const TRAMITES = [
  { nombre: 'Declaracion de Ingreso (DIN)', descripcion: 'Importacion comercial de mercancias', requisitos: ['RUT importador', 'Factura comercial', 'Conocimiento embarque', 'Certificado origen'], plazo: '90 dias' },
  { nombre: 'Declaracion Jurada Simple', descripcion: 'Importacion de bajo valor (<USD 1.000)', requisitos: ['Cedula identidad', 'Boleta/Factura', 'Guia courier'], plazo: '30 dias' },
  { nombre: 'Admision Temporal', descripcion: 'Ingreso temporal de mercancias', requisitos: ['Garantia', 'Justificacion', 'Plazo retorno'], plazo: 'Variable' },
  { nombre: 'Declaracion de Salida (DUS)', descripcion: 'Exportacion de mercancias', requisitos: ['RUT exportador', 'Factura exportacion', 'Documentos transporte'], plazo: 'Antes embarque' },
  { nombre: 'Transito Aduanero', descripcion: 'Paso de mercancias por territorio', requisitos: ['Manifiesto', 'Garantia', 'Ruta autorizada'], plazo: 'Segun ruta' },
];

export default function AduanasModule() {
  const [busqueda, setBusqueda] = useState('');
  const [regionFiltro, setRegionFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [seccionActiva, setSeccionActiva] = useState<'buscador' | 'aranceles' | 'franquicias' | 'prohibidos' | 'tramites' | 'glosario'>('buscador');

  // Calculadora de aranceles
  const [valorCIF, setValorCIF] = useState('');
  const [esLujo, setEsLujo] = useState(false);

  const aduanasFiltradas = ADUANAS.filter(a => {
    const coincideBusqueda = busqueda === '' ||
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.ciudad.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRegion = regionFiltro === 'Todas' || a.region === regionFiltro;
    const coincideTipo = tipoFiltro === 'Todos' || a.tipo === tipoFiltro;
    return coincideBusqueda && coincideRegion && coincideTipo;
  });

  const calcularImpuestos = () => {
    const cif = parseFloat(valorCIF) || 0;
    const arancel = cif * ARANCELES.general;
    const baseIVA = cif + arancel;
    const iva = baseIVA * ARANCELES.iva;
    const lujo = esLujo ? cif * ARANCELES.lujo : 0;
    const total = arancel + iva + lujo;

    return { cif, arancel, iva, lujo, total, totalPagar: cif + total };
  };

  const formatearUSD = (valor: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor);
  };

  const formatearPesos = (valor: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
  };

  const impuestos = calcularImpuestos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-5xl mb-3 block">🛃</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Aduanas <span className="text-indigo-400">Chile</span>
            </h1>
            <p className="text-indigo-200/70">
              Pasos fronterizos, aranceles, franquicias y tramites aduaneros
            </p>
          </motion.div>
        </div>
      </header>

      {/* Navegacion */}
      <nav className="bg-black/20 border-b border-indigo-500/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {[
              { id: 'buscador', label: '🔍 Buscador', sublabel: 'Aduanas' },
              { id: 'aranceles', label: '🧮 Aranceles', sublabel: 'Calculadora' },
              { id: 'franquicias', label: '🎁 Franquicias', sublabel: 'Exenciones' },
              { id: 'prohibidos', label: '🚫 Prohibidos', sublabel: 'Productos' },
              { id: 'tramites', label: '📋 Tramites', sublabel: 'Documentos' },
              { id: 'glosario', label: '📖 Glosario', sublabel: 'Terminos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSeccionActiva(tab.id as typeof seccionActiva)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  seccionActiva === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'text-indigo-200 hover:bg-indigo-500/20'
                }`}
              >
                <span className="block">{tab.label}</span>
                <span className="text-xs opacity-70">{tab.sublabel}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Buscador de Aduanas */}
        {seccionActiva === 'buscador' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🔍</span> Buscar Aduana o Paso Fronterizo
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-indigo-200 text-sm mb-2">Buscar por nombre o ciudad</label>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Ej: Los Libertadores, Arica..."
                    className="w-full px-4 py-3 bg-black/30 border border-indigo-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-indigo-200 text-sm mb-2">Region</label>
                  <select
                    value={regionFiltro}
                    onChange={(e) => setRegionFiltro(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {REGIONES.map(r => (
                      <option key={r} value={r} className="bg-slate-800">{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-indigo-200 text-sm mb-2">Tipo</label>
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Todos" className="bg-slate-800">Todos</option>
                    <option value="Terrestre" className="bg-slate-800">Terrestre</option>
                    <option value="Maritima" className="bg-slate-800">Maritima</option>
                    <option value="Aeropuerto" className="bg-slate-800">Aeropuerto</option>
                    <option value="Zona Franca" className="bg-slate-800">Zona Franca</option>
                    <option value="Principal" className="bg-slate-800">Principal</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-indigo-200/60">
                Mostrando {aduanasFiltradas.length} de {ADUANAS.length} aduanas
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {aduanasFiltradas.map((aduana, i) => (
                <motion.div
                  key={aduana.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 backdrop-blur border border-indigo-500/20 rounded-xl p-5 hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white">{aduana.nombre}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      aduana.tipo === 'Terrestre' ? 'bg-green-500/20 text-green-300' :
                      aduana.tipo === 'Maritima' ? 'bg-blue-500/20 text-blue-300' :
                      aduana.tipo === 'Aeropuerto' ? 'bg-purple-500/20 text-purple-300' :
                      aduana.tipo === 'Zona Franca' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {aduana.tipo}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400 flex items-center gap-2">
                      <span>📍</span> {aduana.direccion}, {aduana.ciudad}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <span>📞</span> {aduana.telefono}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <span>🕐</span> {aduana.horario}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <span>🗺️</span> {aduana.region}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {aduanasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-gray-400">No se encontraron aduanas con esos criterios</p>
              </div>
            )}
          </motion.section>
        )}

        {/* Calculadora de Aranceles */}
        {seccionActiva === 'aranceles' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-indigo-500/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🧮</span> Calculadora de Impuestos de Importacion
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-indigo-200 text-sm mb-2">Valor CIF (USD)</label>
                    <input
                      type="number"
                      value={valorCIF}
                      onChange={(e) => setValorCIF(e.target.value)}
                      placeholder="Ej: 1000"
                      className="w-full px-4 py-3 bg-black/30 border border-indigo-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">CIF = Costo + Seguro + Flete</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="lujo"
                      checked={esLujo}
                      onChange={(e) => setEsLujo(e.target.checked)}
                      className="w-4 h-4 rounded border-indigo-500/30"
                    />
                    <label htmlFor="lujo" className="text-indigo-200 text-sm">
                      Producto de lujo (vehiculos, joyas, etc.)
                    </label>
                  </div>
                </div>

                {valorCIF && (
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between py-2 border-b border-indigo-500/10">
                      <span className="text-gray-400">Valor CIF</span>
                      <span className="text-white">{formatearUSD(impuestos.cif)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-indigo-500/10">
                      <span className="text-gray-400">Arancel (6%)</span>
                      <span className="text-yellow-400">{formatearUSD(impuestos.arancel)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-indigo-500/10">
                      <span className="text-gray-400">IVA (19%)</span>
                      <span className="text-yellow-400">{formatearUSD(impuestos.iva)}</span>
                    </div>
                    {esLujo && (
                      <div className="flex justify-between py-2 border-b border-indigo-500/10">
                        <span className="text-gray-400">Impuesto Lujo (15%)</span>
                        <span className="text-red-400">{formatearUSD(impuestos.lujo)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 bg-indigo-500/20 rounded-lg px-3">
                      <span className="text-white font-medium">Total Impuestos</span>
                      <span className="text-indigo-300 font-bold">{formatearUSD(impuestos.total)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-green-500/20 rounded-lg px-3">
                      <span className="text-white font-medium">Total a Pagar</span>
                      <span className="text-green-300 font-bold">{formatearUSD(impuestos.totalPagar)}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  * Valores referenciales. Algunos productos tienen aranceles especificos.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-indigo-500/20">
                <h3 className="text-lg font-bold text-white mb-4">📊 Tasas de Impuestos</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Arancel General</span>
                      <span className="text-indigo-400 font-bold">6%</span>
                    </div>
                    <p className="text-gray-500 text-xs">Sobre el valor CIF de la mercancia</p>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">IVA</span>
                      <span className="text-indigo-400 font-bold">19%</span>
                    </div>
                    <p className="text-gray-500 text-xs">Sobre CIF + Arancel</p>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Impuesto Adicional Lujo</span>
                      <span className="text-red-400 font-bold">15%</span>
                    </div>
                    <p className="text-gray-500 text-xs">Vehiculos, joyas, pieles, etc.</p>
                  </div>

                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-yellow-300 text-sm">
                      💡 Chile tiene TLC con muchos paises. Productos de USA, UE, China, etc. pueden tener arancel 0%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Franquicias */}
        {seccionActiva === 'franquicias' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Franquicias Aduaneras</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {FRANQUICIAS.map((franquicia, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur border border-indigo-500/20 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white">{franquicia.tipo}</h3>
                    <span className="text-green-400 font-bold">${franquicia.monto} USD</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{franquicia.descripcion}</p>
                  <p className="text-indigo-300 text-xs">{franquicia.condicion}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span>✈️</span> Viajeros Internacionales
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• $500 USD en articulos nuevos (mayores de 15)</li>
                  <li>• $150 USD para menores de 15 anos</li>
                  <li>• Equipaje personal usado: sin limite</li>
                  <li>• 400 cigarrillos o 500g tabaco</li>
                  <li>• 2.5 litros de bebidas alcoholicas</li>
                  <li>• Perfumes para uso personal</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span>📦</span> Compras por Internet
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Hasta $41 USD: exento de impuestos</li>
                  <li>• Sin limite de envios bajo $41</li>
                  <li>• Sobre $41: paga arancel + IVA</li>
                  <li>• Courier gestiona el pago</li>
                  <li>• Guarda boletas para reclamos</li>
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        {/* Productos Prohibidos */}
        {seccionActiva === 'prohibidos' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Productos Prohibidos y Restringidos</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {PROHIBIDOS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    item.tipo === 'Prohibido'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icono}</span>
                    <div>
                      <p className="text-white font-medium">{item.producto}</p>
                      <p className={`text-xs ${
                        item.tipo === 'Prohibido' ? 'text-red-400' : 'text-yellow-400'
                      }`}>{item.tipo}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h3 className="font-bold text-red-400 mb-4">🚫 Prohibidos (no pueden ingresar)</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Drogas y sustancias psicoactivas</li>
                  <li>• Armas sin autorizacion</li>
                  <li>• Material con pornografia infantil</li>
                  <li>• Productos piratas o falsificados</li>
                  <li>• Residuos toxicos o peligrosos</li>
                  <li>• Especies protegidas (flora/fauna)</li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="font-bold text-yellow-400 mb-4">⚠️ Restringidos (requieren permiso)</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Alimentos: permiso SAG</li>
                  <li>• Medicamentos: receta o ISP</li>
                  <li>• Plantas/semillas: permiso SAG</li>
                  <li>• Telecomunicaciones: Subtel</li>
                  <li>• Vehiculos usados: max 3 anos</li>
                  <li>• Armas deportivas: DGMN</li>
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        {/* Tramites */}
        {seccionActiva === 'tramites' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Tramites Aduaneros</h2>

            <div className="space-y-4">
              {TRAMITES.map((tramite, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur border border-indigo-500/20 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{tramite.nombre}</h3>
                      <p className="text-gray-400 text-sm">{tramite.descripcion}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-sm">
                      {tramite.plazo}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-indigo-300 text-sm font-medium mb-2">Requisitos:</p>
                    <div className="flex flex-wrap gap-2">
                      {tramite.requisitos.map((req, j) => (
                        <span key={j} className="px-2 py-1 bg-black/20 rounded text-gray-400 text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-6 border border-indigo-500/30">
              <h3 className="font-bold text-white mb-4">📱 Canales de Atencion</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <span className="text-3xl block mb-2">🌐</span>
                  <p className="text-white font-medium">Web</p>
                  <p className="text-gray-500 text-xs">www.aduana.cl</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <span className="text-3xl block mb-2">📞</span>
                  <p className="text-white font-medium">Telefono</p>
                  <p className="text-gray-500 text-xs">600 220 0020</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <span className="text-3xl block mb-2">📧</span>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-500 text-xs">consultas@aduana.cl</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <span className="text-3xl block mb-2">🏢</span>
                  <p className="text-white font-medium">Presencial</p>
                  <p className="text-gray-500 text-xs">Oficinas regionales</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Glosario */}
        {seccionActiva === 'glosario' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Glosario Aduanero</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { termino: 'CIF', definicion: 'Cost, Insurance and Freight. Valor que incluye costo del producto, seguro y flete hasta puerto destino.' },
                { termino: 'FOB', definicion: 'Free On Board. Valor del producto puesto en el puerto de origen, sin incluir flete ni seguro.' },
                { termino: 'DIN', definicion: 'Declaracion de Ingreso. Documento para importar mercancias comercialmente.' },
                { termino: 'DUS', definicion: 'Declaracion Unica de Salida. Documento para exportar mercancias.' },
                { termino: 'Arancel', definicion: 'Impuesto que grava la importacion de mercancias. En Chile es generalmente 6%.' },
                { termino: 'Franquicia', definicion: 'Exencion o reduccion de impuestos para ciertos productos o montos.' },
                { termino: 'Zona Franca', definicion: 'Area geografica con beneficios tributarios especiales para comercio e industria.' },
                { termino: 'Aforo', definicion: 'Revision fisica de mercancias por funcionarios de aduana.' },
                { termino: 'Partida Arancelaria', definicion: 'Codigo numerico que identifica cada tipo de producto para efectos aduaneros.' },
                { termino: 'TLC', definicion: 'Tratado de Libre Comercio. Acuerdo que reduce o elimina aranceles entre paises.' },
                { termino: 'SAG', definicion: 'Servicio Agricola y Ganadero. Autoriza ingreso de productos alimenticios y agricolas.' },
                { termino: 'Agente de Aduanas', definicion: 'Profesional autorizado para representar importadores/exportadores ante Aduana.' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 rounded-xl p-4 border border-indigo-500/20"
                >
                  <h3 className="font-bold text-indigo-400 mb-2">{item.termino}</h3>
                  <p className="text-gray-400 text-sm">{item.definicion}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Aduanas Chile - Parte de{' '}
            <a href="https://newcool-informada.vercel.app" className="text-indigo-400 hover:underline">
              NewCooltura Informada
            </a>
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Informacion referencial. Consulte www.aduana.cl para datos oficiales.
          </p>
        </div>
      </footer>
    </div>
  );
}
