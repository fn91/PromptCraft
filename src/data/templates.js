// src/data/templates.js
export const promptTemplates = [
  {
    id: 'tpl-dev',
    name: "💻 Programador Senior",
    blocks: [
      { type: "role", content: "Actúa como un experto en arquitectura de software y Clean Code." },
      { type: "instruction", content: "Analiza el siguiente fragmento de código buscando posibles bugs de concurrencia." }
    ]
  },
  {
    id: 'tpl-copy',
    name: "✍️ Redactor SEO",
    blocks: [
      { type: "role", content: "Eres un redactor experto en SEO y Copywriting persuasivo." },
      { type: "context", content: "El público objetivo son dueños de pequeñas empresas tecnológicas." },
      { type: "instruction", content: "Escribe 3 títulos magnéticos para un artículo de blog sobre IA." }
    ]
  }
];