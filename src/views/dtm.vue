<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'

/* ===============================
   PARAM
   =============================== */
const headerRowIndex = ref(0)   // riga header (0 = prima)
const POINT_COL = 'A'           // lettera colonna POINT

/* ===============================
   STATE
   =============================== */
const aoa = ref([])   // foglio come array di righe (array di celle)
const ready = ref(false)
const error = ref('')

/* ===============================
   HELPERS (per lettere Excel)
   =============================== */
// normalizza CODICI: rimuove TUTTI gli spazi (anche interni/NBSP) e mette UPPERCASE
const code = x => String(x ?? '')
  .replace(/\u00A0/g, ' ')  // NBSP -> spazio normale
  .replace(/\s+/g, '')      // elimina tutti gli spazi interni
  .toUpperCase()
  .trim()


function colIdx(col) {
    let n = 0
    for (let i = 0; i < col.length; i++) n = n * 26 + (col.charCodeAt(i) - 64)
    return n - 1
}
const cell = (rowArr, col) => rowArr[colIdx(col)] ?? ''
const s = x => String(x ?? '').trim()
const num = x => {
    if (typeof x === 'number') return x
    const t = String(x ?? '')
        .replace(/\u00A0/g, ' ') // nbsp
        .replace(/\s+/g, '')     // spazi
        .replace(',', '.')       // virgola -> punto
        .trim()
    const v = t === '' ? NaN : Number(t)
    return Number.isFinite(v) ? v : NaN
}
const oneOf = (val, arr) => arr.includes(val)

// piccolo registry per mostrare il TRACE nella modale (solo per c14 al momento)
const lastTraces = new Map()

/* ===============================
   CRITERI (ritornano: '' | 'X' | '!')
   “X” = NO, “!” = CONTROLLARE
   =============================== */

// c1: =IF(AO>0;" ";IF((AN+AU+AV+BB+BC+BD+BE)=BG;" ";"NO"))
function c1(r) {
    const AO = num(cell(r, 'AO'))
    if (AO > 0) return ''
    const sum = ['AN', 'AU', 'AV', 'BB', 'BC', 'BD', 'BE']
        .reduce((a, c) => a + (Number.isFinite(num(cell(r, c))) ? num(cell(r, c)) : 0), 0)
    const BG = num(cell(r, 'BG'))
    return sum === BG ? '' : 'X'
}

// c2: =IF(OR(AA="B71"...,"Bx2"); IF(AW>0;" ";"NO"); " ")
function c2(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const set = ['B71', 'B72', 'B73', 'B74', 'B75', 'B76', 'B77', 'B81', 'B82', 'B83', 'B84', 'BX2']
    if (!oneOf(AA, set)) return ''
    const AW = num(cell(r, 'AW'))
    return (AW > 0) ? '' : 'X'
}

// c3
function c3(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const set = ['A11', 'A12', 'A13', 'A21', 'A22', 'A30']
    if (!oneOf(AA, set)) return ''
    const Q = num(cell(r, 'Q'))
    if (Q !== 1) return ''
    const AO = num(cell(r, 'AO'))
    return (AO > 0) ? 'X' : ''
}

// c4
function c4(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    if (!oneOf(AA, ['A22', 'G21'])) return ''
    const AM = num(cell(r, 'AM'))
    return AM === 5 ? '' : 'X'
}

// c5
function c5(r) {
    const AI = num(cell(r, 'AI'))
    const ok = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500]
    return oneOf(AI, ok) ? '' : 'X'
}

// c6
function c6(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const set = ['B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B21', 'B22', 'B23', 'B31', 'B32', 'B33', 'B34', 'B35', 'B36', 'B37', 'B41', 'B42', 'B43', 'B44', 'B45', 'B51', 'B52', 'B53', 'B54', 'B55']
    if (!oneOf(AA, set)) return ''
    const Q = num(cell(r, 'Q'))
    if (Q !== 1) return ''
    const AO = num(cell(r, 'AO'))
    return AO === 100 ? '' : 'X'
}

// c7
function c7(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const inC = ['C10', 'C21', 'C22', 'C23', 'C31', 'C32', 'C33', 'C1', 'C2', 'C3']
    const AG = s(cell(r, 'AG')).toUpperCase()
    return (oneOf(AA, inC) && AG === 'U111') ? 'X' : ''
}

// c8
function c8(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const AG = s(cell(r, 'AG')).toUpperCase()
    if (!(AA === 'E30' && AG === 'U112')) return ''
    const AO = num(cell(r, 'AO'))
    return (AO > 0) ? '' : 'X'
}

// c9
function c9(r) {
    const P = num(cell(r, 'P'))
    if (!(P === 1 || P === 2)) return ''
    const AD = s(cell(r, 'AD')).toUpperCase()
    const AA = s(cell(r, 'AA')).toUpperCase()
    const set = [
        'A', 'A1', 'A2', 'A3', 'B', 'B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B8', 'C', 'C1', 'C2', 'C3',
        'D', 'D1', 'D2', 'E', 'E1', 'E2', 'E3', 'F', 'F1', 'F2', 'F3', 'F4', 'G', 'G1', 'G2', 'G3', 'G4', 'G5', 'H', 'H1', 'H2'
    ]
    return (oneOf(AD, set) || oneOf(AA, set)) ? 'X' : ''
}

// c10
function c10(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const AG = s(cell(r, 'AG')).toUpperCase()
    if (!(AA === 'E30' && AG === 'U111')) return ''
    const BS = num(cell(r, 'BS'))
    return BS === 1 ? '' : 'X'
}

// c11
function c11(r){
  const AA = code(cell(r,'AA'))
  const set = [
    'BX1','BX2','B11','B12','B13','B14','B15','B16','B17','B18','B19',
    'B21','B22','B23','B31','B32','B33','B34','B35','B36','B37',
    'B41','B42','B43','B44','B45','B51','B52','B53','B54','B55',
    'B71','B72','B73','B74','B75','B76','B77','B81','B82','B83','B84'
  ]
  if (!set.includes(AA)) return ''
  const AC = num(cell(r,'AC'))
  if (AC === 1) return ''
  const BO = num(cell(r,'BO'))
  return BO === 1 ? '' : 'X'
}



// c12
function c12(r) {
    const BU = num(cell(r, 'BU'))
    return ([1, 2, 3, 6].includes(BU)) ? '!' : ''
}

// c13
function c13(r){
  const CG = num(cell(r,'CG'))
  if (CG !== 1) return ''
  const AD = code(cell(r,'AD'))
  const BS = num(cell(r,'BS'))
  const bad = ['0','8','F10','F20','F30','F40']
  return (bad.includes(AD) || (AD === 'E30' && BS === 2)) ? 'X' : ''
}



// c14
function c14(r){
  const CG = num(cell(r,'CG'))
  if (CG !== 2) return ''

  const AAraw = cell(r,'AA')
  const ADraw = cell(r,'AD')
  const BS    = num(cell(r,'BS'))

  // ⬇️ normalizzo codici (toglie spazi interni / NBSP)
  const AA = code(AAraw)
  const AD = code(ADraw)

  const inC = ['C10','C21','C22','C23','C31','C32','C33']
  const bad = ['0','8','F10','F20','F30','F40']

  let res
  if (!inC.includes(AA)) res = 'X'                                  // → "NO"
  else res = (bad.includes(AD) || (AD === 'E30' && BS === 2)) ? 'X' : ''

  // Trace utile se clicchi c14 nella tabella (facoltativo)
  lastTraces.set('c14', {
    RAW:  { CG: s(cell(r,'CG')), AA: s(AAraw), AD: s(ADraw), BS: s(cell(r,'BS')) },
    NORM: { CG, AA, AD, BS },
    FLAGS:{ isCG2: CG===2, isAAinC: inC.includes(AA), isADbad: bad.includes(AD), isE30andBS2: (AD==='E30' && BS===2) },
    result: res || 'OK'
  })

  return res
}


// c15
function c15(r) {
    const N = num(cell(r, 'N'))
    if (!(N < 5)) return ''
    const CM = s(cell(r, 'CM')).toUpperCase()
    if (CM === '') return ''
    const AA = s(cell(r, 'AA')).toUpperCase()
    return (CM === AA) ? '' : 'X'
}

// c16
function c16(r) {
    const AC = num(cell(r, 'AC'))
    const ACraw = s(cell(r, 'AC'))
    const BP = num(cell(r, 'BP'))
    if (AC === 1 || AC === 0 || ACraw === '') return ''
    if (AC > 1 && AC <= 25 && BP === 1) return ''
    if (AC >= 25 && AC <= 50 && BP === 2) return ''
    if (AC >= 50 && AC <= 75 && BP === 3) return ''
    if (AC >= 75 && BP === 4) return ''
    return 'X'
}

// c17
function c17(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const inC = ['C10', 'C21', 'C22', 'C23', 'C31', 'C32', 'C33', 'C1', 'C2', 'C3']
    if (!oneOf(AA, inC)) return ''
    const BJ = num(cell(r, 'BJ'))
    const AM = num(cell(r, 'AM'))
    return (BJ === 1 && [3, 4, 5].includes(AM)) ? 'X' : ''
}

// c18
function c18(r) {
    const P = num(cell(r, 'P'))
    const Z = num(cell(r, 'Z'))
    if (!(P === 3 && Z === 4)) return ''
    const AA = s(cell(r, 'AA')).toUpperCase()
    const set = ['A', 'A1', 'A2', 'A3', 'B', 'B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B8', 'BX1', 'BX2',
        'C', 'C1', 'C2', 'C3', 'D', 'D1', 'D2', 'E', 'E1', 'E2', 'E3', 'F', 'F1', 'F2', 'F3', 'F4',
        'G', 'G1', 'G2', 'G3', 'G4', 'H', 'H1', 'H2']
    return oneOf(AA, set) ? 'X' : ''
}

// c19
function c19(r) {
    const P = num(cell(r, 'P'))
    const Z = num(cell(r, 'Z'))
    if (!(P === 3 && [1, 2, 3].includes(Z))) return ''
    const AA = s(cell(r, 'AA')).toUpperCase()
    const set = ['A', 'A1', 'A2', 'A3', 'B', 'B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B8', 'C', 'C1',
        'D', 'D1', 'D2', 'E', 'E1', 'E2', 'E3', 'F', 'F1', 'F2', 'F3', 'F4', 'G', 'G1', 'G2', 'G3', 'G4',
        'H', 'H1', 'H2']
    return oneOf(AA, set) ? 'X' : ''
}

// c20
function c20(r) {
    const AA = s(cell(r, 'AA')).toUpperCase()
    const AI = num(cell(r, 'AI'))
    return ((AA === 'A12' || AA === 'A11') && AI === 100) ? '!' : ''
}

// c21
function c21(r) {
    const CN = s(cell(r, 'CN')).toUpperCase()
    return CN === 'SI' ? '!' : ''
}

// c22
function c22(r) {
    const BN = num(cell(r, 'BN'))
    return BN === 1 ? 'X' : ''
}

/* ordinamento criteri + label (tooltip) */
const CRIT = [
    { key: 'c1', fn: c1, label: 'AO>0 ok; altrimenti (AN+AU+AV+BB+BC+BD+BE)=BG?' },
    { key: 'c2', fn: c2, label: 'AA∈{B71..B77,B81..B84,BX2} ⇒ AW>0' },
    { key: 'c3', fn: c3, label: 'AA∈{A11,A12,A13,A21,A22,A30} & Q=1 ⇒ AO=0' },
    { key: 'c4', fn: c4, label: 'AA∈{A22,G21} ⇒ AM=5' },
    { key: 'c5', fn: c5, label: 'AI ∈ {100,200,...,1500}' },
    { key: 'c6', fn: c6, label: 'AA∈Bxx & Q=1 ⇒ AO=100' },
    { key: 'c7', fn: c7, label: 'AA∈C* & AG="U111" vietato' },
    { key: 'c8', fn: c8, label: 'AA="E30" & AG="U112" ⇒ AO>0' },
    { key: 'c9', fn: c9, label: 'Se P∈{1,2} AA o AD non macro-codici' },
    { key: 'c10', fn: c10, label: 'AA="E30" & AG="U111" ⇒ BS=1' },
    { key: 'c11', fn: c11, label: 'AA in elenco ⇒ (AC=1) OR (BO=1)' },
    { key: 'c12', fn: c12, label: 'BU ∈ {1,2,3,6} ⇒ CONTROLLARE' },
    { key: 'c13', fn: c13, label: 'CG=1 & (AD∈{0,8,F*} OR AD="E30"&BS=2)' },
    { key: 'c14', fn: c14, label: 'CG=2 ⇒ AA deve essere C* e AD non “vietato”' },
    { key: 'c15', fn: c15, label: 'Se N<5 ⇒ CM vuoto o = AA' },
    { key: 'c16', fn: c16, label: 'Range AC vs BP (1:0-25;2:25-50;3:50-75;4:≥75)' },
    { key: 'c17', fn: c17, label: 'AA∈C* & BJ=1 & AM∈{3,4,5} vietato' },
    { key: 'c18', fn: c18, label: 'P=3 & Z=4 ⇒ AA non macro' },
    { key: 'c19', fn: c19, label: 'P=3 & Z∈{1,2,3} ⇒ AA non macro' },
    { key: 'c20', fn: c20, label: 'AA∈{A11,A12} & AI=100 ⇒ CONTROLLARE' },
    { key: 'c21', fn: c21, label: 'CN="SI" ⇒ CONTROLLARE' },
    { key: 'c22', fn: c22, label: 'BN=1 vietato' },
]

/* ===============================
   LOAD EXCEL
   =============================== */
function onFile(e) {
    reset()
    const f = e.target.files?.[0]
    if (!f) return
    const fr = new FileReader()
    fr.onload = ev => {
        try {
            const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' })
            const ws = wb.Sheets[wb.SheetNames[0]]
            const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
            if (!data.length) throw new Error('Foglio vuoto.')
            const h = Math.min(Math.max(0, headerRowIndex.value), data.length - 1)
            aoa.value = data.slice(h + 1) // solo righe dati
            ready.value = true
        } catch (err) { error.value = err?.message || String(err) }
    }
    fr.readAsArrayBuffer(f)
}
function reset() {
    aoa.value = []; ready.value = false; error.value = ''
}

/* ===============================
   TAB VIEW
   =============================== */
const tableRows = computed(() => {
    if (!ready.value) return []
    return aoa.value.map(row => {
        const point = s(cell(row, POINT_COL))
        const checks = CRIT.map(c => c.fn(row))
        const ctrl = checks.some(v => v === 'X' || v === '!') ? '!' : ''
        return { point, checks, ctrl }
    })
})

/* ===============================
   DEBUG on click (modal)
   =============================== */
const debugOpen = ref(false)
const debugInfo = ref({ point: '', crit: '', label: '', values: [] })

function valuesForCrit(rowArr, idx) {
    // valori principali per quella regola (per aiutare il confronto con Excel)
    switch (idx + 1) {
        case 1: return ['AO', 'AN', 'AU', 'AV', 'BB', 'BC', 'BD', 'BE', 'BG']
        case 2: return ['AA', 'AW']
        case 3: return ['AA', 'Q', 'AO']
        case 4: return ['AA', 'AM']
        case 5: return ['AI']
        case 6: return ['AA', 'Q', 'AO']
        case 7: return ['AA', 'AG']
        case 8: return ['AA', 'AG', 'AO']
        case 9: return ['P', 'AD', 'AA']
        case 10: return ['AA', 'AG', 'BS']
        case 11: return ['AA', 'AC', 'BO']
        case 12: return ['BU']
        case 13: return ['CG', 'AD', 'BS']
        case 14: return ['CG', 'AA', 'AD', 'BS']
        case 15: return ['N', 'CM', 'AA']
        case 16: return ['AC', 'BP']
        case 17: return ['AA', 'BJ', 'AM']
        case 18: return ['P', 'Z', 'AA']
        case 19: return ['P', 'Z', 'AA']
        case 20: return ['AA', 'AI']
        case 21: return ['CN']
        case 22: return ['BN']
        default: return []
    }
}
function showDebug(rowArr, critIdx) {
    const c = CRIT[critIdx]
    const point = s(cell(rowArr, POINT_COL))
    const cols = valuesForCrit(rowArr, critIdx)
    const values = cols.map(k => `${k}: ${s(cell(rowArr, k))}`)
    debugInfo.value = { point, crit: `c${critIdx + 1}`, label: c.label, values }
    debugOpen.value = true
    // se sto aprendo c14, appendi TRACE RAW/NORM/FLAGS
    if (c.key === 'c14') {
        const tr = lastTraces.get('c14')
        if (tr) {
            debugInfo.value.values.push('— RAW —')
            Object.entries(tr.RAW).forEach(([k, v]) => debugInfo.value.values.push(`${k}: ${v}`))
            debugInfo.value.values.push('— NORM —')
            Object.entries(tr.NORM).forEach(([k, v]) => debugInfo.value.values.push(`${k}: ${v}`))
            debugInfo.value.values.push('— FLAGS —')
            Object.entries(tr.FLAGS).forEach(([k, v]) => debugInfo.value.values.push(`${k}: ${v}`))
            debugInfo.value.values.push(`result: ${tr.result}`)
        }
    }

}
</script>

<template>
    <section class="wrap">
        <h1>Controlli (POINT + c1…c22)</h1>
        <div class="controls">
            <label>Riga header:
                <input type="number" v-model.number="headerRowIndex" min="0" />
            </label>
            <input type="file" accept=".xlsx,.xls" @change="onFile" />
            <span v-if="error" class="err">Errore: {{ error }}</span>
            <span v-if="ready" class="info">Punti: {{ tableRows.length }}</span>
        </div>

        <div v-if="ready" class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>POINT</th>
                        <th v-for="(c, i) in CRIT" :key="c.key" :title="c.label">c{{ i + 1 }}</th>
                        <th title="Controllo finale (almeno un NO/CONTROLLARE)">CTRL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(r, idx) in tableRows" :key="idx">
                        <td class="point">{{ r.point }}</td>
                        <td v-for="(v, i) in r.checks" :key="i" :class="{ 'hit': v === 'X', 'warn': v === '!' }"
                            @click="showDebug(aoa[idx], i)">
                            {{ v }}
                        </td>
                        <td :class="{ 'warn': r.ctrl === '!' }">{{ r.ctrl }}</td>
                    </tr>
                </tbody>
            </table>
            <p class="legend">“X” = NO • “!” = CONTROLLARE • Passa il mouse su c# per il testo completo del criterio.
                Clicca una cella per aprire il debug.</p>
        </div>

        <!-- DEBUG MODAL -->
        <div v-if="debugOpen" class="dbg">
            <div class="dbg-card">
                <div class="dbg-head">
                    <div><strong>{{ debugInfo.crit }}</strong> — {{ debugInfo.label }}</div>
                    <button class="dbg-close" @click="debugOpen = false">×</button>
                </div>
                <div class="dbg-body">
                    <div><b>POINT:</b> {{ debugInfo.point }}</div>
                    <ul>
                        <li v-for="(ln, i) in debugInfo.values" :key="i">{{ ln }}</li>
                    </ul>
                    <small>Confronta questi valori con Excel per la stessa riga.</small>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.wrap {
    max-width: 1200px;
    margin: 1.25rem auto;
    padding: 0 1rem;
    background: #e8f9ff
}

.controls {
    display: flex;
    gap: .75rem;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: .75rem
}

.controls input[type="number"] {
    width: 6rem
}

.err {
    color: #b00020
}

.info {
    color: #555
}

.table-wrap {
    overflow: auto;
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fff
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px
}

th,
td {
    padding: .5rem .6rem;
    border-bottom: 1px solid #f2f2f2;
    white-space: nowrap;
    text-align: center
}

th {
    position: sticky;
    top: 0;
    background: #fafafa
}

td.point {
    text-align: left;
    font-weight: 600
}

td.hit {
    background: #ffe6d9;
    color: #7b2e00;
    font-weight: 700
}

/* X = NO */
td.warn {
    background: #fff5cc;
    color: #6b5a00;
    font-weight: 700
}

/* ! = CONTROLLARE */
.legend {
    color: #667;
    margin: .6rem 0
}

/* debug modal */
.dbg {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50
}

.dbg-card {
    background: #fff;
    border-radius: 12px;
    min-width: 480px;
    max-width: 800px;
    padding: .75rem 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, .25)
}

.dbg-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem
}

.dbg-close {
    border: 0;
    background: transparent;
    font-size: 22px;
    cursor: pointer
}

.dbg-body {
    max-height: 55vh;
    overflow: auto
}

.dbg-body ul {
    columns: 2;
    gap: 2rem;
    margin: .5rem 0;
    padding-left: 1rem
}
</style>
