<template>
  <section class="notfound-wrap">
    <div class="notfound-card">
      <p class="code">404</p>
      <h1>Página no encontrada</h1>
      <p class="desc">
        La ruta que intentaste abrir no existe o fue movida.
      </p>

      <div class="actions">
        <router-link :to="{ name: 'home' }" class="btn btn-primary">
          Ir al inicio
        </router-link>
        <router-link :to="{ name: 'projects' }" class="btn btn-secondary">
          Ver proyectos
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.notfound-wrap {
  min-height: calc(100vh - 160px);
  display: grid;
  place-items: center;
  padding: 120px 16px 40px;
}

.notfound-card {
  width: min(680px, 92vw);
  border-radius: 22px;
  padding: 40px 28px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 18px 48px rgba(0, 40, 80, 0.22);
}

.code {
  font-size: clamp(52px, 10vw, 100px);
  line-height: 1;
  font-weight: 900;
  margin-bottom: 12px;
  color: #1a3a66;
}

h1 {
  font-size: clamp(24px, 4vw, 36px);
  margin-bottom: 10px;
  color: #113052;
}

.desc {
  font-size: 16px;
  color: rgba(17, 48, 82, 0.85);
  margin-bottom: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #00e5ff, #0099ff);
  color: #00111a;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.42);
  color: #0f2f52;
  border: 1px solid rgba(255, 255, 255, 0.48);
}

[data-theme="dark"] .notfound-card {
  background: rgba(10, 10, 15, 0.88);
  border-color: rgba(0, 229, 255, 0.25);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
}

[data-theme="dark"] .code {
  color: #00e5ff;
}

[data-theme="dark"] h1 {
  color: #ffffff;
}

[data-theme="dark"] .desc {
  color: rgba(255, 255, 255, 0.75);
}

[data-theme="dark"] .btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}
</style>
