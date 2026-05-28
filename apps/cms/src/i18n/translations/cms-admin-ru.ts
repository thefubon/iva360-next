/**
 * Дополнения к русской локали админки Payload CMS.
 * Объединяет переводы плагинов и переопределяет оставшиеся английские строки ядра.
 */
export const cmsAdminRu = {
  general: {
    reindex: 'Переиндексировать',
    email: 'Эл. почта',
    emailAddress: 'Эл. почта',
    emailSent: 'Письмо отправлено',
    verifyYourEmail: 'Подтвердите эл. почту',
    missingEmail: 'Отсутствует эл. почта.',
    emailOrPasswordIncorrect: 'Указанный адрес эл. почты или пароль неверен.',
    userEmailAlreadyRegistered: 'Пользователь с указанным адресом эл. почты уже зарегистрирован.',
    forgotPasswordEmailInstructions:
      'Введите эл. почту. Вы получите письмо с инструкцией по восстановлению пароля.',
  },
} as const
