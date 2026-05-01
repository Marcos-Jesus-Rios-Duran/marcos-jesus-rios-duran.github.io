<!-- src/components/organisms/hero/AnimatedCode.vue -->
<template>
  <div class="animated-code" :data-theme="theme">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="terminal-title">{{ currentLanguage }}.terminal</span>
    </div>

    <!-- Code Content -->
    <div class="code-content">
      <pre class="code-block"><code><span v-for="(token, idx) in colorizedTokens" :key="idx" :class="token.class">{{ token.text }}</span><span v-if="showCursor" class="cursor">|</span></code></pre>
    </div>

    <!-- Language Indicator -->
    <div class="language-indicator">
      {{ currentLanguage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/useTheme'

const store = useTheme()
const { mode: theme } = storeToRefs(store)

const displayedText = ref('')
const colorizedTokens = ref([])
const currentCodeIndex = ref(0)
const currentCharIndex = ref(0)
const showCursor = ref(true)
const currentLanguage = ref('TypeScript')

// Ejemplos de código con syntax highlighting
const codeExamples = [
  {
    language: 'TypeScript',
    code: `// Dependece Inyection + Strategy Pattern
interface PaymentStrategy {
  process(amount: number): void
}

class CreditCardPayment implements PaymentStrategy {
  process(amount: number) {
    console.log('💳 Processing ' + amount)
  }
}

class Order {
  constructor(private strategy: PaymentStrategy) {}

  checkout(amount: number) {
    this.strategy.process(amount)
  }
}`
  },
  {
    language: 'Java',
    code: `// SOLID Principles - Single Responsibility
@Service
public class UserAuthenticationService {
  private final UserRepository repo;

  public User authenticate(String email, String password) {
    User user = repo.findByEmail(email);
    if (user.validatePassword(password)) {
      return user;
    }
    throw new UnauthorizedException();
  }
}`
  },
  {
    language: 'Python',
    code: `# FastAPI + Dependency Injection
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return db.query(User).filter(User.id == user_id).first()`
  },
  {
    language: 'Dart',
    code: `// Flutter + MVVM Pattern
class UserViewModel extends ChangeNotifier {
  final UserRepository _repo;

  late User _user;

  UserViewModel(this._repo);

  Future&lt;void&gt; loadUser(int id) async {
    _user = await _repo.getUserById(id);
    notifyListeners();
  }

  User get user => _user;
}`
  },
  {
    language: 'JavaScript',
    code: `// Clean Architecture - Use Case Layer
class CreateOrderUseCase {
  constructor(private orderRepo, private paymentService) {}

  async execute(orderData) {
    const order = new Order(orderData);
    const saved = await this.orderRepo.save(order);
    await this.paymentService.process(saved);
    return saved;
  }
}`
  }
]

// Función para colorear el código
const colorizeCode = (code) => {
  const tokens = []
  let i = 0

  const patterns = [
    // Comments (must be first)
    { regex: /^\/\/.*$/m, class: 'comment' },
    { regex: /^#.*$/m, class: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//, class: 'comment' },
    // Strings
    { regex: /`[^`]*`/g, class: 'string' },
    { regex: /"[^"]*"/g, class: 'string' },
    { regex: /'[^']*'/g, class: 'string' },
    // Special keywords (override, static, abstract, throws)
    { regex: /\b(override|static|abstract|throws|protected|private|public)\b/g, class: 'special' },
    // Main keywords
    { regex: /\b(class|interface|function|const|let|var|async|await|return|import|export|extends|implements|final|void|int|String|boolean)\b/g, class: 'keyword' },
    // Literals
    { regex: /\b(true|false|null|undefined|this|super|new|instanceof|typeof|delete)\b/g, class: 'literal' },
    // Numbers
    { regex: /\b\d+\b/g, class: 'literal' },
    // Symbols
    { regex: /[{}\[\]();:,.<>=+\-*/%&|^!~]/g, class: 'symbol' },
  ]

  const codeLength = code.length
  while (i < codeLength) {
    let matched = false

    for (const pattern of patterns) {
      const substring = code.substring(i)
      const match = substring.match(pattern.regex)

      if (match && match.index === 0) {
        const text = match[0]
        tokens.push({ text, class: pattern.class })
        i += text.length
        matched = true
        break
      }
    }

    if (!matched) {
      tokens.push({ text: code[i], class: 'text' })
      i++
    }
  }

  return tokens
}

// Efecto de tipeo
const typeCode = () => {
  const example = codeExamples[currentCodeIndex.value]
  const code = example.code
  const codeLength = code.length

  if (currentCharIndex.value < codeLength) {
    displayedText.value += code[currentCharIndex.value]
    currentCharIndex.value++

    // Colorizar mientras se escribe
    colorizedTokens.value = colorizeCode(displayedText.value)
    setTimeout(typeCode, 15)
  } else {
    setTimeout(changeCode, 3000)
  }
}

// Cambiar código
const changeCode = () => {
  currentCodeIndex.value = (currentCodeIndex.value + 1) % codeExamples.length
  currentLanguage.value = codeExamples[currentCodeIndex.value].language
  currentCharIndex.value = 0
  displayedText.value = ''
  colorizedTokens.value = []

  setTimeout(typeCode, 500)
}

// Cursor parpadeante
const toggleCursor = () => {
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
}

onMounted(() => {
  typeCode()
  toggleCursor()
})
</script>

<style scoped>
.animated-code {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

/* === CSS VARIABLES PARA COLORES === */
.animated-code[data-theme="dark"] {
  --color-keyword: #00e5ff;    /* Cian - Keywords */
  --color-special: #FF8FAB;    /* Rosa - override, static, etc */
  --color-variable: #87ceeb;   /* Sky blue - Variables */
  --color-function: #87ceeb;   /* Sky blue - Methods/Functions */
  --color-comment: #6a9955;    /* Verde oscuro */
  --color-string: #ce9178;     /* Naranja cálido */
  --color-literal: #4ec9b0;    /* Verde agua */
  --color-symbol: #d4d4d4;     /* Gris claro */
  --color-text: #e0e0e0;       /* Gris texto */
}

.animated-code[data-theme="light"] {
  --color-keyword: #0066cc;    /* Azul - Keywords */
  --color-special: #FF8FAB;    /* Rosa vivo - override, static, etc */
  --color-variable: #0099cc;   /* Azul cielo - Variables */
  --color-function: #0099cc;   /* Azul cielo - Methods/Functions */
  --color-comment: #5a9b5c;    /* Verde pastel */
  --color-string: #d97f26;     /* Naranja suave */
  --color-literal: #00a89e;    /* Turquesa suave */
  --color-symbol: #888888;     /* Gris neutro */
  --color-text: #333333;       /* Gris oscuro */
}

/* === TERMINAL STYLE === */
.terminal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(30, 30, 35, 0.95);
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.animated-code[data-theme="light"] .terminal-header {
  background: rgba(245, 245, 250, 0.95);
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

.terminal-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27c93f; }
}

.terminal-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  margin-left: auto;
}

.animated-code[data-theme="light"] .terminal-title {
  color: rgba(0, 0, 0, 0.5);
}

/* === CODE CONTENT === */
.code-content {
  background: linear-gradient(
    135deg,
    rgba(10, 10, 15, 0.95) 0%,
    rgba(20, 20, 30, 0.95) 100%
  );
  border-left: 3px solid rgba(0, 229, 255, 0.5);
  padding: 20px;
  overflow-y: auto;
  max-height: 450px;
  border-radius: 0 0 12px 12px;
  position: relative;
}

.animated-code[data-theme="light"] .code-content {
  background: linear-gradient(
    135deg,
    rgba(250, 252, 248, 0.95) 0%,
    rgba(245, 248, 243, 0.95) 100%
  );
  border-left-color: #FF8FAB;
}

/* Scroll styling */
.code-content::-webkit-scrollbar {
  width: 6px;
}

.code-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.code-content::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.3);
  border-radius: 3px;

  &:hover {
    background: rgba(0, 229, 255, 0.5);
  }
}

.animated-code[data-theme="light"] .code-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.animated-code[data-theme="light"] .code-content::-webkit-scrollbar-thumb {
  background: rgba(0, 102, 204, 0.2);

  &:hover {
    background: rgba(0, 102, 204, 0.4);
  }
}

.code-block {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-block code {
  background: transparent;
  padding: 0;
}

/* === SYNTAX HIGHLIGHTING === */
.comment {
  color: var(--color-comment);
  font-style: italic;
}

.string {
  color: var(--color-string);
}

.special {
  color: var(--color-special);
  font-weight: 700;
}

.keyword {
  color: var(--color-keyword);
  font-weight: 600;
}

.literal {
  color: var(--color-literal);
  font-weight: 600;
}

.symbol {
  color: var(--color-symbol);
}

.text {
  color: var(--color-text);
}

/* === CURSOR === */
.cursor {
  animation: blink 0.8s infinite;
  color: #00e5ff;
  font-weight: bold;
}

.animated-code[data-theme="light"] .cursor {
  color: #0066cc;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* === LANGUAGE INDICATOR === */
.language-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 229, 255, 0.15);
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: #00e5ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

.animated-code[data-theme="light"] .language-indicator {
  background: rgba(0, 102, 204, 0.1);
  border-color: rgba(0, 102, 204, 0.3);
  color: #0066cc;
}

/* === ANIMATIONS === */
.char {
  animation: fadeInChar 0.05s ease-out;
}

@keyframes fadeInChar {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .animated-code {
    min-height: 500px;
    padding: 16px;
  }

  .code-content {
    max-height: 380px;
  }

  .code-block {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .animated-code {
    min-height: auto;
    padding: 20px 0;
  }

  .code-content {
    max-height: 300px;
    padding: 16px;
  }

  .code-block {
    font-size: 11px;
    line-height: 1.5;
  }
}
</style>