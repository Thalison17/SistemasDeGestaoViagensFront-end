import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US',
    globalInjection: true,
<<<<<<< HEAD
    messages
=======
    messages,
>>>>>>> 2926bb1 (Salvando alterações locais antes de mudar de branch)
  })

  // Set i18n instance on app
  app.use(i18n)
})
