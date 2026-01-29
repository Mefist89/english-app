export const useGameProgress = () => {
  const isLevel6Completed = useState<boolean>('level6Completed', () => false)

  // Load from localStorage on client side
  const loadProgress = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('level6Completed')
      if (saved === 'true') {
        isLevel6Completed.value = true
      }
    }
  }

  // Mark level 6 as completed
  const completeLevel6 = () => {
    isLevel6Completed.value = true
    if (import.meta.client) {
      localStorage.setItem('level6Completed', 'true')
    }
  }

  // Check if secret level is unlocked
  const isSecretLevelUnlocked = computed(() => isLevel6Completed.value)

  // Reset progress (for testing)
  const resetProgress = () => {
    isLevel6Completed.value = false
    if (import.meta.client) {
      localStorage.removeItem('level6Completed')
    }
  }

  return {
    isLevel6Completed,
    isSecretLevelUnlocked,
    loadProgress,
    completeLevel6,
    resetProgress
  }
}
