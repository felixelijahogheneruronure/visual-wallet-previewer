
import { useMemo } from 'react';

export type Language = 'en' | 'pt' | 'es';

const translations = {
  en: {
    app_title: 'Visual Wallet Previewer',
    app_subtitle: 'Create beautiful wallet previews with multi-language support',
    form_title: 'Wallet Information',
    wallet_title: 'Digital Wallet',
    secure_transaction: 'Secure Transaction',
    name_label: '👤 Full Name',
    name_placeholder: 'Enter full name',
    balance_label: '💰 Balance',
    balance_placeholder: 'Enter balance amount',
    bank_label: '🏦 Bank',
    bank_placeholder: 'Enter bank name',
    pix_label: '🔑 PIX Key',
    pix_placeholder: 'Enter PIX key',
    status_label: '📊 Status',
    loading_label: '⏳ Transaction Progress',
    transaction_label: '⚠️ Transaction Pending',
    update_btn: '🔄 Update Preview',
    download_png: 'Download PNG',
    download_gif: 'Export GIF',
    download_mp4: 'Export MP4',
    update_success: 'Preview updated successfully!',
    export_success: 'Image exported successfully!',
    export_error: 'Failed to export image',
    gif_export_info: 'GIF export coming soon!',
    mp4_export_info: 'MP4 export coming soon!',
  },
  pt: {
    app_title: 'Previsualizador de Carteira Visual',
    app_subtitle: 'Crie belas visualizações de carteira com suporte multi-idioma',
    form_title: 'Informações da Carteira',
    wallet_title: 'Carteira Digital',
    secure_transaction: 'Transação Segura',
    name_label: '👤 Nome Completo',
    name_placeholder: 'Digite o nome completo',
    balance_label: '💰 Saldo',
    balance_placeholder: 'Digite o valor do saldo',
    bank_label: '🏦 Banco',
    bank_placeholder: 'Digite o nome do banco',
    pix_label: '🔑 Chave PIX',
    pix_placeholder: 'Digite a chave PIX',
    status_label: '📊 Status',
    loading_label: '⏳ Progresso da Transação',
    transaction_label: '⚠️ Transação Pendente',
    update_btn: '🔄 Atualizar Visualização',
    download_png: 'Baixar PNG',
    download_gif: 'Exportar GIF',
    download_mp4: 'Exportar MP4',
    update_success: 'Visualização atualizada com sucesso!',
    export_success: 'Imagem exportada com sucesso!',
    export_error: 'Falha ao exportar imagem',
    gif_export_info: 'Exportação GIF em breve!',
    mp4_export_info: 'Exportação MP4 em breve!',
  },
  es: {
    app_title: 'Previsualizador de Billetera Visual',
    app_subtitle: 'Crea hermosas vistas previas de billetera con soporte multiidioma',
    form_title: 'Información de la Billetera',
    wallet_title: 'Billetera Digital',
    secure_transaction: 'Transacción Segura',
    name_label: '👤 Nombre Completo',
    name_placeholder: 'Ingrese nombre completo',
    balance_label: '💰 Saldo',
    balance_placeholder: 'Ingrese monto del saldo',
    bank_label: '🏦 Banco',
    bank_placeholder: 'Ingrese nombre del banco',
    pix_label: '🔑 Clave PIX',
    pix_placeholder: 'Ingrese clave PIX',
    status_label: '📊 Estado',
    loading_label: '⏳ Progreso de Transacción',
    transaction_label: '⚠️ Transacción Pendiente',
    update_btn: '🔄 Actualizar Vista Previa',
    download_png: 'Descargar PNG',
    download_gif: 'Exportar GIF',
    download_mp4: 'Exportar MP4',
    update_success: '¡Vista previa actualizada con éxito!',
    export_success: '¡Imagen exportada con éxito!',
    export_error: 'Error al exportar imagen',
    gif_export_info: '¡Exportación GIF próximamente!',
    mp4_export_info: '¡Exportación MP4 próximamente!',
  },
};

export const useTranslations = (language: Language) => {
  const t = useMemo(() => {
    return (key: string): string => {
      return translations[language][key as keyof typeof translations[Language]] || key;
    };
  }, [language]);

  return { t };
};
