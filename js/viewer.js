// PDF.js 4.10.38 (ES modules). For production, vendor these two files locally.
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

// Only allow PDFs explicitly registered here (do not accept arbitrary URL parameters).
const projects = {
  gongsil: { title: '공실투데이', file: './assets/pdf/gongsil.pdf' },
  afterschool: { title: '방과후드림', file: './assets/pdf/dream.pdf' },
  korfin: { title: '한국핀테크산업협회', file: './assets/pdf/korfin.pdf' },
  inis: { title: '아이엔아이소프트', file: './assets/pdf/inis.pdf' },
};
const $ = (id) => document.getElementById(id);
const key = new URLSearchParams(location.search).get('project') || 'gongsil';
const project = projects[key];
const viewport = $('viewport');
let pdf, scale = 1, fitMode = 'width', currentPage = 1, renderId = 0;
let pageNodes = [], pageHeights = [], visibleObserver;

function showStatus(message) { $('status').textContent = message; }
function syncPage(page) { currentPage = Math.max(1, Math.min(pdf?.numPages || 1, page)); $('pageNumber').value = currentPage; document.querySelectorAll('.thumb').forEach((el, i) => el.classList.toggle('active', i + 1 === currentPage)); }
function goTo(page) { const target = pageNodes[page - 1]; if (!target) return; syncPage(page); viewport.scrollTo({ top: target.offsetTop - $('pages').offsetTop - 14, behavior: 'smooth' }); }
async function getFitScale() { if (!pdf) return 1; const p = await pdf.getPage(1), v = p.getViewport({ scale: 1 }); const width = Math.max(120, viewport.clientWidth - 42); const height = Math.max(120, viewport.clientHeight - 36); return fitMode === 'page' ? Math.min(width / v.width, height / v.height) : width / v.width; }
async function render() {
  if (!pdf) return; const thisRender = ++renderId; showStatus('페이지를 표시하는 중입니다.'); $('pages').replaceChildren(); pageNodes = []; pageHeights = []; let targetScale = fitMode === 'manual' ? scale : await getFitScale(); scale = targetScale; $('zoomLabel').textContent = Math.round(scale * 100) + '%';
  for (let i = 1; i <= pdf.numPages; i++) {
    if (thisRender !== renderId) return;
    const page = await pdf.getPage(i); const vp = page.getViewport({ scale }); const wrapper = document.createElement('div'); wrapper.className = 'page'; wrapper.style.width = vp.width + 'px'; wrapper.style.height = vp.height + 'px'; wrapper.dataset.page = i; const canvas = document.createElement('canvas'); wrapper.append(canvas); $('pages').append(wrapper); pageNodes.push(wrapper); pageHeights.push(vp.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.floor(vp.width * ratio); canvas.height = Math.floor(vp.height * ratio); canvas.style.width = vp.width + 'px'; canvas.style.height = vp.height + 'px'; const ctx = canvas.getContext('2d'); await page.render({ canvasContext: ctx, viewport: vp, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined }).promise;
  }
  if (thisRender !== renderId) return; showStatus(''); syncPage(currentPage); goTo(currentPage);
}
async function makeThumbnails() { const root = $('thumbnails'); root.replaceChildren(); for (let i = 1; i <= pdf.numPages; i++) { const page = await pdf.getPage(i); const v = page.getViewport({ scale: 1 }); const s = Math.min(140 / v.width, 175 / v.height); const vp = page.getViewport({ scale: s }); const btn = document.createElement('button'); btn.className = 'thumb'; btn.type = 'button'; btn.setAttribute('aria-label', `${i}페이지로 이동`); const canvas = document.createElement('canvas'); canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height); canvas.style.width = vp.width + 'px'; canvas.style.height = vp.height + 'px'; await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise; const num = document.createElement('span'); num.textContent = i; btn.append(canvas, num); btn.onclick = () => goTo(i); root.append(btn); } syncPage(currentPage); }
function setZoom(next) { fitMode = 'manual'; scale = Math.max(.35, Math.min(3, next)); render(); }
$('toggleSidebar').onclick = () => $('sidebar').classList.toggle('closed'); $('prevPage').onclick = () => goTo(currentPage - 1); $('nextPage').onclick = () => goTo(currentPage + 1); $('zoomOut').onclick = () => setZoom(scale - .15); $('zoomIn').onclick = () => setZoom(scale + .15); $('fitWidth').onclick = () => { fitMode = 'width'; render(); }; $('fitPage').onclick = () => { fitMode = 'page'; render(); }; $('pageNumber').onchange = () => goTo(Number($('pageNumber').value) || 1);
let scrollQueued = false; viewport.addEventListener('scroll', () => { if (scrollQueued || !pdf) return; scrollQueued = true; requestAnimationFrame(() => { scrollQueued = false; const center = viewport.getBoundingClientRect().top + viewport.clientHeight * .32; let best = 1, distance = Infinity; pageNodes.forEach((node, i) => { const r = node.getBoundingClientRect(); const d = Math.abs(r.top + r.height * .3 - center); if (d < distance) { distance = d; best = i + 1; } }); syncPage(best); }); });
let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (fitMode !== 'manual') render(); }, 180); });
if (window.innerWidth <= 850) $('sidebar').classList.add('closed');
(async () => { if (!project) { showStatus('등록되지 않은 프로젝트입니다.'); return; } document.title = project.title; $('documentTitle').textContent = project.title; try { pdf = await pdfjsLib.getDocument({ url: project.file }).promise; $('pageCount').textContent = '/ ' + pdf.numPages; await render(); makeThumbnails().catch(console.error); } catch (err) { console.error(err); showStatus('PDF를 열 수 없습니다. 파일 경로와 웹 서버 실행 여부를 확인해 주세요.'); } })();
