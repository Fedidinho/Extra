# Almeida & Vasconcelos — Template Premium de Advocacia

Template institucional one-page desenvolvido em HTML, CSS e JavaScript puro para servir como peça de portfólio e base reutilizável para sites profissionais.

> **Importante:** todo o escritório, profissionais, números, contatos e textos deste projeto são fictícios e servem apenas para demonstração visual. Antes de usar comercialmente, substitua os dados e revise a comunicação conforme as regras de publicidade da OAB aplicáveis ao cliente.

## Recursos

- Layout premium e totalmente responsivo
- Header fixo com navegação desktop e mobile
- Hero de alto impacto
- Seções de escritório, áreas de atuação, processo, diferenciais, equipe, conteúdos, FAQ e contato
- Animações com `IntersectionObserver`
- Contador animado
- FAQ interativo
- Formulário demonstrativo com validação nativa
- Botão de WhatsApp
- SEO básico, Open Graph, Twitter Card e Schema.org
- `robots.txt`, `sitemap.xml` e manifest
- Acessibilidade básica: skip link, estados de foco, labels, atributos ARIA e suporte a `prefers-reduced-motion`
- Sem frameworks e sem dependências de JavaScript

## Estrutura

```text
.
├── index.html
├── style.css
├── script.js
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
└── assets/
    ├── logo.svg
    └── favicon.svg
```

## Rodando localmente

Você pode abrir `index.html` diretamente no navegador ou usar qualquer servidor estático, por exemplo a extensão Live Server do VS Code.

## Personalização rápida

1. Troque o nome e os contatos no `index.html`.
2. Substitua as imagens remotas pelas imagens do cliente.
3. Ajuste as cores no bloco `:root` do `style.css`.
4. Atualize `og:url`, Schema.org, `robots.txt` e `sitemap.xml` com o domínio final.
5. Integre o formulário a um backend, CRM, e-mail ou serviço de formulários.
6. Atualize o link do WhatsApp com o número real.

## Publicação

O projeto é estático e pode ser hospedado gratuitamente ou com custo baixo em GitHub Pages, Netlify, Cloudflare Pages, Vercel ou hospedagem tradicional.

O repositório está preparado para publicação pelo GitHub Pages usando a branch `main` e a pasta `/(root)`.

## Observações de produção

- As imagens atuais são carregadas do Unsplash e devem ser substituídas por fotos licenciadas e próprias do cliente quando o projeto for usado comercialmente.
- Não deixe `example.com`, telefone fictício ou endereço fictício em produção.
- Revise a política de privacidade e a implementação de LGPD conforme a coleta real de dados.
- Para escritórios de advocacia, valide textos, CTAs, provas sociais e demais elementos com as regras éticas e de publicidade profissional vigentes.
