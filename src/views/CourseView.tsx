import React, { useState } from "react";
import { CourseModule } from "../types/miaucare";

interface CourseViewProps {
  completedModules: string[];
  onToggleModule: (moduleId: string) => void;
  onReturn: () => void;
}

const COURSE_MODULES: CourseModule[] = [
  {
    id: "mod-1",
    number: "Módulo 01",
    title: "Fundamentos do Cuidado Domiciliar e Ética",
    duration: "35 min",
    objective:
      "Compreender o papel do cuidador domiciliar, o respeito ao lar do tutor e a proteção de dados pessoais.",
    syllabus: [
      "Diferença entre hotel/creche e atendimento domiciliar na rotina do pet",
      "Sigilo de informações do imóvel, rotina familiar e dados cadastrais",
      "Comunicação transparente antes, durante e após cada visita",
      "Registro objetivo de horários, alimentação e ocorrências",
    ],
    practicalChecklist: [
      "Confirmar horário, endereço e regras de acesso antes da visita",
      "Evitar exposição de dados pessoais ou imagens não autorizadas",
      "Enviar resumo claro ao tutor ao final do atendimento",
    ],
    assessmentQuestion:
      "Qual é a conduta mais adequada ao encerrar uma visita domiciliar?",
    options: [
      "Enviar um registro objetivo sobre alimentação, higiene e comportamento do pet",
      "Compartilhar fotos internas da casa em redes sociais abertas",
      "Alterar a dieta do animal sem orientação prévia do tutor",
    ],
    correctIndex: 0,
  },
  {
    id: "mod-2",
    number: "Módulo 02",
    title: "Segurança Ambiental e Prevenção de Fugas",
    duration: "40 min",
    objective:
      "Identificar riscos físicos no ambiente doméstico e prevenir acidentes ou fugas.",
    syllabus: [
      "Conferência de portas, portões, janelas e telas de proteção",
      "Armazenamento seguro de produtos de limpeza, medicamentos e fios elétricos",
      "Plantas tóxicas e objetos pequenos que podem ser ingeridos",
      "Protocolo imediato em caso de porta aberta ou comportamento atípico",
    ],
    practicalChecklist: [
      "Checar aberturas antes de destrancar ou abrir qualquer acesso",
      "Manter produtos químicos e lixo fora do alcance dos animais",
      "Conferir o ambiente inteiro antes de ir embora",
    ],
    assessmentQuestion:
      "O que deve ser verificado antes de abrir a porta de entrada de um imóvel com pets?",
    options: [
      "Apenas o volume da televisão",
      "Se o animal está em área segura e portas/janelas internas estão fechadas",
      "Se a caixa de correio está vazia",
    ],
    correctIndex: 1,
  },
  {
    id: "mod-3",
    number: "Módulo 03",
    title: "Protocolo para Gatos (Felinos)",
    duration: "45 min",
    objective:
      "Atender às necessidades territoriais, sensoriais e de higiene dos gatos com baixo estresse.",
    syllabus: [
      "Linguagem corporal felina, sinais de estresse e respeito ao espaço do gato",
      "Limpeza da caixa de areia, distribuição de caixas e troca de água fresca",
      "Alimentação regrada, sachês e enriquecimento ambiental seguro",
      "Atenção a sinais de alerta urinário, digestivo ou apatia",
    ],
    practicalChecklist: [
      "Higienizar a caixa de areia e trocar água por água limpa e fresca",
      "Respeitar o tempo de aproximação de gatos tímidos ou ariscos",
      "Observar apetite, uso da caixa e disposição geral",
    ],
    assessmentQuestion:
      "Como agir diante de um gato que se esconde e demonstra receio na chegada?",
    options: [
      "Forçar o contato físico pegando-o no colo imediatamente",
      "Respeitar o espaço do gato, falar em tom calmo e focar nos cuidados essenciais",
      "Ignorar completamente a alimentação e a água",
    ],
    correctIndex: 1,
  },
  {
    id: "mod-4",
    number: "Módulo 04",
    title: "Protocolo para Cães (Caninos)",
    duration: "45 min",
    objective:
      "Conduzir rotinas caninas com segurança, controle e atenção ao bem-estar físico e emocional.",
    syllabus: [
      "Leitura de sinais de calma, excitação, medo ou desconforto em cães",
      "Regras de passeio seguro, coleira, guia e prevenção de conflitos na rua",
      "Higienização de potes, rotina de refeições e descanso pós-alimentação",
      "Identificação de sinais de calor excessivo, dor ou cansaço",
    ],
    practicalChecklist: [
      "Conferir guia, coleira/peitoral e fechamento de portões",
      "Evitar exercícios intensos logo após refeições",
      "Limpar patas e conferir água ao retornar para casa",
    ],
    assessmentQuestion:
      "Qual cuidado é fundamental antes e durante um passeio com cães?",
    options: [
      "Conferir ajuste da guia/coleira e evitar horários de sol forte no asfalto",
      "Soltar a guia em áreas abertas não cercadas",
      "Oferecer grandes quantidades de comida logo antes de correr",
    ],
    correctIndex: 0,
  },
  {
    id: "mod-5",
    number: "Módulo 05",
    title: "Aves, Coelhos e Roedores",
    duration: "40 min",
    objective:
      "Aplicar cuidados específicos para aves domésticas, coelhos e roedores de estimação.",
    syllabus: [
      "Aves: higiene de poleiros e bandejas, água limpa, sementes/ração e prevenção de correntes de ar",
      "Coelhos: oferta de feno, ração específica, água fresca, espaço seguro e manejo delicado",
      "Roedores: limpeza adequada do substrato, ventilação sem correntes de ar e segurança da gaiola",
      "Sinais de estresse térmico, alterações respiratórias ou queda de consumo",
    ],
    practicalChecklist: [
      "Manter gaiolas e recintos livres de correntes de ar e exposição direta ao sol forte",
      "Repor feno, água e alimentação conforme instrução do tutor",
      "Manusear apenas quando autorizado e com técnica segura",
    ],
    assessmentQuestion:
      "Qual é um cuidado essencial para aves, coelhos e roedores no ambiente doméstico?",
    options: [
      "Proteger contra correntes de ar, calor excessivo e manter água e alimento adequados",
      "Deixar a gaiola próxima a produtos de limpeza abertos",
      "Substituir o feno e a dieta específica sem consultar o tutor",
    ],
    correctIndex: 0,
  },
  {
    id: "mod-6",
    number: "Módulo 06",
    title: "Cuidados Básicos com Peixes e Aquários",
    duration: "30 min",
    objective:
      "Executar rotinas seguras de alimentação e observação de aquários ornamentais.",
    syllabus: [
      "Controle rigoroso da quantidade de ração para evitar sobras e alteração da água",
      "Observação visual do comportamento dos peixes e funcionamento de filtros/iluminação",
      "O que não fazer sem autorização expressa (trocas bruscas de água ou produtos químicos)",
      "Comunicação imediata ao tutor em caso de falha elétrica ou alteração incomum",
    ],
    practicalChecklist: [
      "Oferecer apenas a porção combinada de ração",
      "Verificar se o filtro e a iluminação estão operando normalmente",
      "Avisar o tutor caso note água turva, falta de energia ou peixes apáticos",
    ],
    assessmentQuestion:
      "Por que é importante controlar bem a quantidade de ração oferecida aos peixes?",
    options: [
      "Porque o excesso de alimento suja a água e prejudica a qualidade do ambiente",
      "Porque os peixes não precisam de rotina regular",
      "Para acelerar o crescimento das algas no vidro",
    ],
    correctIndex: 0,
  },
  {
    id: "mod-7",
    number: "Módulo 07",
    title: "Intercorrências, Primeiros Cuidados e Encaminhamento Veterinário",
    duration: "40 min",
    objective:
      "Reconhecer sinais de alerta e acionar o tutor e o veterinário de referência com agilidade.",
    syllabus: [
      "Sinais de alerta: vômitos repetidos, diarreia intensa, dificuldade respiratória, sangramento ou prostração",
      "Como acionar o tutor, clínica veterinária de referência e contatos de emergência",
      "Registro cronológico do ocorrido para apoiar o atendimento veterinário",
      "Limites da atuação do cuidador: nunca prescrever ou medicar sem orientação expressa",
    ],
    practicalChecklist: [
      "Ter em mãos o contato do tutor e da clínica veterinária indicada",
      "Comunicar imediatamente qualquer sintoma ou acidente",
      "Anotar horário e detalhes observados com precisão",
    ],
    assessmentQuestion:
      "Diante de um sinal clínico preocupante no pet durante a visita, qual deve ser a primeira ação?",
    options: [
      "Medicar o animal por conta própria sem orientação",
      "Comunicar o tutor imediatamente e acionar a clínica veterinária de referência conforme combinado",
      "Esperar vários dias antes de avisar o tutor",
    ],
    correctIndex: 1,
  },
];

export const CourseView: React.FC<CourseViewProps> = ({
  completedModules,
  onToggleModule,
  onReturn,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const currentModule = COURSE_MODULES[selectedIndex];
  const isCompleted = completedModules.includes(currentModule.id);

  const handleSelectModule = (index: number) => {
    setSelectedIndex(index);
    setSelectedAnswer(null);
    setQuizFeedback(null);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      setQuizFeedback("Selecione uma alternativa antes de confirmar a resposta.");
      return;
    }
    if (selectedAnswer === currentModule.correctIndex) {
      setQuizFeedback(
        "Resposta correta! Você pode marcar este módulo como concluído e avançar."
      );
      if (!isCompleted) {
        onToggleModule(currentModule.id);
      }
    } else {
      setQuizFeedback(
        "Alternativa incorreta. Revise o conteúdo programático do módulo e tente novamente."
      );
    }
  };

  const handleAdvance = () => {
    if (selectedIndex < COURSE_MODULES.length - 1) {
      handleSelectModule(selectedIndex + 1);
    } else {
      onReturn();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Curso MiauCare · Conteúdo Programático
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Progresso concluído: {completedModules.length} de{" "}
            {COURSE_MODULES.length} módulos.
          </p>
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Retornar
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="space-y-2 lg:col-span-4">
          {COURSE_MODULES.map((mod, idx) => {
            const done = completedModules.includes(mod.id);
            const active = idx === selectedIndex;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => handleSelectModule(idx)}
                className={`w-full rounded-xl border p-3.5 text-left transition ${
                  active
                    ? "border-purple-900 bg-purple-800 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span>
                    {mod.number} · {mod.duration}
                  </span>
                  <span>{done ? "Concluído" : "Pendente"}</span>
                </div>
                <div className="mt-1 text-sm font-bold">{mod.title}</div>
              </button>
            );
          })}
        </aside>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8 sm:p-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wide text-purple-800">
              {currentModule.number} · {currentModule.duration}
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              {currentModule.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {currentModule.objective}
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Conteúdo Programático Detalhado
            </h3>
            <ul className="mt-2.5 space-y-2 text-sm text-slate-700">
              {currentModule.syllabus.map((topic, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-purple-800">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-bold text-slate-900">
              Checklist Prático do Módulo
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {currentModule.practicalChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-purple-800">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Verificação de Aprendizagem
            </h3>
            <p className="mt-1.5 text-sm font-medium text-slate-800">
              {currentModule.assessmentQuestion}
            </p>

            <div className="mt-3 space-y-2">
              {currentModule.options.map((opt, optIdx) => (
                <label
                  key={optIdx}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 hover:border-purple-400"
                >
                  <input
                    type="radio"
                    name={`quiz-${currentModule.id}`}
                    checked={selectedAnswer === optIdx}
                    onChange={() => setSelectedAnswer(optIdx)}
                    className="mt-0.5"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {quizFeedback && (
              <div
                role="status"
                className="mt-3 rounded-lg border border-purple-300 bg-white px-3.5 py-2.5 text-sm font-medium text-purple-950"
              >
                {quizFeedback}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="rounded-lg border border-purple-900 bg-purple-800 px-4 py-2 text-sm font-bold text-white hover:bg-purple-900"
              >
                Confirmar Resposta
              </button>

              <button
                type="button"
                onClick={() => onToggleModule(currentModule.id)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                {isCompleted ? "Marcar como Pendente" : "Marcar como Concluído"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onReturn}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Retornar
            </button>

            <button
              type="button"
              onClick={handleAdvance}
              className="rounded-lg border border-purple-900 bg-purple-800 px-5 py-2 text-sm font-bold text-white hover:bg-purple-900"
            >
              {selectedIndex < COURSE_MODULES.length - 1
                ? "Avançar para Próximo Módulo"
                : "Concluir e Retornar"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};