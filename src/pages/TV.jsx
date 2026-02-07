import React, { useState, useEffect, useMemo } from "react";
import { participantes } from "../data/participants";
import { timelineData } from "../data/timeline";

export default function TV() {
  const [view, setView] = useState("ESPERA");
  const [cartaRevelada, setCartaRevelada] = useState(null);
  const [mortos, setMortos] = useState([]);
  const [temaTribunal, setTemaTribunal] = useState(null);
  const [timelineStep, setTimelineStep] = useState(0);

  // Símbolos para cartas viradas (aleatórios, não identificam)
  const simbolosCartas = useMemo(() => {
    return participantes.map(() => {
      const simbolos = ["♠️", "♥️", "♣️", "♦️", "⚜️", "🎴", "🃏", "🌟"];
      return simbolos[Math.floor(Math.random() * simbolos.length)];
    });
  }, []);

  // NUVEM DE PALAVRAS
  const nuvemPalavras = useMemo(() => {
    if (participantes.length === 0) return [];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      texto: participantes[i % participantes.length].palavra,
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 90}%`,
      size: `${Math.random() * 2 + 1}rem`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel("caraval_game");

    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "CLUB_INTRO") setView("CLUB_INTRO");
      if (type === "INTRO") setView("INTRO");
      if (type === "JOGO_CARTAS") setView("CARTAS");
      if (type === "JOGO_SOBREVIVENCIA") setView("SOBREVIVENCIA");
      if (type === "JOGO_TIMELINE") {
        setView("TIMELINE");
        if (payload.step !== undefined) setTimelineStep(payload.step);
      }
      if (type === "JOGO_TRIBUNAL") {
        setView("TRIBUNAL");
        setTemaTribunal(payload.tema);
      }
      if (type === "JOGO_FINAL") setView("FINAL");
      if (type === "JOGO_VEREDITOS") setView("VEREDITOS");

      // --- LÓGICA DE TRANSIÇÃO DA CARTA ---
      if (type === "REVELAR_CARTA") {
        // 1. Fecha a carta imediatamente (volta pra mesa)
        setCartaRevelada(null);

        // 2. Espera 1 segundo vendo a mesa com as cartas pequenas
        setTimeout(() => {
          // 3. Abre a nova carta
          setCartaRevelada(payload.id);
        }, 1000);
      }

      if (type === "MATAR") setMortos((prev) => [...prev, payload.id]);
      if (type === "RESET") {
        setView("ESPERA");
        setCartaRevelada(null);
        setMortos([]);
        setTemaTribunal(null);
        setTimelineStep(0);
      }
    };
    return () => channel.close();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 bg-magia-bg text-magia-paper font-body overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse pointer-events-none"></div>

      {view === "ESPERA" && (
        <h1 className="text-5xl font-title text-magia-gold/50 tracking-widest animate-pulse">
          Aguardando o Lenda...
        </h1>
      )}

      {view === "CLUB_INTRO" && (
        <div className="text-center animate-fade-in z-10">
          <p className="font-title text-magia-gold text-2xl mb-4 uppercase">
            Primeiro Encontro
          </p>
          <h1 className="text-9xl font-title text-magia-paper mb-6 drop-shadow-lg">
            A Culpa é do Livro
          </h1>
          <p className="text-4xl font-hand text-magia-gold">
            "Onde a realidade é a maior ilusão."
          </p>
        </div>
      )}

      {view === "INTRO" && (
        <div className="text-center z-10 animate-fade-in">
          <h1 className="text-[12rem] font-title text-magia-red font-bold drop-shadow-[0_0_35px_rgba(138,11,24,0.6)] leading-none">
            CARAVAL
          </h1>
          <p className="text-3xl font-title text-magia-gold tracking-[0.8em] uppercase mt-8">
            Lembre-se: É apenas um jogo.
          </p>
        </div>
      )}

      {/* ==================================================================
          CARTAS COM ANIMAÇÃO 3D E SÍMBOLOS GENÉRICOS
      ================================================================== */}
      {view === "CARTAS" && (
        <div className="w-full h-full flex flex-col items-center justify-between animate-fade-in z-10 p-4 pb-8">
          <div className="text-center mb-2 flex-shrink-0 z-20">
            <h2 className="text-5xl font-title text-magia-gold border-b-2 border-magia-red/30 inline-block pb-2">
              O Desejo a Lenda
            </h2>
            <p className="text-magia-paper/60 font-hand text-2xl mt-1">
              "Todo desejo exige um pagamento..."
            </p>
          </div>

          {/* GRID DINÂMICO BASEADO NO NÚMERO DE PARTICIPANTES */}
          <div
            className={`grid ${participantes.length <= 8 ? "grid-cols-4" : participantes.length <= 12 ? "grid-cols-5" : "grid-cols-6"} gap-4 w-full max-w-7xl flex-grow place-content-center relative`}
          >
            {participantes.map((p, index) => {
              const isActive = cartaRevelada === p.id;

              return (
                <div
                  key={p.id}
                  className={`relative w-full aspect-[2/3] transition-all duration-1000 ${isActive ? "opacity-0" : "opacity-100"}`}
                >
                  {/* CARTA VIRADA (VERSO) - SÍMBOLO GENÉRICO */}
                  <div className="absolute w-full h-full rounded-lg border-2 border-magia-gold/40 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-2 shadow-xl">
                    <span className="text-4xl mb-3 text-magia-gold">
                      {simbolosCartas[index]}
                    </span>
                    <span className="font-title text-magia-gold/80 text-sm uppercase tracking-widest text-center">
                      CARTA SECRETA
                    </span>
                  </div>
                </div>
              );
            })}

            {/* CARTA GIGANTE REVELADA - COM ANIMAÇÃO 3D */}
            {cartaRevelada &&
              (() => {
                const p = participantes.find(
                  (part) => part.id === cartaRevelada,
                );
                if (!p) return null;

                return (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm bg-black/40 cursor-pointer"
                    onClick={() => setCartaRevelada(null)}
                  >
                    <div
                      key={p.id}
                      className="relative w-[500px] h-[700px] perspective-1000 animate-stomp cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* CARTA COM ANIMAÇÃO DE VIRAR */}
                      <div className="relative w-full h-full preserve-3d transition-transform duration-1000 ease-in-out transform rotate-y-180">
                        {/* VERSO DA CARTA (invisível quando virada) */}
                        <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.5)] border-4 border-magia-gold bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center">
                          <span className="text-6xl mb-4 text-magia-gold">
                            🃏
                          </span>
                          <span className="font-title text-magia-gold text-xl uppercase tracking-widest">
                            CARTA SECRETA
                          </span>
                        </div>

                        {/* FRENTE DA CARTA - CORES CLARAS PARA PROJEÇÃO */}
                        <div className="absolute w-full h-full backface-hidden bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-10 flex flex-col items-center text-center rotate-y-180 border-[6px] border-magia-gold shadow-[0_0_100px_rgba(138,11,24,0.4)]">
                          <p className="text-gray-800 text-8xl font-title leading-none mt-12 mb-4">
                            ❝
                          </p>
                          <div className="flex-grow flex items-center justify-center w-full px-6">
                            <p className="font-hand font-bold leading-tight text-4xl w-full break-words text-gray-900 drop-shadow-sm">
                              "{p.desejo}"
                            </p>
                          </div>
                          <div className="w-32 h-1 bg-gray-800 opacity-30 mb-8"></div>
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 px-8 py-4 rounded border-2 border-magia-gold/70 w-full">
                            <p className="text-xl font-title uppercase tracking-widest font-bold">
                              Preço a Pagar: ???
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      )}

      {/* ==================================================================
          TIMELINE REORGANIZADA - SEM SOBREPOSIÇÃO
      ================================================================== */}
      {view === "TIMELINE" && (
        <div className="w-full max-w-7xl animate-fade-in z-10 flex flex-col items-center justify-center h-full p-4">
          {/* TÍTULO PRINCIPAL */}
          <h2 className="text-5xl font-title text-magia-gold mb-16 drop-shadow-lg uppercase tracking-widest text-center">
            A Trilha do Destino
          </h2>

          {/* CONTAINER PRINCIPAL DA TIMELINE */}
          <div className="w-full flex flex-col lg:flex-row gap-12 items-start">
            {/* COLUNA ESQUERDA - TÍTULO DO CAPÍTULO */}
            <div className="lg:w-2/5 flex flex-col items-center lg:items-start">
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-10 rounded-xl border-4 border-magia-gold shadow-2xl w-full">
                <div className="flex flex-col gap-2 mb-8">
                  <span className="text-gray-800 text-3xl uppercase tracking-widest font-body font-bold">
                    Capítulo {timelineStep + 1}
                  </span>
                </div>
                <div className="w-40 h-1 bg-gray-800 mx-auto mb-10 opacity-50"></div>
                <h3 className="font-title text-5xl text-gray-900 leading-tight font-bold mb-6 text-center">
                  {timelineData[timelineStep].titulo}
                </h3>
                <p className="text-3xl font-hand text-gray-800 leading-relaxed italic mt-6">
                  "{timelineData[timelineStep].pergunta}"
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA - LINHA DO TEMPO VERTICAL */}
            <div className="lg:w-3/5 flex flex-col items-center">
              <div className="relative w-full max-w-3xl">
                {/* LINHA VERTICAL CENTRAL */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-magia-gold/20 rounded-full"></div>
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-magia-red transition-all duration-1000 ease-out"
                  style={{
                    height: `${(timelineStep / (timelineData.length - 1)) * 100}%`,
                    top: "0",
                  }}
                ></div>

                {/* MARCOS DA TIMELINE */}
                {timelineData.map((item, index) => {
                  const isActive = index === timelineStep;
                  const isPast = index < timelineStep;

                  return (
                    <div
                      key={item.id}
                      className={`relative flex items-center mb-16 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                      style={{
                        height: "100px",
                        marginLeft: index % 2 === 0 ? "0" : "auto",
                        marginRight: index % 2 === 0 ? "auto" : "0",
                      }}
                    >
                      {/* CONTEÚDO DO MARCO */}
                      <div
                        className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
                      >
                        {isActive && (
                          <div className="transform transition-all duration-500">
                            <div
                              className={`inline-block ${index % 2 === 0 ? "mr-6" : "ml-6"} bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 rounded-lg border-2 border-magia-gold/50 shadow-lg`}
                            >
                              <span className="text-sm font-title text-gray-800 uppercase tracking-widest">
                                {item.titulo}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CÍRCULO DO MARCO */}
                      <div className="relative z-10">
                        <div
                          className={`w-14 h-14 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${isActive ? "bg-magia-red border-magia-gold scale-125 shadow-[0_0_30px_#8a0b18]" : isPast ? "bg-magia-red/50 border-magia-gold/70" : "bg-gray-800 border-magia-gold/30"}`}
                        >
                          {isActive ? (
                            <span className="text-xl">🌹</span>
                          ) : isPast ? (
                            <span className="text-lg">✓</span>
                          ) : (
                            <span className="text-sm">{index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* ESPAÇO VAZIO DO OUTRO LADO */}
                      <div className="w-1/2"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          TRIBUNAL (TEXTO SEMPRE VISÍVEL) - CORES AJUSTADAS
      ================================================================== */}

      {/* ==================================================================
          SOBREVIVÊNCIA - NOVO LAYOUT GRID 2x2 COM CARTÕES GRANDES
      ================================================================== */}
      {view === "SOBREVIVENCIA" && (
        <div className="w-full h-full animate-fade-in z-10 p-4 overflow-y-auto">
          {/* CABEÇALHO COM CONTADORES */}
          <div className="text-center mb-8">
            <h2 className="text-7xl font-title text-magia-red tracking-widest uppercase mb-6">
              Quem Sobrevive ao Jogo?
            </h2>

            <div className="flex justify-center gap-12 mb-10">
              <div className="bg-gradient-to-r from-green-900/70 to-green-800/70 px-10 py-4 rounded-2xl border-3 border-green-500">
                <div className="text-5xl font-bold text-green-300">
                  {participantes.length - mortos.length}
                </div>
                <div className="text-xl font-title text-green-200 uppercase tracking-widest">
                  Vivos
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900/70 to-red-800/70 px-10 py-4 rounded-2xl border-3 border-red-500">
                <div className="text-5xl font-bold text-red-300">
                  {mortos.length}
                </div>
                <div className="text-xl font-title text-red-200 uppercase tracking-widest">
                  Eliminados
                </div>
              </div>
            </div>
          </div>

          {/* GRID 2x2 COM CARTÕES GRANDES */}
          <div className="grid grid-cols-2 gap-8 px-8 max-w-7xl mx-auto">
            {participantes.map((p) => {
              const estaMorto = mortos.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl p-8 flex flex-col transition-all duration-500 shadow-2xl ${estaMorto ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-3 border-gray-600" : "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-3 border-magia-gold hover:scale-[1.02] hover:shadow-3xl hover:border-magia-gold/100"}`}
                >
                  {/* CABEÇALHO DO CARTÃO */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      {/* STATUS GRANDE E VISÍVEL */}
                      <div
                        className={`w-8 h-8 rounded-full ${estaMorto ? "bg-gray-600" : "bg-green-500 shadow-[0_0_20px_lime]"}`}
                      ></div>
                      <h3 className="text-4xl font-title text-magia-gold truncate font-bold">
                        {p.nome}
                      </h3>
                    </div>

                    {/* ARQUÉTIPO DESTACADO */}
                    <span
                      className={`text-lg font-title uppercase tracking-widest px-4 py-2 rounded-full ${estaMorto ? "bg-gray-700/50 text-gray-400" : p.arquetipo === "SACRIFÍCIO" ? "bg-red-900/50 text-red-300" : p.arquetipo === "JOGO SUJO" ? "bg-purple-900/50 text-purple-300" : "bg-blue-900/50 text-blue-300"}`}
                    >
                      {p.arquetipo}
                    </span>
                  </div>

                  {/* ESTRATÉGIA - TEXTO GRANDE E LEGÍVEL */}
                  <div className="flex-grow flex items-center mb-6">
                    <div className="bg-black/30 p-6 rounded-xl w-full">
                      <p className="text-2xl font-hand text-gray-200 leading-relaxed">
                        "{p.estrategia}"
                      </p>
                    </div>
                  </div>

                  {/* RODAPÉ COM INFORMAÇÕES ADICIONAIS */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xl ${estaMorto ? "text-gray-500" : "text-magia-gold"}`}
                      >
                        {estaMorto ? "💀" : "❤️"}
                      </span>
                      <span
                        className={`text-lg ${estaMorto ? "text-gray-400" : "text-green-300"}`}
                      >
                        {estaMorto ? "ELIMINADA" : "EM JOGO"}
                      </span>
                    </div>

                    <div className="text-sm text-gray-400 italic">
                      Carta #{p.id}
                    </div>
                  </div>

                  {/* OVERLAY DE ELIMINAÇÃO (VISÍVEL APENAS SE MORTO) */}
                  {estaMorto && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/70 backdrop-blur-[4px] rounded-2xl">
                      <div className="text-center transform -rotate-12">
                        <div className="text-9xl text-red-600/80 mb-4">💀</div>
                        <span className="border-6 border-red-700 text-red-500 font-title font-bold text-5xl px-8 py-4 rounded-2xl bg-black/90 shadow-2xl animate-stomp block">
                          ELIMINADA
                        </span>
                        <p className="text-2xl text-gray-300 mt-6 font-hand">
                          "O jogo não perdoa os incautos..."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* LEGENDA INFERIOR */}
          <div className="mt-10 text-center text-gray-400 text-lg">
            <p className="font-hand italic">
              "No Caraval, apenas os mais astutos sobrevivem..."
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================
    NOVA TELA: VEREDITOS DA MORTE - DRAMÁTICO!
================================================================== */}
      {view === "VEREDITOS" && (
        <div className="w-full h-full animate-fade-in z-10 flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-title text-magia-gold mb-12 uppercase tracking-widest drop-shadow-lg">
            A Lógica do Jogo
          </h2>

          <div className="grid grid-cols-2 gap-8 max-w-6xl w-full">
            {/* INGÊNUA */}
            <div className="bg-[#120818] border-2 border-red-900/50 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl">
                💀
              </div>
              <h3 className="text-2xl font-title text-magia-red uppercase">
                A Ingênua
              </h3>
              <p className="font-hand text-xl text-gray-300 leading-relaxed">
                "Se você se deixa levar pelas emoções, a magia te engole viva.
                Acreditar que 'tudo vai dar certo' em um jogo de ilusões é
                assinar sua própria sentença de morte."
              </p>
            </div>

            {/* DESCONFIANÇA */}
            <div className="bg-[#120818] border-2 border-red-900/50 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl">
                💀
              </div>
              <h3 className="text-2xl font-title text-magia-red uppercase">
                A Desconfiada
              </h3>
              <p className="font-hand text-xl text-gray-300 leading-relaxed">
                "Quem se isola se perde. Sem um aliado para te puxar de volta à
                realidade, a sua própria mente se torna a sua cela."
              </p>
            </div>

            {/* JOGO SUJO */}
            <div className="bg-[#120818] border-2 border-red-900/50 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl">
                💀
              </div>
              <h3 className="text-2xl font-title text-magia-red uppercase">
                Jogo Sujo
              </h3>
              <p className="font-hand text-xl text-gray-300 leading-relaxed">
                "Ninguém trapaceia o mestre das trapaças. Tentar manipular quem
                criou as regras é como tentar apagar um incêndio com gasolina."
              </p>
            </div>

            {/* SACRIFÍCIO (Vencedora) */}
            <div className="bg-[#1a0b2e] border-4 border-green-600 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden shadow-[0_0_30px_rgba(22,163,74,0.2)]">
              <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl">
                ❤️
              </div>
              <h3 className="text-2xl font-title text-green-400 uppercase">
                O Sacrifício (Vencedora)
              </h3>
              <p className="font-hand text-xl text-white leading-relaxed">
                "O Caraval exige um preço de sangue e alma. Você foi a única que
                entendeu que, para ganhar o jogo do Lenda, você precisa estar
                disposta a perder a si mesma."
              </p>
            </div>
          </div>
        </div>
      )}

      {view === "TRIBUNAL" && temaTribunal && (
        <div className="w-full max-w-6xl animate-fade-in flex flex-col items-center justify-center h-full z-10 p-4">
          <h2 className="text-6xl font-title text-magia-gold mb-16 drop-shadow-lg text-center">
            {temaTribunal === "JULIAN"
              ? "Julian: Parceiro ou Abusador?"
              : "Tella: Irmã Leal ou Narcisista?"}
          </h2>
          {(() => {
            const isJulian = temaTribunal === "JULIAN";

            // 1. CORREÇÃO MATEMÁTICA
            const total = participantes.length; // Precisamos saber o total
            const sideA = participantes.filter((p) =>
              isJulian
                ? p.vereditoJulian === "culpado"
                : p.perdaoTella === "sim",
            ).length;

            const sideB = total - sideA; // <--- Faltava calcular o outro lado!

            const pctA = (sideA / total) * 100;

            return (
              <div className="w-full h-40 bg-black rounded-full border-8 border-magia-gold/50 flex overflow-hidden shadow-2xl relative">
                {/* LADO A (Esquerda) */}
                <div
                  style={{ width: `${pctA}%` }}
                  className={`h-full flex items-center pl-10 font-title text-5xl text-white transition-all duration-[2s] whitespace-nowrap ${isJulian ? "bg-magia-red" : "bg-blue-600"}`}
                >
                  {isJulian ? `ABUSADOR (${sideA})` : `LEAL (${sideA})`}
                </div>

                {/* LADO B (Direita) */}
                <div
                  style={{ width: `${100 - pctA}%` }}
                  className={`h-full flex items-center justify-end pr-10 font-title text-5xl text-white transition-all duration-[2s] whitespace-nowrap ${isJulian ? "bg-indigo-900" : "bg-red-900"}`}
                >
                  {/* 2. CORREÇÃO VISUAL: Adicionei o (${sideB}) aqui embaixo */}
                  {isJulian ? `ROMÂNTICO (${sideB})` : `NARCISISTA (${sideB})`}
                </div>

                <div className="absolute inset-y-0 left-1/2 w-2 bg-white z-10 shadow-[0_0_20px_white] opacity-50"></div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ==================================================================
          FINAL - CORES AJUSTADAS
      ================================================================== */}
      {view === "FINAL" && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative z-10">
          <div className="absolute inset-0 pointer-events-none">
            {nuvemPalavras.map((item) => (
              <span
                key={item.id}
                className="absolute text-magia-gold/30 font-title font-bold animate-float"
                style={{
                  top: item.top,
                  left: item.left,
                  fontSize: item.size,
                  animationDelay: item.delay,
                }}
              >
                {item.texto}
              </span>
            ))}
          </div>
          <div className="z-20 text-center bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-20 rounded-3xl shadow-2xl border-8 border-magia-gold">
            <h2 className="text-5xl text-magia-gold font-title mb-6 uppercase tracking-widest">
              Nota do Encontro
            </h2>
            {(() => {
              const media = (
                participantes.reduce((acc, curr) => acc + curr.nota, 0) /
                participantes.length
              ).toFixed(1);
              return (
                <>
                  <div className="text-[12rem] font-title text-magia-paper leading-none mb-8 drop-shadow-lg">
                    {media}
                  </div>
                  <div className="flex gap-8 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-9xl transition-transform duration-300 ${star <= Math.round(media) ? "text-magia-gold hover:scale-125" : "text-gray-700"}`}
                      >
                        {star <= Math.round(media) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <p className="text-2xl text-gray-300 mt-10 font-hand italic">
                    "A magia está nas escolhas que fazemos..."
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
