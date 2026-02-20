
/**
 * Utilitário de Normalização de Temas (Infraestrutura APEX v2.0)
 * Resolve caminhos de assets seguindo a convenção estrita de nomenclatura.
 */
export const resolveThemeFolder = (themeId: string): string => {
  if (!themeId) return "default_gif";

  // Normalização simplificada: ID do tema + sufixo _gif
  // Isso combina com os IDs do AppTheme: 'siamese', 'persian', 'binary-night', etc.
  return `${themeId}_gif`;
};
