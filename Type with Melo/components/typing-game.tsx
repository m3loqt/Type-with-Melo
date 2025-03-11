"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Reorganize word lists by word length for each language
// This will allow us to select words based on difficulty level
const WORD_LISTS = {
  english: {
    // Short words (1-4 letters) for easy difficulty
    short: [
      "the",
      "and",
      "for",
      "not",
      "with",
      "you",
      "but",
      "his",
      "from",
      "they",
      "say",
      "her",
      "she",
      "will",
      "one",
      "all",
      "out",
      "who",
      "get",
      "when",
      "make",
      "can",
      "like",
      "time",
      "just",
      "him",
      "know",
      "take",
      "into",
      "year",
      "your",
      "good",
      "some",
      "them",
      "see",
      "other",
      "than",
      "then",
      "now",
      "look",
      "only",
      "come",
      "its",
      "over",
      "think",
      "also",
      "back",
      "use",
      "two",
      "how",
      "our",
      "work",
      "well",
      "way",
      "even",
      "new",
      "want",
      "day",
      "most",
      "must",
      "try",
      "ask",
      "turn",
      "need",
      "feel",
      "seem",
      "part",
      "long",
      "yet",
      "run",
      "set",
      "put",
      "end",
      "does",
      "got",
      "told",
      "ever",
      "best",
      "hand",
      "far",
      "code",
      "next",
      "data",
      "hook",
      "prop",
      "view",
      "node",
      "flex",
      "grid",
      "font",
      "text",
      "link",
      "icon",
      "dark",
      "mode",
      "list",
      "item",
      "card",
      "form",
      "page",
    ],
    // Medium words (5-7 letters) for medium difficulty
    medium: [
      "about",
      "would",
      "there",
      "their",
      "which",
      "people",
      "could",
      "other",
      "these",
      "first",
      "water",
      "after",
      "where",
      "right",
      "think",
      "three",
      "years",
      "place",
      "sound",
      "great",
      "again",
      "still",
      "every",
      "small",
      "found",
      "those",
      "never",
      "under",
      "might",
      "while",
      "house",
      "world",
      "below",
      "asked",
      "going",
      "large",
      "until",
      "along",
      "shall",
      "being",
      "often",
      "earth",
      "began",
      "since",
      "study",
      "night",
      "light",
      "above",
      "paper",
      "parts",
      "young",
      "story",
      "point",
      "times",
      "heard",
      "whole",
      "white",
      "given",
      "means",
      "music",
      "miles",
      "thing",
      "today",
      "later",
      "using",
      "money",
      "lines",
      "order",
      "group",
      "among",
      "learn",
      "known",
      "space",
      "table",
      "early",
      "trees",
      "short",
      "hands",
      "state",
      "black",
      "shown",
      "stood",
      "front",
      "voice",
      "kinds",
      "makes",
      "comes",
      "close",
      "power",
      "lived",
      "react",
      "state",
      "props",
      "fetch",
      "async",
      "await",
      "style",
      "build",
      "array",
      "class",
    ],
    // Long words (8+ letters) for hard difficulty
    long: [
      "different",
      "important",
      "following",
      "beautiful",
      "available",
      "especially",
      "education",
      "development",
      "experience",
      "everything",
      "understand",
      "particular",
      "themselves",
      "something",
      "government",
      "university",
      "information",
      "community",
      "technology",
      "successful",
      "production",
      "performance",
      "environment",
      "management",
      "international",
      "organization",
      "opportunity",
      "population",
      "discussion",
      "collection",
      "professional",
      "traditional",
      "significant",
      "relationship",
      "competition",
      "association",
      "application",
      "description",
      "independent",
      "television",
      "throughout",
      "conference",
      "individual",
      "difference",
      "direction",
      "knowledge",
      "javascript",
      "typescript",
      "component",
      "function",
      "interface",
      "responsive",
      "algorithm",
      "framework",
      "database",
      "variable",
      "constant",
      "undefined",
      "property",
      "middleware",
      "authentication",
      "authorization",
      "deployment",
      "repository",
      "dependency",
      "configuration",
      "optimization",
      "accessibility",
      "serialization",
      "asynchronous",
      "implementation",
      "documentation",
      "architecture",
      "development",
      "integration",
      "refactoring",
      "inheritance",
      "encapsulation",
      "polymorphism",
      "abstraction",
      "declaration",
      "expression",
      "conditional",
      "recursion",
      "validation",
      "pagination",
      "navigation",
      "animation",
      "transition",
      "transformation",
    ],
  },
  spanish: {
    // Short words (1-4 letters) for easy difficulty
    short: [
      "el",
      "la",
      "de",
      "que",
      "y",
      "a",
      "en",
      "un",
      "ser",
      "se",
      "no",
      "por",
      "con",
      "su",
      "para",
      "como",
      "le",
      "lo",
      "todo",
      "pero",
      "más",
      "o",
      "este",
      "si",
      "me",
      "ya",
      "ver",
      "dar",
      "él",
      "muy",
      "sin",
      "vez",
      "mi",
      "año",
      "dos",
      "eso",
      "ni",
      "nos",
      "bien",
      "poco",
      "soy",
      "hay",
      "hoy",
      "mal",
      "pues",
      "aquí",
      "allí",
      "cosa",
      "vida",
      "gran",
      "sea",
      "cual",
      "aún",
      "cada",
      "ese",
      "otro",
      "qué",
      "día",
      "nada",
      "dice",
      "tres",
      "tan",
      "uno",
      "ella",
      "hora",
      "ayer",
      "casa",
      "obra",
      "pues",
      "caso",
      "país",
      "bajo",
      "dice",
      "modo",
      "idea",
      "ley",
      "luz",
      "fin",
      "voz",
      "pie",
      "mar",
      "sol",
      "río",
      "mes",
      "paz",
      "rey",
      "uso",
      "don",
      "gas",
      "ojo",
      "oro",
    ],
    // Medium words (5-7 letters) for medium difficulty
    medium: [
      "haber",
      "estar",
      "tener",
      "hacer",
      "poder",
      "decir",
      "cuando",
      "mucho",
      "saber",
      "querer",
      "entre",
      "desde",
      "grande",
      "llegar",
      "tiempo",
      "mismo",
      "ahora",
      "algún",
      "sobre",
      "contra",
      "porque",
      "siempre",
      "durante",
      "aunque",
      "primero",
      "después",
      "antes",
      "nuevo",
      "donde",
      "manera",
      "mientras",
      "propio",
      "momento",
      "través",
      "persona",
      "pueblo",
      "cuenta",
      "mundo",
      "cuerpo",
      "familia",
      "ciudad",
      "trabajo",
      "mañana",
      "dinero",
      "nombre",
      "tierra",
      "madre",
      "padre",
      "amigo",
      "noche",
      "manos",
      "muerte",
      "parte",
      "joven",
      "tarde",
      "medio",
      "final",
      "forma",
      "dentro",
      "hacia",
      "menos",
      "mejor",
      "lugar",
      "sentir",
      "pensar",
      "seguir",
      "dejar",
      "hablar",
      "llevar",
      "buscar",
      "poner",
      "volver",
      "pasar",
      "mirar",
      "salir",
      "vivir",
      "caer",
    ],
    // Long words (8+ letters) for hard difficulty
    long: [
      "diferente",
      "importante",
      "siguiente",
      "desarrollo",
      "experiencia",
      "información",
      "gobierno",
      "universidad",
      "tecnología",
      "producción",
      "comunidad",
      "internacional",
      "organización",
      "oportunidad",
      "población",
      "discusión",
      "colección",
      "profesional",
      "tradicional",
      "significativo",
      "relación",
      "competencia",
      "asociación",
      "aplicación",
      "descripción",
      "independiente",
      "televisión",
      "conferencia",
      "individual",
      "diferencia",
      "dirección",
      "conocimiento",
      "movimiento",
      "presidente",
      "situación",
      "condición",
      "actividad",
      "necesidad",
      "realidad",
      "posibilidad",
      "capacidad",
      "resultado",
      "presencia",
      "influencia",
      "existencia",
      "referencia",
      "importancia",
      "estructura",
      "responsabilidad",
      "investigación",
      "representación",
      "administración",
      "comunicación",
      "consideración",
      "construcción",
      "constitución",
      "establecimiento",
      "reconocimiento",
      "funcionamiento",
      "comportamiento",
      "descubrimiento",
      "entendimiento",
      "procedimiento",
      "pensamiento",
      "sentimiento",
      "movimiento",
      "tratamiento",
      "crecimiento",
      "nacimiento",
      "departamento",
      "conocimiento",
      "rendimiento",
      "seguimiento",
      "mantenimiento",
      "planteamiento",
    ],
  },
  french: {
    // Short words (1-4 letters) for easy difficulty
    short: [
      "le",
      "la",
      "de",
      "et",
      "un",
      "une",
      "du",
      "en",
      "à",
      "il",
      "qui",
      "que",
      "ce",
      "dans",
      "pour",
      "pas",
      "sur",
      "plus",
      "avec",
      "tout",
      "mais",
      "nous",
      "ou",
      "si",
      "leur",
      "bien",
      "sans",
      "être",
      "son",
      "ne",
      "se",
      "mon",
      "lui",
      "même",
      "ma",
      "où",
      "quand",
      "par",
      "voir",
      "très",
      "bon",
      "deux",
      "ici",
      "jour",
      "rien",
      "dire",
      "elle",
      "peu",
      "seul",
      "fois",
      "quel",
      "dont",
      "sous",
      "gens",
      "haut",
      "eau",
      "loin",
      "doit",
      "trop",
      "chef",
      "peur",
      "yeux",
      "pays",
      "ciel",
      "mort",
      "tard",
      "tête",
      "main",
      "fait",
      "noir",
      "dieu",
      "vrai",
      "voix",
      "pied",
      "sang",
      "père",
      "mère",
      "fils",
      "roi",
      "loi",
      "mer",
      "feu",
      "jeu",
      "âge",
      "air",
      "art",
      "cas",
      "vie",
      "nom",
      "mot",
      "nez",
      "oeil",
    ],
    // Medium words (5-7 letters) for medium difficulty
    medium: [
      "avoir",
      "faire",
      "autre",
      "comme",
      "cette",
      "entre",
      "aussi",
      "après",
      "avant",
      "alors",
      "encore",
      "depuis",
      "jamais",
      "toujours",
      "pendant",
      "chaque",
      "contre",
      "pouvoir",
      "savoir",
      "vouloir",
      "devoir",
      "prendre",
      "donner",
      "trouver",
      "parler",
      "mettre",
      "passer",
      "moment",
      "personne",
      "histoire",
      "exemple",
      "question",
      "réponse",
      "problème",
      "solution",
      "famille",
      "maison",
      "travail",
      "argent",
      "monde",
      "enfant",
      "femme",
      "homme",
      "temps",
      "chose",
      "raison",
      "manière",
      "partie",
      "place",
      "nombre",
      "point",
      "forme",
      "idée",
      "sorte",
      "façon",
      "besoin",
      "effet",
      "cause",
      "suite",
      "début",
      "cours",
      "moyen",
      "niveau",
      "ordre",
      "état",
      "côté",
      "regard",
      "amour",
      "esprit",
      "corps",
      "coeur",
      "force",
      "image",
      "ligne",
      "route",
      "ville",
    ],
    // Long words (8+ letters) for hard difficulty
    long: [
      "différent",
      "important",
      "développement",
      "expérience",
      "information",
      "gouvernement",
      "université",
      "technologie",
      "production",
      "communauté",
      "international",
      "organisation",
      "opportunité",
      "population",
      "discussion",
      "collection",
      "professionnel",
      "traditionnel",
      "significatif",
      "relation",
      "compétition",
      "association",
      "application",
      "description",
      "indépendant",
      "télévision",
      "conférence",
      "individuel",
      "différence",
      "direction",
      "connaissance",
      "mouvement",
      "président",
      "situation",
      "condition",
      "activité",
      "nécessité",
      "réalité",
      "possibilité",
      "capacité",
      "résultat",
      "présence",
      "influence",
      "existence",
      "référence",
      "importance",
      "structure",
      "responsabilité",
      "investigation",
      "représentation",
      "administration",
      "communication",
      "considération",
      "construction",
      "constitution",
      "établissement",
      "reconnaissance",
      "fonctionnement",
      "comportement",
      "découverte",
      "compréhension",
      "procédure",
      "environnement",
      "développement",
      "apprentissage",
      "enseignement",
      "appartement",
      "changement",
      "engagement",
      "événement",
      "sentiment",
      "traitement",
      "mouvement",
      "département",
      "équipement",
      "instrument",
      "médicament",
      "restaurant",
      "vêtement",
      "bâtiment",
    ],
  },
  german: {
    // Short words (1-4 letters) for easy difficulty
    short: [
      "der",
      "die",
      "und",
      "in",
      "den",
      "von",
      "zu",
      "das",
      "mit",
      "sich",
      "des",
      "auf",
      "für",
      "ist",
      "im",
      "dem",
      "ein",
      "eine",
      "als",
      "auch",
      "es",
      "an",
      "aus",
      "er",
      "hat",
      "dass",
      "sie",
      "nach",
      "bei",
      "um",
      "am",
      "sind",
      "noch",
      "wie",
      "über",
      "so",
      "zum",
      "war",
      "was",
      "wird",
      "sein",
      "nur",
      "oder",
      "aber",
      "vor",
      "zur",
      "bis",
      "mehr",
      "man",
      "kann",
      "schon",
      "wenn",
      "hier",
      "alle",
      "dann",
      "sehr",
      "wohl",
      "jetzt",
      "ganz",
      "zwei",
      "weil",
      "ohne",
      "seit",
      "muss",
      "Jahr",
      "Frau",
      "Herr",
      "Bild",
      "Welt",
      "Haus",
      "Land",
      "Hand",
      "Teil",
      "Geld",
      "Weg",
      "Tag",
      "Sohn",
      "Kopf",
      "Fuß",
      "Buch",
      "Wort",
      "Tür",
      "Idee",
      "Ziel",
      "Sinn",
      "Ding",
      "Gott",
      "Wein",
      "Bier",
      "Brot",
      "Obst",
      "Fisch",
    ],
    // Medium words (5-7 letters) for medium difficulty
    medium: [
      "werden",
      "haben",
      "können",
      "sollen",
      "wollen",
      "müssen",
      "machen",
      "geben",
      "kommen",
      "sagen",
      "gehen",
      "sehen",
      "lassen",
      "stehen",
      "finden",
      "bleiben",
      "liegen",
      "heißen",
      "denken",
      "nehmen",
      "bringen",
      "glauben",
      "halten",
      "wissen",
      "leben",
      "spielen",
      "folgen",
      "führen",
      "sprechen",
      "treffen",
      "stellen",
      "kennen",
      "zeigen",
      "fehlen",
      "gehören",
      "entstehen",
      "erhalten",
      "verlieren",
      "beginnen",
      "laufen",
      "fühlen",
      "bieten",
      "interessieren",
      "erklären",
      "erwarten",
      "entwickeln",
      "arbeiten",
      "lernen",
      "bestehen",
      "verstehen",
      "setzen",
      "bekommen",
      "meinen",
      "schaffen",
      "erkennen",
      "schließen",
      "fragen",
      "nutzen",
      "handeln",
      "antworten",
      "bedeuten",
      "treiben",
      "ziehen",
      "fallen",
      "öffnen",
      "scheinen",
      "schreiben",
      "verkaufen",
      "vergessen",
      "helfen",
      "ändern",
      "trinken",
      "essen",
      "kaufen",
      "zahlen",
      "suchen",
      "reisen",
      "tanzen",
      "kochen",
    ],
    // Long words (8+ letters) for hard difficulty
    long: [
      "unterschiedlich",
      "wichtig",
      "Entwicklung",
      "Erfahrung",
      "Information",
      "Regierung",
      "Universität",
      "Technologie",
      "Produktion",
      "Gemeinschaft",
      "international",
      "Organisation",
      "Gelegenheit",
      "Bevölkerung",
      "Diskussion",
      "Sammlung",
      "professionell",
      "traditionell",
      "bedeutend",
      "Beziehung",
      "Wettbewerb",
      "Vereinigung",
      "Anwendung",
      "Beschreibung",
      "unabhängig",
      "Fernsehen",
      "Konferenz",
      "individuell",
      "Unterschied",
      "Richtung",
      "Wissen",
      "Bewegung",
      "Präsident",
      "Situation",
      "Bedingung",
      "Aktivität",
      "Notwendigkeit",
      "Wirklichkeit",
      "Möglichkeit",
      "Fähigkeit",
      "Ergebnis",
      "Anwesenheit",
      "Einfluss",
      "Existenz",
      "Referenz",
      "Bedeutung",
      "Struktur",
      "Verantwortung",
      "Untersuchung",
      "Darstellung",
      "Verwaltung",
      "Kommunikation",
      "Berücksichtigung",
      "Konstruktion",
      "Verfassung",
      "Einrichtung",
      "Anerkennung",
      "Funktionieren",
      "Verhalten",
      "Entdeckung",
      "Verständnis",
      "Verfahren",
      "Umgebung",
      "Entwicklung",
      "Wissenschaft",
      "Gesellschaft",
      "Wirtschaft",
      "Ausbildung",
      "Beziehung",
      "Erziehung",
      "Forschung",
      "Gesundheit",
      "Sicherheit",
      "Verwaltung",
    ],
  },
}

// Game difficulty settings
const DIFFICULTY = {
  easy: { timeLimit: 60, wordMultiplier: 1 },
  medium: { timeLimit: 45, wordMultiplier: 1.5 },
  hard: { timeLimit: 30, wordMultiplier: 2 },
}

type GameState = "idle" | "playing" | "finished"
type WordDifficulty = "short" | "medium" | "long"

export default function TypingGame() {
  const [gameState, setGameState] = useState<GameState>("idle")
  const [currentWord, setCurrentWord] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY>("medium")
  const [wordsTyped, setWordsTyped] = useState(0)
  const [correctWords, setCorrectWords] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [wordStartTime, setWordStartTime] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof WORD_LISTS>("english")
  // Add state for the confirmation dialog
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Updated getRandomWord function to select words based on difficulty
  const getRandomWord = () => {
    // Map game difficulty to word difficulty
    let wordDifficulty: WordDifficulty

    switch (difficulty) {
      case "easy":
        wordDifficulty = "short"
        break
      case "medium":
        wordDifficulty = "medium"
        break
      case "hard":
        wordDifficulty = "long"
        break
      default:
        wordDifficulty = "medium"
    }

    const wordList = WORD_LISTS[selectedLanguage][wordDifficulty]
    const randomIndex = Math.floor(Math.random() * wordList.length)
    return wordList[randomIndex]
  }

  // Start the game
  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setWordsTyped(0)
    setCorrectWords(0)
    setTimeLeft(DIFFICULTY[difficulty].timeLimit)
    setCurrentWord(getRandomWord())
    setInputValue("")
    setStartTime(Date.now())
    setWordStartTime(Date.now())

    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  // Check the typed word
  const checkWord = () => {
    const isCorrect = inputValue.trim().toLowerCase() === currentWord.toLowerCase()
    setWordsTyped((prev) => prev + 1)

    if (isCorrect) {
      const timeTaken = (Date.now() - wordStartTime) / 1000
      const wordScore = Math.max(10, Math.floor(50 / timeTaken)) * DIFFICULTY[difficulty].wordMultiplier

      setScore((prev) => prev + wordScore)
      setCorrectWords((prev) => prev + 1)

      toast({
        title: `+${Math.floor(wordScore)} points!`,
        description: "Great job!",
        duration: 1000,
      })
    }

    // Get a new word
    setCurrentWord(getRandomWord())
    setInputValue("")
    setWordStartTime(Date.now())
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle input keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      checkWord()
    }
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (gameState === "playing" && timeLeft === 0) {
      setGameState("finished")
    }

    return () => clearTimeout(timer)
  }, [gameState, timeLeft])

  // Calculate accuracy
  const accuracy = wordsTyped > 0 ? Math.round((correctWords / wordsTyped) * 100) : 0

  // Calculate words per minute
  const calculateWPM = () => {
    if (gameState !== "finished" || correctWords === 0) return 0
    const minutesElapsed = (Date.now() - startTime) / 1000 / 60
    return Math.round(correctWords / minutesElapsed)
  }

  // Show confirmation dialog before returning to main menu
  const handleMainMenuClick = () => {
    setShowExitConfirmation(true)
  }

  // Return to main menu after confirmation
  const confirmReturnToMainMenu = () => {
    setShowExitConfirmation(false)
    setGameState("idle")
  }

  // Cancel return to main menu
  const cancelReturnToMainMenu = () => {
    setShowExitConfirmation(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 font-mono">
      {/* Confirmation Dialog */}
      <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <AlertDialogContent className="bg-gray-900 border-2 border-white text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold pixel-text">RETURN TO MAIN MENU?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Your current game progress will be lost. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-4 mt-4">
            <AlertDialogCancel className="flex-1 bg-black text-white border-2 border-white hover:bg-gray-900">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReturnToMainMenu}
              className="flex-1 bg-white text-black border-2 border-white hover:bg-gray-200"
            >
              EXIT GAME
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 pixel-text">TYPE WITH MELO</h1>
        <p className="text-gray-400">Test your typing speed and accuracy</p>
      </div>

      {gameState === "idle" && (
        <div className="space-y-6">
          <div className="bg-gray-900 border-2 border-white p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4 pixel-text">HOW TO PLAY</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Type the displayed word correctly</li>
              <li>Press Enter to submit your answer</li>
              <li>Score points based on speed and accuracy</li>
              <li>Try to type as many words as possible before time runs out</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="bg-gray-900 border-2 border-white p-4 rounded-md">
              <h3 className="text-xl font-bold mb-3 pixel-text">SELECT LANGUAGE</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setSelectedLanguage("english")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    selectedLanguage === "english"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  ENGLISH
                </Button>
                <Button
                  onClick={() => setSelectedLanguage("spanish")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    selectedLanguage === "spanish"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  ESPAÑOL
                </Button>
                <Button
                  onClick={() => setSelectedLanguage("french")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    selectedLanguage === "french"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  FRANÇAIS
                </Button>
                <Button
                  onClick={() => setSelectedLanguage("german")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    selectedLanguage === "german"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  DEUTSCH
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-white p-4 rounded-md">
              <h3 className="text-xl font-bold mb-3 pixel-text">SELECT DIFFICULTY</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => setDifficulty("easy")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    difficulty === "easy"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  EASY
                </Button>
                <Button
                  onClick={() => setDifficulty("medium")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    difficulty === "medium"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  MEDIUM
                </Button>
                <Button
                  onClick={() => setDifficulty("hard")}
                  className={cn(
                    "border-2 border-white font-bold transition-all",
                    difficulty === "hard"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-900",
                  )}
                >
                  HARD
                </Button>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="w-full py-6 text-xl font-bold bg-white text-black hover:bg-gray-200 border-2 border-white"
            >
              START GAME
            </Button>
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-6">
          {/* Game stats and main menu button */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="bg-gray-900 border-2 border-white p-3 rounded-md">
                <span className="text-sm block">SCORE</span>
                <span className="text-2xl font-bold">{Math.floor(score)}</span>
              </div>
              <div className="bg-gray-900 border-2 border-white p-3 rounded-md">
                <span className="text-sm block">TIME</span>
                <span className="text-2xl font-bold">{timeLeft}s</span>
              </div>
              <div className="bg-gray-900 border-2 border-white p-3 rounded-md">
                <span className="text-sm block">WORDS</span>
                <span className="text-2xl font-bold">{correctWords}</span>
              </div>
            </div>
          </div>

          {/* Improved main menu button - more prominent and attention-grabbing */}
          <Button
            onClick={handleMainMenuClick}
            className="w-full py-3 text-lg font-bold bg-red-600 text-white hover:bg-red-700 border-2 border-white transition-all pulse-animation"
          >
            MAIN MENU
          </Button>

          <Progress value={(timeLeft / DIFFICULTY[difficulty].timeLimit) * 100} className="h-2 bg-gray-800" />

          <div className="bg-gray-900 border-2 border-white p-8 rounded-md flex items-center justify-center">
            <h2 className="text-4xl font-bold tracking-wider pixel-text">{currentWord}</h2>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full p-4 text-xl bg-transparent border-2 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Type the word here..."
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <Button
              onClick={checkWord}
              disabled={inputValue.trim() === ""}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black hover:bg-gray-200"
            >
              ENTER
            </Button>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="space-y-6">
          <div className="bg-gray-900 border-2 border-white p-6 rounded-md text-center">
            <h2 className="text-3xl font-bold mb-6 pixel-text">GAME OVER</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black border border-gray-700 p-4 rounded-md">
                <span className="block text-gray-400">FINAL SCORE</span>
                <span className="text-3xl font-bold">{Math.floor(score)}</span>
              </div>
              <div className="bg-black border border-gray-700 p-4 rounded-md">
                <span className="block text-gray-400">ACCURACY</span>
                <span className="text-3xl font-bold">{accuracy}%</span>
              </div>
              <div className="bg-black border border-gray-700 p-4 rounded-md">
                <span className="block text-gray-400">WORDS TYPED</span>
                <span className="text-3xl font-bold">{correctWords}</span>
              </div>
              <div className="bg-black border border-gray-700 p-4 rounded-md">
                <span className="block text-gray-400">WPM</span>
                <span className="text-3xl font-bold">{calculateWPM()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={startGame}
                className="flex-1 py-6 text-xl font-bold bg-white text-black hover:bg-gray-200 border-2 border-white"
              >
                PLAY AGAIN
              </Button>
              <Button
                onClick={handleMainMenuClick}
                className="flex-1 py-6 text-xl font-bold bg-white text-black hover:bg-gray-900 border-2 border-white"
              >
                MAIN MENU
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

