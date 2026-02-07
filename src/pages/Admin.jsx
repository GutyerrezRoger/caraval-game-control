import React, { useState, useEffect, useRef } from "react";
import { participantes } from "../data/participants";
import { timelineData } from "../data/timeline";

export default function Admin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ultimaAcao, setUltimaAcao] = useState("");
  const [ultimoAlvo, setUltimoAlvo] = useState("");
  const [feedback, setFeedback] = useState({
    show: false,
    message: "",
    type: "",
  });
  const channelRef = useRef(null);

  // Inicializa o BroadcastChannel uma vez
  useEffect(() => {
    channelRef.current = new BroadcastChannel("caraval_game");

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  const enviar = (acao, dados = {}) => {
    if (!channelRef.current) return;

    channelRef.current.postMessage({ type: acao, payload: dados });

    // Mostrar feedback visual
    let mensagem = "";
    let tipo = "info";

    switch (acao) {
      case "CLUB_INTRO":
        mensagem = "Introdução do Clube ativada";
        break;
      case "INTRO":
        mensagem = "Capa do Caraval ativada";
        break;
      case "JOGO_CARTAS":
        mensagem = "Tela de Desejos ativada";
        break;
      case "JOGO_SOBREVIVENCIA":
        mensagem = "Tela de Sobrevivência ativada";
        break;
      case "JOGO_TIMELINE":
        mensagem = "Timeline ativada";
        break;
      case "JOGO_TRIBUNAL":
        mensagem = `Tribunal de ${dados.tema} ativado`;
        break;
      case "JOGO_VEREDITOS":
        mensagem = "Tela de Vereditos ativada";
        tipo = "veredito";
        break;
      case "JOGO_FINAL":
        mensagem = "Tela Final ativada";
        break;
      case "REVELAR_CARTA":
        const pessoa = participantes.find((p) => p.id === dados.id);
        mensagem = `Carta revelada: ${pessoa?.nome || "Desconhecido"}`;
        tipo = "card";
        setUltimoAlvo(pessoa?.nome || "");
        break;
      case "MATAR":
        const alvo = participantes.find((p) => p.id === dados.id);
        mensagem = `${alvo?.nome || "Desconhecido"} foi eliminado`;
        tipo = alvo?.arquetipo === "SACRIFÍCIO" ? "survive" : "death";
        setUltimoAlvo(alvo?.nome || "");
        break;
      case "RESET":
        mensagem = "Jogo reiniciado";
        tipo = "reset";
        break;
      default:
        mensagem = `Ação: ${acao}`;
    }

    setUltimaAcao(acao);
    setFeedback({ show: true, message: mensagem, type: tipo });

    // Esconder feedback após 3 segundos
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const navegarTimeline = (direcao) => {
    let nextStep = currentStep + direcao;
    if (nextStep < 0) nextStep = 0;
    if (nextStep >= timelineData.length) nextStep = timelineData.length - 1;
    setCurrentStep(nextStep);
    enviar("JOGO_TIMELINE", { step: nextStep });
  };

  // Função para revelar carta com animação de feedback
  const revelarCartaComFeedback = (id, nome) => {
    setUltimoAlvo(nome);
    enviar("REVELAR_CARTA", { id });
  };

  // Função para eliminar jogador com feedback
  const eliminarJogador = (id, nome, arquetipo) => {
    setUltimoAlvo(nome);
    enviar("MATAR", { id });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans overflow-y-auto">
      <div className="p-6 pb-24 max-w-7xl mx-auto">
        {/* CABEÇALHO MELHORADO */}
        <header className="mb-8 border-b-4 border-red-600 pb-6 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl sticky top-0 z-50 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="text-4xl">🎩</div>
            <div>
              <h1 className="text-3xl font-bold text-red-400">MESTRE LENDA</h1>
              <p className="text-gray-400 text-sm">
                Painel de Controle do Caraval
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => enviar("RESET")}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl text-white font-bold text-base border-2 border-gray-500 hover:border-red-500 transition-all flex items-center gap-2"
            >
              <span className="text-xl">🔄</span>
              REINICIAR JOGO
            </button>

            {/* FEEDBACK DA ÚLTIMA AÇÃO */}
            {feedback.show && (
              <div
                className={`px-4 py-2 rounded-lg border-l-4 ${feedback.type === "death" ? "bg-red-900/30 border-red-500" : feedback.type === "survive" ? "bg-green-900/30 border-green-500" : feedback.type === "card" ? "bg-yellow-900/30 border-yellow-500" : feedback.type === "veredito" ? "bg-purple-900/30 border-purple-500" : feedback.type === "reset" ? "bg-purple-900/30 border-purple-500" : "bg-blue-900/30 border-blue-500"} animate-pulse`}
              >
                <span className="text-sm font-medium">{feedback.message}</span>
              </div>
            )}
          </div>
        </header>

        {/* NAVEGAÇÃO PRINCIPAL - BOTÕES MAIORES (AGORA 9 BOTÕES) */}
        <section className="mb-10 bg-gray-800/50 p-6 rounded-2xl border-2 border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Navegação Principal
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            <button
              onClick={() => enviar("CLUB_INTRO")}
              className="p-4 bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-600 hover:to-pink-700 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">1️⃣</div>
              <div className="text-xs sm:text-sm">Intro Clube</div>
            </button>

            <button
              onClick={() => enviar("INTRO")}
              className="p-4 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">2️⃣</div>
              <div className="text-xs sm:text-sm">Capa</div>
            </button>

            <button
              onClick={() => enviar("JOGO_CARTAS")}
              className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">3️⃣</div>
              <div className="text-xs sm:text-sm">Desejos</div>
            </button>

            <button
              onClick={() => navegarTimeline(0)}
              className="p-4 bg-gradient-to-r from-indigo-800 to-indigo-900 hover:from-indigo-700 hover:to-indigo-800 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">4️⃣</div>
              <div className="text-xs sm:text-sm">Timeline</div>
            </button>

            <button
              onClick={() => enviar("JOGO_TRIBUNAL", { tema: "JULIAN" })}
              className="p-4 bg-gradient-to-r from-teal-800 to-teal-900 hover:from-teal-700 hover:to-teal-800 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">5️⃣</div>
              <div className="text-xs sm:text-sm">Julian</div>
            </button>

            <button
              onClick={() => enviar("JOGO_TRIBUNAL", { tema: "TELLA" })}
              className="p-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">6️⃣</div>
              <div className="text-xs sm:text-sm">Tella</div>
            </button>

            <button
              onClick={() => enviar("JOGO_SOBREVIVENCIA")}
              className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">7️⃣</div>
              <div className="text-xs sm:text-sm">Sobrevivência</div>
            </button>

            <button
              onClick={() => enviar("JOGO_VEREDITOS")}
              className="p-4 bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">8️⃣</div>
              <div className="text-xs sm:text-sm">Vereditos</div>
            </button>

            <button
              onClick={() => enviar("JOGO_FINAL")}
              className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-lg mb-1">9️⃣</div>
              <div className="text-xs sm:text-sm">Final</div>
            </button>
          </div>
        </section>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* REVELAR CARTAS - MELHORADO */}
          <section className="bg-gray-800/70 p-6 rounded-2xl border-l-4 border-yellow-500 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-yellow-300 flex items-center gap-2">
                <span className="text-2xl">🃏</span>
                Revelar Desejos
              </h2>
              <div className="text-sm text-gray-400">
                {ultimaAcao === "REVELAR_CARTA" && (
                  <span className="text-yellow-300 animate-pulse">
                    Última: {ultimoAlvo}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {participantes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => revelarCartaComFeedback(p.id, p.nome)}
                  className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl text-left hover:from-yellow-900 hover:to-yellow-800 transition-all duration-300 group hover:scale-[1.02] shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-yellow-400 text-base group-hover:text-yellow-300">
                      {p.nome}
                    </span>
                    <span className="text-xs bg-gray-900/50 px-2 py-1 rounded text-gray-300">
                      #{p.id}
                    </span>
                  </div>
                  <p className="italic text-sm text-gray-300 line-clamp-2 group-hover:text-gray-200">
                    "{p.desejo}"
                  </p>
                  <div className="mt-2 text-xs text-gray-500 group-hover:text-gray-400">
                    Clique para revelar na TV
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 text-center">
                💡 Dica: As cartas na TV mostram símbolos genéricos. Apenas você
                sabe quem é quem!
              </p>
            </div>
          </section>

          {/* TIMELINE - MELHORADA */}
          <section className="bg-gray-800/70 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-xl">
            <h2 className="text-2xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              Timeline - Navegação
            </h2>

            <div className="mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-indigo-300">
                  Capítulo {currentStep + 1} de {timelineData.length}
                </span>
                <span className="text-sm text-gray-400">
                  {timelineData[currentStep].titulo}
                </span>
              </div>

              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500"
                  style={{
                    width: `${((currentStep + 1) / timelineData.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={() => navegarTimeline(-1)}
                disabled={currentStep === 0}
                className={`flex-1 p-4 rounded-xl font-bold text-lg transition-all ${currentStep === 0 ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 hover:scale-105"}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">⬅️</span>
                  <span>Capítulo Anterior</span>
                </div>
              </button>

              <button
                onClick={() => navegarTimeline(1)}
                disabled={currentStep === timelineData.length - 1}
                className={`flex-1 p-4 rounded-xl font-bold text-lg transition-all ${currentStep === timelineData.length - 1 ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 hover:scale-105"}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span>Próximo Capítulo</span>
                  <span className="text-2xl">➡️</span>
                </div>
              </button>
            </div>

            <div className="bg-black/30 p-5 rounded-xl border border-indigo-500/30">
              <h3 className="font-bold text-lg mb-2 text-gray-300">
                Pergunta Atual:
              </h3>
              <p className="italic text-gray-200 leading-relaxed">
                "{timelineData[currentStep].pergunta}"
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>
                📖 Use os botões para navegar entre os capítulos da história
              </p>
            </div>
          </section>

          {/* ZONA DE MORTE - ATUALIZADA PARA 3 SOBREVIVENTES */}
          <section className="bg-gray-800/70 p-6 rounded-2xl border-l-4 border-red-500 shadow-xl lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-300 flex items-center gap-2">
                <span className="text-2xl">☠️</span>
                Zona de Morte - Controle de Sobrevivência
              </h2>
              <div className="text-sm">
                {ultimaAcao === "MATAR" && (
                  <span
                    className={`px-3 py-1 rounded-full ${ultimoAlvo && participantes.find((p) => p.nome === ultimoAlvo)?.arquetipo === "SACRIFÍCIO" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
                  >
                    Último: {ultimoAlvo}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700">
                <div className="text-4xl text-center mb-2">👥</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {participantes.length}
                  </div>
                  <div className="text-gray-400">Total de Jogadores</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 p-4 rounded-xl border border-green-700/50">
                <div className="text-4xl text-center mb-2">❤️</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">
                    {
                      participantes.filter((p) => p.arquetipo === "SACRIFÍCIO")
                        .length
                    }
                  </div>
                  <div className="text-gray-400">
                    Sobreviventes (Sacrifício)
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 p-4 rounded-xl border border-red-700/50">
                <div className="text-4xl text-center mb-2">💀</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-300">
                    {participantes.length -
                      participantes.filter((p) => p.arquetipo === "SACRIFÍCIO")
                        .length}
                  </div>
                  <div className="text-gray-400">Possíveis Eliminados</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-4 rounded-xl border border-purple-700/50">
                <div className="text-4xl text-center mb-2">🎭</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">
                    {
                      participantes.filter((p) => p.tipoMorte === "ingênua")
                        .length
                    }
                  </div>
                  <div className="text-gray-400">Ingênuas</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {participantes.map((p) => {
                // ATUALIZADO: Agora 3 pessoas sobrevivem (SACRIFÍCIO)
                const sobrevive = p.arquetipo === "SACRIFÍCIO";

                return (
                  <button
                    key={p.id}
                    onClick={() => eliminarJogador(p.id, p.nome, p.arquetipo)}
                    className={`p-4 rounded-xl flex flex-col transition-all duration-300 relative group border-2 ${sobrevive ? "border-green-500/50 bg-gradient-to-b from-green-900/20 to-green-800/20 hover:from-green-800/30 hover:to-green-700/30 hover:border-green-400" : "border-red-500/30 bg-gradient-to-b from-gray-800 to-gray-900 hover:from-red-900/30 hover:to-red-800/30 hover:border-red-500"}`}
                  >
                    <div className="flex justify-between items-center w-full mb-2">
                      <span className="font-bold text-base truncate">
                        {p.nome}
                      </span>
                      <span
                        className={`text-xl ${sobrevive ? "text-green-400" : "text-gray-400 group-hover:text-red-400"}`}
                      >
                        {sobrevive ? "❤️" : "🔪"}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <span
                        className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${sobrevive ? "bg-green-900/50 text-green-300" : p.tipoMorte === "ingênua" ? "bg-pink-900/50 text-pink-300" : p.tipoMorte === "desconfiada" ? "bg-blue-900/50 text-blue-300" : "bg-purple-900/50 text-purple-300"}`}
                      >
                        {p.arquetipo}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <span className="text-sm font-bold text-center p-2">
                        {sobrevive
                          ? "SOBREVIVE (Sacrifício)"
                          : `Tipo: ${p.tipoMorte?.toUpperCase() || "ELIMINÁVEL"}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Sobrevive (Arquétipo Sacrifício - 3 pessoas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span>Ingênua (7 pessoas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Desconfiada (5 pessoas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Jogo Sujo (3 pessoas)</span>
                </div>
              </div>
              <div className="mt-4 text-center text-yellow-300 text-sm">
                💡 Clique no botão "8. Vereditos" para ver as explicações
                dramáticas de cada eliminação!
              </div>
            </div>
          </section>
        </main>

        {/* RODAPÉ COM INFORMAÇÕES */}
        <footer className="mt-10 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-500 text-sm">
            <p>🎩 Painel do Mestre Lenda - Caraval Game Control v2.1</p>
            <p className="mt-1">
              17 participantes | 3 sobreviventes (Sacrifício) | Sistema de
              vereditos dramáticos
            </p>
            <p className="mt-1">
              Todas as alterações são enviadas em tempo real para a tela da TV
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
