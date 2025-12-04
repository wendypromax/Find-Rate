export const POSTS = [
  {
    id: 1,
    title: 'Introducción a React',
    author: 'Wendy Mora',
    date: '2025-10-01',
    excerpt: 'Aprende los fundamentos de React y crea tu primera app web.',
    content:
      'React es una biblioteca de JavaScript para construir interfaces de usuario. En este artículo exploraremos sus conceptos básicos...',
    category: 'Tutorial',
  },
  {
    id: 2,
    title: 'Rutas con React Router',
    author: 'Juan Pérez',
    date: '2025-10-05',
    excerpt: 'Aprende cómo manejar la navegación entre páginas en React.',
    content:
      'React Router es la herramienta estándar para manejar la navegación en aplicaciones React. En este artículo aprenderás cómo crear rutas...',
    category: 'Guía',
  },
  {
    id: 3,
    title: 'Estilos con Tailwind CSS',
    author: 'María López',
    date: '2025-10-08',
    excerpt: 'Descubre cómo estilizar tus componentes de React con Tailwind.',
    content:
      'Tailwind CSS te permite escribir estilos rápidos y consistentes directamente en tus componentes. Aquí te mostramos cómo integrarlo...',
    category: 'Tutorial',
  },
]

export function getPostById(id) {
  return POSTS.find((p) => p.id === parseInt(id))
}
