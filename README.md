# MiauCare — Projeto Final de Interface Homem-Máquina (UNIUBE)

Disciplina: Interface Homem-Máquina — Prof. Dr. Eduardo Chagas de Oliveira.

## Estrutura de Arquivos e Pastas
- `src/types/miaucare.ts` — Contratos e tipos TypeScript do domínio.
- `src/utils/security.ts` — Sanitização de texto, validação de e-mail, verificação segura de mídia e mascaramento de contato (LGPD).
- `src/utils/moderation.ts` — Filtro textual de conduta e moderação de arquivos de imagem/mídia.
- `src/utils/species.ts` — Normalização de espécies (`Cão`, `Gato`, `Ave`, `Coelho`, `Roedor`, `Peixe`), ícones e checklists padrão.
- `src/components/BrandLogo.tsx` — Componente reservado para preservar a logo e tipografia originais da marca MiauCare.
- `src/components/CourseScrollBanner.tsx` — Banner inline e flutuante na rolagem para o curso Pet Sitter.
- `src/components/AuthModal.tsx` — Autenticação e cadastro exclusivos por e-mail e senha.
- `src/views/HomeView.tsx` — Página inicial pública (visitantes) com classificados e pilares de segurança/LGPD.
- `src/views/LoggedHomeView.tsx` — Página inicial do usuário autenticado.
- `src/views/WorkspaceView.tsx` — Painel de atendimentos, checklist por espécie, ficha diária imprimível e chat moderado.
- `src/views/MyPetsView.tsx` — Cadastro e gestão de pets com cuidados especiais.
- `src/views/ChatView.tsx` — Mensagens entre usuários com moderação de conteúdo.
- `src/views/CourseView.tsx` — Módulos do curso (40h), avaliação final (mínimo 80%) e certificado imprimível.
- `src/views/ProfileView.tsx` — Configurações de perfil, foto e privacidade/LGPD.

## Requisitos de IHM Atendidos na Interface
- **Interação nos Componentes:** Botões, filtros, abas (`Checklist` / `Chat`), modais e controles de acessibilidade com ações previsíveis.
- **Navegação das Telas:** Separação clara entre visão pública e área logada, proteção de rotas privadas e retornos consistentes (`← Voltar`).
- **Feedback Visual:** Alertas/notificações (`role="status"`), validações em formulários, bloqueio moderado de mensagens/arquivos e progresso de módulos/checklist.
- **Consistência Visual:** Paleta roxo/índigo sobre superfícies neutras, cartões padronizados e componente unificado `BrandLogo`.
- **Usabilidade e Clareza:** Rótulos diretos, fluxos sem dependência de explicações externas e controles de acessibilidade (contraste, escala de fonte e leitura em voz alta).
- **Design Responsivo:** Grades e barras adaptáveis em `sm`, `md` e `lg`, além de regras `@media print` para ficha diária e certificado.
