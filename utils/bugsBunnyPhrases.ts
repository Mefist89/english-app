export const greetings = [
  "What's up, Doc?",
  "Let's learn English!",
  "Hello, my friend!",
  "Ready to learn?",
  "You can do it!",
]

export const lessonPhrases = [
  "Pick a lesson!",
  "What do you want to learn?",
  "Choose wisely, Doc!",
  "Let's get started!",
]

export const gamePhrases = [
  "Let's play!",
  "Game time, Doc!",
  "Ready for fun?",
  "You're doing great!",
]

export const encouragement = [
  "Great job!",
  "You're amazing!",
  "Keep it up!",
  "Excellent work!",
  "You got this!",
  "Super!",
  "Wonderful!",
]

export const getRandomPhrase = (phrases: string[]): string => {
  return phrases[Math.floor(Math.random() * phrases.length)]
}
