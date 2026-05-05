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

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/useTheme'

const store = useTheme()
const { mode: theme } = storeToRefs(store)

const colorizedTokens = ref([])
const currentCodeIndex = ref(0)
const currentCharIndex = ref(0)
const showCursor = ref(true)
const currentLanguage = ref('TypeScript')

// IDs para limpiar en onUnmounted y evitar updates sobre componente desmontado
let cursorIntervalId = null
let pendingTimeoutId = null

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

// Palabras reservadas clasificadas
const keywords = {
  special: new Set(['override', 'static', 'abstract', 'throws', 'protected', 'private', 'public', 'final']),
  main: new Set(['class', 'interface', 'function', 'const', 'let', 'var', 'async', 'await', 'return', 'import', 'export', 'extends', 'implements', 'void', 'int', 'String', 'boolean', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'throw', 'try', 'catch', 'finally']),
  literal: new Set(['true', 'false', 'null', 'undefined', 'this', 'super', 'new', 'instanceof', 'typeof', 'delete'])
}


// Coloriza SOLO el último carácter (o fragmento) nuevo — sin re-parsear todo
const appendChar = (char) => {
  const tokens = colorizedTokens.value
  const last = tokens.length > 0 ? tokens[tokens.length - 1] : null

  // Comentarios de línea: si ya hay un token comment abierto (sin \n), extendérlo
  if (last && last.class === 'comment' && !last.closed) {
    if (char === '\n') {
      last.text += char
      last.closed = true
    } else {
      last.text += char
    }
    return
  }

  // Palabras/identificadores: si ya hay un token text/keyword/etc que sigue siendo alfanumérico
  if (last && last.growing && /[a-zA-Z0-9_$]/.test(char)) {
    last.text += char
    // Re-clasificar la palabra completa
    const word = last.text
    if (keywords.special.has(word))  last.class = 'special'
    else if (keywords.main.has(word)) last.class = 'keyword'
    else if (keywords.literal.has(word)) last.class = 'literal'
    else last.class = 'text'
    return
  }

  // Cerrar token creciente
  if (last && last.growing) {
    delete last.growing
  }

  // Strings: si hay un token string abierto, extendérlo
  if (last && last.class === 'string' && !last.closed) {
    last.text += char
    if (char === last.openChar) last.closed = true
    return
  }

  // Inicio de comentario //
  if (char === '/') {
    tokens.push({ text: char, class: 'comment', pending: true })
    return
  }
  if (char === '/' && last && last.class === 'comment' && last.pending) {
    last.text += char
    delete last.pending
    last.closed = false
    return
  }
  // Si el pending no fue seguido de /, cambiarlo a símbolo
  if (last && last.class === 'comment' && last.pending) {
    last.class = 'symbol'
    delete last.pending
  }

  // Comentario Python #
  if (char === '#') {
    tokens.push({ text: char, class: 'comment', closed: false })
    return
  }

  // Inicio de string
  if (char === '"' || char === "'" || char === '`') {
    tokens.push({ text: char, class: 'string', openChar: char, closed: false })
    return
  }

  // Inicio de palabra
  if (/[a-zA-Z_$]/.test(char)) {
    let cls = 'text'
    if (keywords.special.has(char))  cls = 'special'
    else if (keywords.main.has(char)) cls = 'keyword'
    else if (keywords.literal.has(char)) cls = 'literal'
    tokens.push({ text: char, class: cls, growing: true })
    return
  }

  // Números
  if (/[0-9]/.test(char)) {
    if (last && last.class === 'literal' && last.numericGrowing) {
      last.text += char
      return
    }
    tokens.push({ text: char, class: 'literal', numericGrowing: true })
    return
  }

  // Espacios / saltos de línea
  if (char === ' ' || char === '\n' || char === '\t') {
    // Merge con último token text si también es whitespace plain
    if (last && last.class === 'text' && !last.growing && !last.closed) {
      last.text += char
      return
    }
    tokens.push({ text: char, class: 'text' })
    return
  }

  // Símbolos y operadores
  tokens.push({ text: char, class: 'symbol' })
}

// Efecto de tipeo
const typeCode = () => {
  const example = codeExamples[currentCodeIndex.value]
  const code = example.code
  const codeLength = code.length

  if (currentCharIndex.value < codeLength) {
    appendChar(code[currentCharIndex.value])
    currentCharIndex.value++
    pendingTimeoutId = setTimeout(typeCode, 15)
  } else {
    pendingTimeoutId = setTimeout(changeCode, 3000)
  }
}

// Cambiar código
const changeCode = () => {
  currentCodeIndex.value = (currentCodeIndex.value + 1) % codeExamples.length
  currentLanguage.value = codeExamples[currentCodeIndex.value].language
  currentCharIndex.value = 0
  colorizedTokens.value = []

  pendingTimeoutId = setTimeout(typeCode, 500)
}

// Cursor parpadeante — guarda el ID para limpiarlo
const toggleCursor = () => {
  cursorIntervalId = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
}

onMounted(() => {
  typeCode()
  toggleCursor()
})

onUnmounted(() => {
  clearInterval(cursorIntervalId)
  clearTimeout(pendingTimeoutId)
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
    /* Reserva altura estable para evitar layout shift al tipear */
    min-height: 360px;
    padding: 12px 0 0;
  }

  .code-content {
    height: 300px;
    max-height: 300px;
    padding: 16px;
  }

  .code-block {
    font-size: 11px;
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .animated-code {
    min-height: 332px;
    padding-top: 8px;
  }

  .code-content {
    height: 270px;
    max-height: 270px;
    padding: 14px;
  }
}
</style>