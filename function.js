let expCount = 0;
let eduCount = 0;

// ---- Inicializar con datos de ejemplo ---------------------
window.addEventListener('DOMContentLoaded', () => {
  updateAllPreviews();
  syncAccentColor();

  // Agregar bloques vacíos de experiencia y educación
  addExperience(false);
  addEducation(false);

  // Listeners para todos los campos principales
  const fieldIds = ['fullName','jobTitle','email','phone','city','linkedin','summary','skills','languages'];
  fieldIds.forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateAllPreviews);
  });

  document.getElementById('accentColor').addEventListener('input', syncAccentColor);
});

// ---- Sync de color acento ---------------------------------
function syncAccentColor() {
  const color = document.getElementById('accentColor').value;
  document.documentElement.style.setProperty('--accent', color);
}

// ---- Actualizar TODA la vista previa ----------------------
function updateAllPreviews() {
  updateHeader();
  updateSummary();
  updateExperience();
  updateEducation();
  updateSkills();
}

function updateHeader() {
  setText('prevName', 'fullName', 'Tu Nombre Aquí');
  setText('prevJob', 'jobTitle', 'Tu cargo profesional');
  setText('prevEmail', 'email', 'email@ejemplo.com');
  setText('prevPhone', 'phone', '+502 0000-0000');
  setText('prevCity', 'city', 'Ciudad');
  setText('prevLinkedin', 'linkedin', 'linkedin.com/in/perfil');
}

function setText(previewId, inputId, placeholder) {
  const el = document.getElementById(previewId);
  const val = document.getElementById(inputId)?.value.trim();
  if (el) {
    el.textContent = val || placeholder;
    el.classList.toggle('cv-placeholder', !val);
  }
}

function updateSummary() {
  const el = document.getElementById('prevSummary');
  const val = document.getElementById('summary')?.value.trim();
  if (el) {
    el.textContent = val || 'Tu resumen profesional aparecerá aquí...';
    el.classList.toggle('cv-placeholder', !val);
  }
}

function updateExperience() {
  const list = document.getElementById('prevExpList');
  if (!list) return;
  list.innerHTML = '';
  const blocks = document.querySelectorAll('[data-type="exp"]');
  if (!blocks.length) {
    list.innerHTML = '<p class="cv-placeholder">Agrega tu experiencia laboral...</p>';
    return;
  }
  blocks.forEach(block => {
    const company  = block.querySelector('.exp-company')?.value.trim() || '';
    const position = block.querySelector('.exp-position')?.value.trim() || '';
    const start    = block.querySelector('.exp-start')?.value.trim() || '';
    const end      = block.querySelector('.exp-end')?.value.trim() || '';
    const desc     = block.querySelector('.exp-desc')?.value.trim() || '';
    const date     = [start, end].filter(Boolean).join(' – ');
    if (!company && !position) return;
    list.insertAdjacentHTML('beforeend', `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <div class="cv-entry-title">${position || 'Cargo'}</div>
            <div class="cv-entry-sub">${company || 'Empresa'}</div>
          </div>
          ${date ? `<div class="cv-entry-date">${date}</div>` : ''}
        </div>
        ${desc ? `<div class="cv-entry-desc">${desc}</div>` : ''}
      </div>
    `);
  });
}

function updateEducation() {
  const list = document.getElementById('prevEduList');
  if (!list) return;
  list.innerHTML = '';
  const blocks = document.querySelectorAll('[data-type="edu"]');
  if (!blocks.length) {
    list.innerHTML = '<p class="cv-placeholder">Agrega tu educación...</p>';
    return;
  }
  blocks.forEach(block => {
    const school = block.querySelector('.edu-school')?.value.trim() || '';
    const degree = block.querySelector('.edu-degree')?.value.trim() || '';
    const start  = block.querySelector('.edu-start')?.value.trim() || '';
    const end    = block.querySelector('.edu-end')?.value.trim() || '';
    const date   = [start, end].filter(Boolean).join(' – ');
    if (!school && !degree) return;
    list.insertAdjacentHTML('beforeend', `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <div class="cv-entry-title">${degree || 'Título'}</div>
            <div class="cv-entry-sub">${school || 'Institución'}</div>
          </div>
          ${date ? `<div class="cv-entry-date">${date}</div>` : ''}
        </div>
      </div>
    `);
  });
}

function updateSkills() {
  renderTags('skills', 'prevSkills');
  renderTags('languages', 'prevLanguages');
}

function renderTags(inputId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const val = document.getElementById(inputId)?.value.trim();
  if (!val) {
    container.innerHTML = '<p class="cv-placeholder">Sin datos aún...</p>';
    return;
  }
  const tags = val.split(',').map(s => s.trim()).filter(Boolean);
  container.innerHTML = tags.map(t => `<span class="cv-tag">${t}</span>`).join('');
}

// ---- Agregar / eliminar bloques ---------------------------
function addExperience(prefill = false) {
  const template = document.getElementById('expTemplate');
  const clone = template.content.cloneNode(true);
  const block = clone.querySelector('.entry-block');

  if (prefill === true) {
    block.querySelector('.exp-company').value  = 'Empresa Ejemplo S.A.';
    block.querySelector('.exp-position').value = 'Desarrollador de Software';
    block.querySelector('.exp-start').value    = 'Ene 2022';
    block.querySelector('.exp-end').value      = 'Actualidad';
    block.querySelector('.exp-desc').value     = 'Desarrollo de aplicaciones web, colaboración en equipo ágil y entrega de soluciones de alta calidad.';
  }

  // Escuchar cambios en todos los inputs del bloque
  block.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updateAllPreviews));
  document.getElementById('experienceList').appendChild(clone);
  updateAllPreviews();
}

function addEducation(prefill = false) {
  const template = document.getElementById('eduTemplate');
  const clone = template.content.cloneNode(true);
  const block = clone.querySelector('.entry-block');

  if (prefill === true) {
    block.querySelector('.edu-school').value = 'Universidad de San Carlos';
    block.querySelector('.edu-degree').value = 'Ingeniería en Sistemas';
    block.querySelector('.edu-start').value  = '2017';
    block.querySelector('.edu-end').value    = '2022';
  }

  block.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updateAllPreviews));
  document.getElementById('educationList').appendChild(clone);
  updateAllPreviews();
}

function removeEntry(btn) {
  btn.closest('.entry-block').remove();
  updateAllPreviews();
}

// GENERACIÓN DE PDF con jsPDF


function generatePDF() {
  //Libreria jsPDF y desestructuramos 
  const { jsPDF } = window.jspdf;
  //Creamos un nuevo documento y ponemos la unidad en milimetros y tamaño de hoja a4
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  //Estas dos funciones devuelven un color en Hexagecimal
  const accentHex = document.getElementById('accentColor').value;
  const font      = document.getElementById('fontChoice').value;
  //Convertimos a decimal con ".slice" cortamos la string en 3 cadenas de 2 caracteres
  //de base 16 a numero decimal
  const R = parseInt(accentHex.slice(1,3),16);
  const G = parseInt(accentHex.slice(3,5),16);
  const B = parseInt(accentHex.slice(5,7),16);

  //buscamos el id de cada input y leemos su valor con .value
  //con "||'sin nombre" lo usamos como un retorno si el campo esta vacio 
  //enves de dejarlo en blanco lo retorna como 'sin nombre'
  const name     = document.getElementById('fullName').value  || 'Sin nombre';
  const job      = document.getElementById('jobTitle').value  || '';
  const email    = document.getElementById('email').value     || '';
  const phone    = document.getElementById('phone').value     || '';
  const city     = document.getElementById('city').value      || '';
  const linkedin = document.getElementById('linkedin').value  || '';
  const summary  = document.getElementById('summary').value   || '';
  //Con .split(',') separamos elementos por ','
  //con .map(s => s.trim()) eliminamos espacios si el usuario los deja
  //Con .filter(Boolean) eliminamos caracteres espacios o comas de más
  const skills   = document.getElementById('skills').value.split(',').map(s=>s.trim()).filter(Boolean);
  const langs    = document.getElementById('languages').value.split(',').map(s=>s.trim()).filter(Boolean);

  //Definimos medidas de documento
  const W = 210; //Ancho de a4 en mm
  const H = 297; //Alto de a4 en mm
  let y = 0;     //Va dibujando desde 0 va aumentando 

  // ============ HEADER ============
  doc.setFillColor(R, G, B);
  doc.rect(0, 0, W, 48, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont(font, 'bold');
  doc.setFontSize(26);
  doc.text(name, 16, 20);

  doc.setFont(font, 'normal');
  doc.setFontSize(11);
  doc.text(job.toUpperCase(), 16, 28);

  // Contacto en header
  doc.setFontSize(9);
  const contacts = [email, phone, city, linkedin].filter(Boolean);
  let cx = 16;
  contacts.forEach(c => {
    doc.text(c, cx, 38);
    cx += doc.getTextWidth(c) + 12;
  });

  // ============ COLUMNAS ============
  const leftW = 125;
  const rightX = leftW + 5;
  const rightW = W - rightX - 10;
  y = 55;

  // Línea divisoria vertical
  doc.setDrawColor(230, 227, 222);
  doc.setLineWidth(0.3);
  doc.line(leftX = leftW + 2, 52, leftX, H - 15);

  // Helpers
  function sectionTitle(text, x, yPos, w) {
    doc.setFillColor(R, G, B);
    doc.setFont(font, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(R, G, B);
    doc.text(text.toUpperCase(), x, yPos);
    doc.setDrawColor(R, G, B);
    doc.setLineWidth(0.6);
    doc.line(x, yPos + 1.5, x + w, yPos + 1.5);
    doc.setTextColor(30, 25, 20);
    doc.setLineWidth(0.3);
    return yPos + 7;
  }

  function wrappedText(text, x, yPos, maxW, lineH = 5) {
    const lines = doc.splitTextToSize(text, maxW);
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 55, 50);
    doc.text(lines, x, yPos);
    return yPos + lines.length * lineH;
  }

  function checkPageBreak(yPos, threshold = 270) {
    if (yPos > threshold) {
      doc.addPage();
      return 20;
    }
    return yPos;
  }

  // ============ IZQUIERDA ============
  let yL = y;

  // Perfil
  if (summary) {
    yL = sectionTitle('Perfil Profesional', 14, yL, leftW - 18);
    doc.setFontSize(9.5);
    yL = wrappedText(summary, 14, yL, leftW - 18);
    yL += 8;
  }

  // Experiencia
  const expBlocks = document.querySelectorAll('[data-type="exp"]');
  if (expBlocks.length) {
    yL = sectionTitle('Experiencia Laboral', 14, yL, leftW - 18);
    expBlocks.forEach(block => {
      const company  = block.querySelector('.exp-company')?.value.trim() || '';
      const position = block.querySelector('.exp-position')?.value.trim() || '';
      const start    = block.querySelector('.exp-start')?.value.trim() || '';
      const end      = block.querySelector('.exp-end')?.value.trim() || '';
      const desc     = block.querySelector('.exp-desc')?.value.trim() || '';
      if (!company && !position) return;
      yL = checkPageBreak(yL);

      doc.setFont(font, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30,25,20);
      doc.text(position || 'Cargo', 14, yL);

      const dateStr = [start, end].filter(Boolean).join(' – ');
      if (dateStr) {
        doc.setFont(font, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(120,115,110);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, leftW - 4 - dw, yL);
      }

      yL += 4.5;
      doc.setFont(font, 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(R, G, B);
      doc.text(company, 14, yL);
      yL += 5;

      if (desc) {
        yL = wrappedText(desc, 14, yL, leftW - 18);
      }
      yL += 6;
    });
  }

  // ============ DERECHA ============
  let yR = y;

  // Educación
  const eduBlocks = document.querySelectorAll('[data-type="edu"]');
  if (eduBlocks.length) {
    yR = sectionTitle('Educación', rightX, yR, rightW);
    eduBlocks.forEach(block => {
      const school = block.querySelector('.edu-school')?.value.trim() || '';
      const degree = block.querySelector('.edu-degree')?.value.trim() || '';
      const start  = block.querySelector('.edu-start')?.value.trim() || '';
      const end    = block.querySelector('.edu-end')?.value.trim() || '';
      if (!school && !degree) return;
      yR = checkPageBreak(yR);

      doc.setFont(font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30,25,20);
      doc.text(degree || 'Título', rightX, yR);
      yR += 4.5;
      doc.setFont(font, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80,75,70);
      doc.text(school, rightX, yR);
      const dateStr = [start,end].filter(Boolean).join(' – ');
      yR += 4;
      if (dateStr) {
        doc.setFontSize(8.5);
        doc.setTextColor(130,125,120);
        doc.text(dateStr, rightX, yR);
        yR += 4;
      }
      yR += 4;
    });
    yR += 4;
  }

  // Habilidades
  if (skills.length) {
    yR = sectionTitle('Habilidades', rightX, yR, rightW);
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    let sx = rightX;
    let sy = yR;
    skills.forEach(skill => {
      const sw = doc.getTextWidth(skill) + 8;
      if (sx + sw > rightX + rightW) { sx = rightX; sy += 7; }
      doc.setFillColor(240, 237, 233);
      doc.roundedRect(sx, sy - 4, sw, 6, 1, 1, 'F');
      doc.setFillColor(R,G,B);
      doc.roundedRect(sx, sy - 4, 2, 6, 0.5, 0.5, 'F');
      doc.setTextColor(30, 25, 20);
      doc.text(skill, sx + 4, sy);
      sx += sw + 4;
    });
    yR = sy + 12;
  }

  // Idiomas
  if (langs.length) {
    yR = sectionTitle('Idiomas', rightX, yR, rightW);
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 45, 40);
    langs.forEach(lang => {
      doc.text(`• ${lang}`, rightX, yR);
      yR += 6;
    });
  }

  // ============ FOOTER ============
  doc.setFillColor(R, G, B);
  doc.rect(0, H - 10, W, 10, 'F');
  doc.setFont(font, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(255,255,255);
  const footerText = `${name} · CV generado en pagina desarrollada por mi persona`;
  doc.text(footerText, W/2 - doc.getTextWidth(footerText)/2, H - 4);

  // ============ GUARDAR ============
  const filename = (name.replace(/\s+/g,'_') || 'CV') + '_CV.pdf';
  doc.save(filename);
}
