import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useOnboarding = defineStore('onboarding', () => {
  const { t } = useI18n()
  const isActive = ref(false)
  const currentStep = ref(0)

  const steps = computed(() => [
    {
      id: 'welcome',
      target: null,
      title: t('onboarding.steps.0.title'),
      description: t('onboarding.steps.0.description'),
      position: 'center',
      highlight: false
    },
    {
      id: 'language',
      target: '.lang-switch',
      title: t('onboarding.steps.1.title'),
      description: t('onboarding.steps.1.description'),
      position: 'bottom-center',
      highlight: true
    },
    {
      id: 'theme',
      target: '[data-toggle-theme]',
      title: t('onboarding.steps.2.title'),
      description: t('onboarding.steps.2.description'),
      position: 'bottom-left',
      highlight: true
    },
    {
      id: 'skills',
      target: '.skills-section',
      title: t('onboarding.steps.3.title'),
      description: t('onboarding.steps.3.description'),
      position: 'top-center',
      highlight: true
    },
    {
      id: 'mentors',
      target: '.mentors-view',
      title: t('onboarding.steps.4.title'),
      description: t('onboarding.steps.4.description'),
        position: 'top-mentor',
      highlight: true
    },
    {
      id: 'explore',
      target: '[href="/projects"]',
      title: t('onboarding.steps.5.title'),
      description: t('onboarding.steps.5.description'),
      position: 'bottom-center',
      highlight: false
    },
    {
      id: 'finish',
      target: null,
      title: t('onboarding.steps.6.title'),
      description: t('onboarding.steps.6.description'),
      position: 'center',
      highlight: false
    }
  ])

  function initOnboarding() {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')

    if (!hasSeenOnboarding) {
      isActive.value = true
      currentStep.value = 0
      localStorage.setItem('hasSeenOnboarding', 'true')
    }
  }

  function nextStep() {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
      scrollToTarget()
    } else {
      closeOnboarding()
    }
  }

  function previousStep() {
    if (currentStep.value > 0) {
      currentStep.value--
      scrollToTarget()
    }
  }

  function skipOnboarding() {
    closeOnboarding()
  }

  function closeOnboarding() {
    isActive.value = false
  }

  function finishOnboarding() {
    closeOnboarding()
    // Scroll al inicio después de cerrar
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  function resetOnboarding() {
    localStorage.removeItem('hasSeenOnboarding')
    isActive.value = false
    currentStep.value = 0
  }

  function scrollToTarget() {
    const step = steps.value[currentStep.value]
    if (step.target) {
      const element = document.querySelector(step.target)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    }
  }

  const currentStepData = computed(() => steps.value[currentStep.value])
  const progress = computed(() => Math.round(((currentStep.value + 1) / steps.value.length) * 100))
  const isLastStep = computed(() => currentStep.value === steps.value.length - 1)

  return {
    isActive,
    currentStep,
    steps,
    finishOnboarding,
    currentStepData,
    progress,
    isLastStep,
    initOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    closeOnboarding,
    resetOnboarding,
    scrollToTarget
  }
})
